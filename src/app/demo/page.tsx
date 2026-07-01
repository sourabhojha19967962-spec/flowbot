'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Send,
  User,
  Workflow,
  Database,
  Globe,
  Cpu,
  ArrowRight,
  Zap,
  MessageSquare,
  Sparkles,
  RotateCcw,
  BookOpen,
  Shield,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

// Types
interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  nodesTriggered?: string[];
  knowledgeBaseHit?: boolean;
  topic?: string | null;
}

interface WorkflowNode {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  color: string;
  description: string;
}

const quickActions = [
  { label: 'Annual Fees', message: 'What are the joining and annual fees for ICICI credit cards?', icon: Zap },
  { label: 'Interest Rates', message: 'What are the finance charges and interest rates?', icon: Cpu },
  { label: 'Lost Card', message: 'What should I do if my credit card is lost or stolen?', icon: AlertCircle },
  { label: 'Reward Points', message: 'How do reward points and capping work?', icon: Database },
];

const defaultNodes: WorkflowNode[] = [
  { id: 'webhook', label: 'Webhook', icon: <Globe className="w-4 h-4" />, active: false, color: 'emerald', description: 'Receives user message' },
  { id: 'kb', label: 'Knowledge Base', icon: <Database className="w-4 h-4" />, active: false, color: 'amber', description: 'Searches FAQ docs' },
  { id: 'agent', label: 'AI Agent', icon: <Cpu className="w-4 h-4" />, active: false, color: 'violet', description: 'Processes with LLM' },
  { id: 'response', label: 'Response', icon: <MessageSquare className="w-4 h-4" />, active: false, color: 'sky', description: 'Sends reply to user' },
];

const fallbackNodes: WorkflowNode[] = [
  { id: 'webhook', label: 'Webhook', icon: <Globe className="w-4 h-4" />, active: false, color: 'emerald', description: 'Receives user message' },
  { id: 'agent', label: 'AI Agent', icon: <Cpu className="w-4 h-4" />, active: false, color: 'violet', description: 'Processes with LLM' },
  { id: 'fallback', label: 'Fallback Handler', icon: <AlertCircle className="w-4 h-4" />, active: false, color: 'rose', description: 'No KB match found' },
  { id: 'response', label: 'Response', icon: <MessageSquare className="w-4 h-4" />, active: false, color: 'sky', description: 'Sends reply to user' },
];

function getNodeColor(color: string, active: boolean) {
  const colors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-600', glow: 'shadow-emerald-500/30' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-600', glow: 'shadow-amber-500/30' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/40', text: 'text-violet-600', glow: 'shadow-violet-500/30' },
    sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/40', text: 'text-sky-600', glow: 'shadow-sky-500/30' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-600', glow: 'shadow-rose-500/30' },
  };
  const c = colors[color] || colors.sky;
  return active ? c : { bg: 'bg-muted/50', border: 'border-border', text: 'text-muted-foreground', glow: '' };
}

export default function DemoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>(defaultNodes);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [sessionId] = useState(() => `user-${Math.random().toString(36).substr(2, 9)}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const animateNodes = useCallback(async (nodesTriggered: string[], isFallback: boolean) => {
    const targetNodes = isFallback ? fallbackNodes : defaultNodes;
    setWorkflowNodes(targetNodes.map(n => ({ ...n, active: false })));

    for (let i = 0; i < nodesTriggered.length; i++) {
      const nodeName = nodesTriggered[i];
      await new Promise(resolve => setTimeout(resolve, 400));
      setWorkflowNodes(prev => prev.map(n =>
        n.label === nodeName ? { ...n, active: true } : n
      ));
      setActiveNodeId(nodeName);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    setActiveNodeId(null);
  }, []);

  const sendMessage = useCallback(async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    setInput('');
    setIsLoading(true);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      });

      const data = await res.json();
      await animateNodes(data.nodesTriggered || ['Webhook', 'AI Agent', 'Response'], !data.knowledgeBaseHit);

      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        role: 'bot',
        content: data.reply,
        timestamp: new Date(),
        nodesTriggered: data.nodesTriggered,
        knowledgeBaseHit: data.knowledgeBaseHit,
        topic: data.topic,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        role: 'bot',
        content: "I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, sessionId, animateNodes]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setWorkflowNodes(defaultNodes.map(n => ({ ...n, active: false })));
    setActiveNodeId(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              Solvio
            </a>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Workflow className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-slate-900">Live Demo</h1>
                <p className="text-[11px] text-slate-500">n8n + AI Support Bot</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs gap-1 border-emerald-300 text-emerald-700 bg-emerald-50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </Badge>
            <Button variant="ghost" size="sm" onClick={resetChat} className="text-slate-500 hover:text-slate-700">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left: Workflow Visualization */}
        <div className="lg:w-[340px] shrink-0">
          <Card className="p-4 border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Workflow className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-semibold text-slate-700">Workflow Pipeline</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Watch how your message flows through the n8n-style pipeline in real time.
            </p>

            <div className="space-y-2">
              {workflowNodes.map((node, index) => {
                const c = getNodeColor(node.color, node.active);
                const isActive = activeNodeId === node.label;
                return (
                  <div key={node.id}>
                    <motion.div
                      animate={{
                        scale: isActive ? 1.03 : 1,
                        boxShadow: isActive ? '0 0 20px rgba(16, 185, 129, 0.2)' : '0 0 0px rgba(0,0,0,0)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${c.bg} ${c.border} ${isActive ? `shadow-lg ${c.glow}` : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${node.active ? 'bg-emerald-100' : 'bg-slate-100'} ${c.text}`}>
                        {node.icon}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium transition-colors duration-300 ${c.text}`}>
                          {node.label}
                          {isActive && (
                            <motion.span
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="ml-2 inline-flex items-center"
                            >
                              <Zap className="w-3 h-3 text-amber-500" />
                            </motion.span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 truncate">{node.description}</div>
                      </div>
                      {node.active && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto shrink-0"
                        >
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </motion.div>
                      )}
                    </motion.div>
                    {index < workflowNodes.length - 1 && (
                      <div className="flex justify-center py-1">
                        <motion.div
                          animate={{ opacity: workflowNodes[index].active ? 1 : 0.3 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Knowledge base: 31 MITC topics indexed</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>Model: GPT-4o-mini (AI-powered)</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 border-slate-200 shadow-sm mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-700">Quick Questions</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="text-xs h-9 justify-start gap-1.5 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
                  onClick={() => sendMessage(action.message)}
                  disabled={isLoading}
                >
                  <action.icon className="w-3.5 h-3.5 shrink-0" />
                  {action.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Chat Interface */}
        <div className="flex-1 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col border-slate-200 shadow-sm overflow-hidden">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">ICICI Card Assistant</h2>
                    <p className="text-slate-500 text-sm max-w-md mb-6">
                      Ask me anything about ICICI Bank Credit Cards — fees, charges, reward points, billing, EMI, lounge access, and more. Powered by the official MITC document.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quickActions.map((action) => (
                        <Button
                          key={action.label}
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1.5 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                          onClick={() => sendMessage(action.message)}
                        >
                          <action.icon className="w-3.5 h-3.5" />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-4 pb-2">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'bot' && (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-sm">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user'
                              ? 'bg-emerald-600 text-white rounded-br-md'
                              : 'bg-slate-100 text-slate-800 rounded-bl-md'
                          }`}
                        >
                          {msg.content}
                        </div>
                        {msg.role === 'bot' && msg.knowledgeBaseHit !== undefined && (
                          <div className="flex items-center gap-2 mt-1.5 px-1">
                            {msg.knowledgeBaseHit ? (
                              <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-600 bg-emerald-50 gap-1">
                                <Database className="w-2.5 h-2.5" />
                                KB: {msg.topic || 'matched'}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-600 bg-amber-50 gap-1">
                                <AlertCircle className="w-2.5 h-2.5" />
                                No KB match
                              </Badge>
                            )}
                            {msg.nodesTriggered && (
                              <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500 bg-slate-50 gap-1">
                                <Workflow className="w-2.5 h-2.5" />
                                {msg.nodesTriggered.length} nodes
                              </Badge>
                            )}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 mt-1 px-1">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <motion.div
                            className="w-2 h-2 bg-emerald-400 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-emerald-400 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-emerald-400 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-slate-100 p-3 bg-white/80 backdrop-blur-sm">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about ICICI credit cards..."
                  disabled={isLoading}
                  className="flex-1 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20 text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !input.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                Powered by ICICI Bank MITC document (updated Mar 5, 2026).
              </p>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <a href="/" className="hover:text-emerald-600 transition-colors">Back to Solvio</a>
          <span>Powered by Solvio AI</span>
        </div>
      </footer>
    </div>
  );
}
