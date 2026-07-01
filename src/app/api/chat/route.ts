import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// ICICI Bank Credit Card MITC Knowledge Base
// Based on the official "Most Important Terms and Conditions" document (March 5, 2026)

const knowledgeBase = [
  {
    topic: "Joining & Annual Fees",
    keywords: ["joining fee", "annual fee", "fee", "cost", "charge", "sapphiro", "rubyx", "coral", "emeralde", "platinum", "signature", "times black", "amazon pay", "hpcl", "manchester", "chennai super kings", "adani", "makemytrip", "unifare", "expressions", "parakram", "emirates"],
    answer: "ICICI Bank Credit Card Joining & Annual Fees (1st year / 2nd year onwards):\n\n• **Times Black ICICI Bank Credit Card**: Joining ₹20,000 | Annual (2nd yr+) ₹20,000 | Supplementary ₹3,500\n• **Emeralde Private Metal**: Joining ₹12,499 | Annual ₹12,499 | Supplementary ₹3,500 (w.e.f Jan 15, 2026)\n• **Emeralde Private**: Joining ₹12,000 | Annual ₹12,000 | Supplementary Nil\n• **Emeralde**: Joining ₹12,000 | Annual ₹12,000 | Supplementary Nil\n• **Sapphiro**: Joining ₹6,500 | Annual (2nd yr+) ₹3,500 | Supplementary ₹199\n• **Rubyx**: Joining ₹3,000 | Annual (2nd yr+) ₹2,000 | Supplementary ₹199\n• **Coral**: Joining ₹500 | Annual ₹500 | Supplementary ₹199\n• **Platinum Chip**: Joining Nil | Annual Nil | Supplementary ₹199\n• **Signature**: Joining ₹25,000 | Annual (2nd yr+) ₹2,000 | Supplementary ₹199\n• **Amazon Pay ICICI Bank**: Joining Nil | Annual Nil | Supplementary Nil\n• **HPCL Super Saver**: Joining ₹500 | Annual ₹500 | Supplementary ₹199\n• **MakeMyTrip ICICI Bank**: Joining ₹999 | Annual ₹999 | Supplementary ₹199\n• **Manchester United Signature**: Joining ₹2,499 | Annual ₹2,499 | Supplementary ₹199\n• **Chennai Super Kings**: Joining ₹500 | Annual ₹500 | Supplementary ₹199\n• **Adani One Signature**: Joining ₹5,000 | Annual ₹5,000 | Supplementary ₹199\n• **Adani One Platinum**: Joining ₹750 | Annual ₹750 | Supplementary ₹199\n• **Emirates Skywards Emeralde**: Joining ₹10,000 | Annual ₹10,000 | Supplementary ₹199\n• **Emirates Skywards Sapphiro**: Joining ₹5,000 | Annual ₹5,000 | Supplementary ₹199\n• **Emirates Skywards Rubyx**: Joining ₹1,000 | Annual ₹1,000 | Supplementary ₹199\n• **Diamant World Mastercard**: Joining ₹1,25,000 | Annual ₹10,000 | Supplementary Nil\n\n**Annual Fee Reversal**: If total spends equal or exceed the threshold during an anniversary year, the Annual Fee for the subsequent year shall be reversed. EMI transactions are NOT included in total spends calculation.\n\n**Mine Credit Card Plans**: Starter (Free) | Pro (₹49/month, reversal at ₹10,000 spends) | Premium (₹149/month, reversal at ₹20,000 spends)"
  },
  {
    topic: "Finance Charges & Interest Rates",
    keywords: ["finance charge", "interest", "rate", "apr", "monthly", "annual", "revolving", "3.75%", "45%"],
    answer: "**Finance Charges (w.e.f November 15, 2024):**\n\n• **Finance charge for revolving credit facility on retail transactions and cash advances**: 3.75% per month = **45% per annum**\n• Applicable on: Retail purchases, balance transfer, cash advances, non-payment of minimum amount due, late payment, etc.\n• The APR is the same (3.75% per month / 45% per annum) for all these cases\n\n**Interest Calculation:**\n• Interest is charged if Total Amount Due is NOT paid by payment due date\n• Interest is charged on Total Amount Due and on all new transactions (except Fees/charges and GST/Taxes) from transaction date till previous outstanding is paid in full\n• For cash advances, interest is charged from the date of transaction until date of payment\n• Rate may be changed at sole discretion of ICICI Bank\n• Can be as low as 1.25% per month (15% per annum) depending on credit history, purchase patterns, payment behavior, loyalty\n• In case of default, interest may increase up to maximum 3.75% per month (45% per annum)\n\n**W.E.F Oct 26, 2023**: Any Fee/GST transaction on customer's statement after 26/10/2023 will NOT be compounded for interest calculation."
  },
  {
    topic: "Late Payment Charges",
    keywords: ["late payment", "lpc", "penal", "due date", "missed", "overdue", "minimum amount", "mad"],
    answer: "**Late Payment Charges (w.e.f Nov 15, 2024)** — Excludes ICICI Bank Emeralde Private Metal Credit Card\n\nLate payment charges are a function of Total Amount Due minus any payment received before payment due date:\n\n• Less than ₹100: **Nil**\n• ₹100 - ₹500: **₹100**\n• ₹501 - ₹1,000: **₹500**\n• ₹1,001 - ₹5,000: **₹600**\n• ₹5,001 - ₹10,000: **₹750**\n• ₹10,001 - ₹25,000: **₹900**\n• ₹25,001 - ₹50,000: **₹1,100**\n• More than ₹50,000: **₹1,300**\n\n**Other Charges:**\n• Return of cheque: 2% of Total Amount Due (Min ₹500)\n• Auto-Debit return fee: 2% of Total Amount Due (Min ₹500)\n• Additional ₹50+GST will be debited from customer's saving bank account\n\n**Grace Period**: 3 days after payment due date. Late Payment Charges applicable if Minimum Amount Due is not paid by payment due date + 3 days grace period."
  },
  {
    topic: "Foreign Currency & Markup Charges",
    keywords: ["foreign", "currency", "international", "markup", "dcc", "dynamic currency", "conversion", "usd", "dollar", "overseas"],
    answer: "**Foreign Currency Transactions Markup: 3.50%**\n\nA refund initiated by customer on similar Foreign Currency transactions will also attract 3.5% markup fee.\n\n**Exceptions:**\n• **Emeralde Private Metal, Emeralde Private, Emeralde**: 2% markup (w.e.f Nov 15, 2024)\n• **MakeMyTrip ICICI Bank Credit Card**: 0.99% markup (not applicable on MakeMyTrip Signature and Platinum)\n• **Times Black ICICI Bank Credit Card**: 1.49% markup\n• **Amazon Pay ICICI Bank Credit Card**: 1.99% markup\n\n**Dynamic Currency Conversion (DCC) Fee (w.e.f Jan 15, 2026):**\n\n3.5% DCC fee on all transactions conducted in Indian currency at international locations OR transactions in Indian currency at merchants located in India but registered in a foreign nation.\n\n**DCC Exceptions:**\n• Emeralde Private Metal, Emeralde Private, Emeralde: 2%\n• MakeMyTrip ICICI Bank Credit Card: 0.99% (not on Signature/Platinum variants)\n• Times Black ICICI Bank Credit Card: 1.49%\n• Amazon Pay ICICI Bank Credit Card: 1.99%\n\n**Conversion Process**: If transaction is not in US Dollars, conversion happens through USD by converting charged amount to USD, then USD to INR at rates provided by VISA/MasterCard/AMEX on settlement date, increased by Currency Conversion Factor (currently 3.50%)."
  },
  {
    topic: "Cash Advance & ATM Withdrawal",
    keywords: ["cash advance", "atm", "withdrawal", "cash limit", "cash withdrawal"],
    answer: "**Cash Advance Transaction Fee:**\n\n• All cards: **2.5% on advanced amount, subject to minimum of ₹500**\n\n**Exceptions (NIL cash advance fee):**\n• ICICI Bank Emeralde Private Metal Credit Card\n• ICICI Bank Emeralde Credit Card\n• ICICI Bank Emeralde Private Credit Card\n• Times Black ICICI Bank Credit Card\n\n**Cash Limit:**\n• Cash limit is a sub-set of credit limit\n• Will be 10% of credit limit up to maximum of ₹20,000 for first 180 days from card issuance\n• After 180 days, ICICI Bank makes cash limit available at its sole discretion\n• For cash advances, interest is charged from date of transaction until date of payment\n• Cash withdrawal will NOT be allowed from CC on UPI transactions"
  },
  {
    topic: "Reward Points & Capping",
    keywords: ["reward", "points", "capping", "redeem", "redemption", "mcc", "merchant category", "expiry", "lapse"],
    answer: "**Reward Points General Rules:**\n\n• Reward points credited to rewards account within 5 working days from statement generation date\n• **Expiry**: 36 months from date of issuance\n• Reward points lapse upon card cancellation and cannot be reinstated\n• Can be redeemed on ICICI Bank Rewards Platform via iMobile or Internet Banking, also on iShop\n• Order once placed cannot be cancelled or modified\n• Gift vouchers once issued cannot be reversed/exchanged\n\n**No Reward Points for these categories:**\n• Cash transactions\n• Rent transactions (MCC 6513) — for ALL credit cards\n• E-Wallet Reload category (except Amazon Pay ICICI Bank Credit Card)\n• Fuel category (except ICICI Bank Parakram, Parakram Select, MakeMyTrip ICICI Bank, and HPCL Coral Amex variant)\n\n**Reward Points Capping (per statement cycle):**\n\nFor Emeralde / Emeralde Private / Sapphiro / Rubyx:\n• Utility Spend: ₹80,000\n• Insurance Spend: ₹80,000\n• Grocery & Departmental: ₹40,000\n\nFor Coral / Manchester United / CSK / Expressions / HPCL / Platinum Chip:\n• Utility Spend: ₹40,000\n• Insurance Spend: ₹40,000\n• Grocery & Departmental: ₹20,000\n\nFor Emeralde Private Metal (specific capping):\n• Grocery: 1,000 Reward Points/statement cycle\n• Education: 1,000 Reward Points/statement cycle\n• Insurance: 5,000 Reward Points/statement cycle\n• Utility: 1,000 Reward Points/statement cycle\n\n**Transportation Transaction Capping (w.e.f Feb 01, 2026):**\n• Rubyx, Sapphiro, Emeralde, Emeralde Private: ₹20,000\n• Platinum, HPCL, Coral, ManU, CSK, Expressions, Parakram, Secured Platinum: ₹10,000\n\n**Redemption Handling Fee:**\n• Hand-picked Rewards Scheme: ₹99\n• ICICI Bank Rewards Scheme: ₹99\n• Mine Cash Statement Credit: ₹99\n• Mine Cash Catalogue Based: ₹25\n• Online/in-store redemptions at Online Partner Brands: ₹25\n• Emeralde Private Metal / Times Black: Nil"
  },
  {
    topic: "Interest-Free Period & Grace Period",
    keywords: ["interest free", "grace period", "free period", "due date", "billing cycle", "20 days", "48 days", "18 days"],
    answer: "**Interest-Free Period:**\n\n• Ranges from **18 to 48 days**\n• Grace period of **3 days** after payment due date\n\n**Example:**\nFor statement period April 15, 2025 to May 15, 2025, payment due date would be June 2, 2025 (assuming previous month's Total Amount Due paid by due date):\n\n• Purchase dated April 24, 2025 → Interest-free from April 24 to June 2 = 40 days\n• Purchase dated May 14, 2025 → Interest-free from May 14 to June 2 = 20 days\n\n**Important:**\n• If Total Amount Due is NOT paid by payment due date + 3 days grace, there will be NO interest-free period\n• For cash advances, interest is charged from date of transaction until date of payment\n• If cardholder pays Minimum Amount Due (MAD) by payment due date + 3 days grace, no Late Payment Charges, BUT interest will be calculated from transaction date\n• Interest-free period varies depending on date of purchase"
  },
  {
    topic: "Minimum Amount Due (MAD)",
    keywords: ["minimum amount", "mad", "minimum due", "5%", "minimum payment"],
    answer: "**Minimum Amount Due (MAD):**\n\n• **5% of outstanding amount** or such other amount as determined by ICICI Bank at its sole discretion\n• In case of any repayment through instalments, the instalment amount due during statement period will be added to MAD\n• If total outstanding exceeds credit/cash limit, the excess amount is included in MAD\n• Any Fee charged over credit limit will be considered twice in MAD calculation\n• Fees/GST on statement post Oct 26, 2023 also included in MAD\n• MAD includes unpaid MAD of previous statements, if any\n\n**W.E.F March 01, 2026 — Revised MAD Calculation:**\n\n**Scenario A**: If 5% of (Finance Charge + Retail Spends + Cash Advance) is HIGHER than Finance Charge:\nMAD = GST + EMI Principal + EMI Interest + Fees & Charges (excluding GST) + Overlimit Amount + Unpaid MAD from previous statement + 5% of (Retail Spends + Cash Advance + Finance Charge)\n\n**Scenario B**: If 5% of (Finance Charge + Retail Spends + Cash Advance) is LESS than Finance Charge:\nMAD = GST + EMI Principal + EMI Interest + Fees & Charges + Finance Charge + Overlimit Amount + Unpaid MAD from previous statement + 5% of (Retail Spends + Cash Advance)\n\n**Important**: If you spend ₹5,000 and payback exactly the Minimum Amount Due every month, it will take up to **6 years and 6 months** to pay back the total amount. Always pay more than MAD when possible."
  },
  {
    topic: "EMI & Instalment Facility",
    keywords: ["emi", "instalment", "installment", "tenure", "roi", "interest rate", "processing fee", "foreclosure", "prepayment"],
    answer: "**EMI Interest Rates (per annum on reducing balance):**\n\n| Tenure | Instant EMI | EMI on Call | POS ECOM |\n|---|---|---|---|\n| 3 months | 15.99% | 15.99% | 15%-18% |\n| 6 months | 15.99% | 15.99% | 15%-18% |\n| 9 months | 15.99% | 15.99% | 15%-18% |\n| 12 months | 15.99% | 15.99% | 15%-18% |\n| 18 months | 15.99% | 15.99% | 15%-18% |\n| 24 months | 15.99% | 15.99% | 15%-18% |\n\n**Processing Fees:**\n• **Instant EMI**: 2.99% capped at maximum ₹299 + 18% GST (w.e.f Sep 01, 2025)\n• **EMI on Call**: Up to 2% of transaction value\n• **Special campaigns**: Interest rates between 9.92% and 20% with processing fees up to ₹999 or up to 2% of loan amount + 18% GST\n• 18% GST charged on interest component of EMIs\n\n**Merchant EMI Cancellation (w.e.f May 01, 2025):**\nCancellation without foreclosure charges allowed only if:\n• Full refund received from merchant as single refund transaction, OR\n• Partial refund where difference between original amount and refund is less than ₹1,500\n\n**Prepayment/Termination:**\n• Outstanding amount + all interest + all monies become repayable\n• Pre-closure charges: Up to 3% on principal outstanding amount + interest of upcoming unbilled EMI\n• Contact ICICI Bank's 24 Hour customer care to prepay\n\n**Note**: On availing EMI Facility, card holder is NOT eligible for any reward points."
  },
  {
    topic: "Fuel, Utility & Other Transaction Fees",
    keywords: ["fuel", "utility", "rent", "education", "transportation", "wallet", "gaming", "surcharge", "1%", "2%", " mcc"],
    answer: "**Transaction-Based Fees (w.e.f Nov 15, 2024 / Jan 15, 2026):**\n\n**Rent Pay Transactions** (MCC 6513): **1% fee** on transaction amount\n\n**Fuel Transactions**: **1% fee** on transactions exceeding ₹10,000 (MCC: 1361, 5172, 5541, 5542, 5983, 9752, 5555, 3851)\n\n**Utility Transactions**: **1% fee** on transactions exceeding ₹50,000 (MCC: 4899, 4900, 4901, 4814, 4821)\n\n**Transportation Transactions (w.e.f Jan 15, 2026)**: **1% fee** on transactions exceeding ₹50,000 (MCC: 4111, 4112, 4784, 4131)\n\n**Education Payments**: **1% fee** on payments made through third-party apps (MCC: 8211, 8220, 8241, 8244, 8249, 8299, 8493, 8494, 7911)\n\n**Skill-Based Gaming Transactions (w.e.f Jan 15, 2026)**: **2% fee** (MCC: 5816)\n\n**Wallet Load (w.e.f Jan 15, 2026)**: **1% fee** on transactions of ₹5,000 or more (MCC: 6540)\n\n**Fuel Surcharge Waiver (w.e.f Nov 15, 2024):**\n• 1% surcharge waiver on HPCL petrol pumps on select cards (max transaction ₹4,000, on ICICI Merchant Services swipe machines)\n• 1% surcharge waiver on all petrol pumps on select cards\n• Spends up to ₹50,000 per statement cycle\n• **Exception**: Times Black & Emeralde Private Metal — 1% waiver at all petrol pumps (max ₹4,000 per transaction, up to ₹1,00,000 per statement cycle)\n\n**Railway Booking Surcharge**: 1.80% for internet transactions, 2.50% for other bookings. For Amex network: 1.80% or ₹10 whichever is higher."
  },
  {
    topic: "Over-limit & Other Charges",
    keywords: ["over limit", "overlimit", "card replacement", "cash payment", "branch", "lounge", "validation"],
    answer: "**Over-limit Charges:**\n• 2.50% on over-limit amount (subject to minimum ₹550)\n• Excludes ICICI Bank Emeralde Private Metal and Emeralde Credit Card\n• Over-limit facility provided only with explicit customer consent as per regulatory guideline\n• Over-limit status may happen because of fees/interest charges/taxes\n\n**Card Replacement Fee (w.e.f July 1, 2024):**\n• **₹200** for all cards (was ₹100)\n• **Exception**: ₹3,500 for Emeralde Private Metal Credit Card\n• **Exception**: ₹3,500 for Times Black ICICI Bank Credit Card\n• **Exception**: ₹199 for ICICI Bank Expressions Credit Card\n\n**Cash Payment at Branches (w.e.f Jan 15, 2026):**\n• **₹150 per payment transaction** (was ₹100)\n\n**Card Validation Charges — Lounges within India:**\n• ₹2 authorisation amount on each eligible card at Participating Lounge on VISA, Mastercard, RuPay variants\n• ₹1 authorisation amount on AMEX variants\n\n**GST**: 18% applicable on all fees, interest, surcharge and other charges (w.e.f July 1, 2017)"
  },
  {
    topic: "Billing & Statement",
    keywords: ["billing", "statement", "cycle", "monthly", "e-statement", "due date", "dispute", "refund", "reversal"],
    answer: "**Billing Information:**\n\n• All Card Members billed on monthly basis\n• Only transactions settled by merchant before statement date will reflect in Current Bill\n• If transaction settles in subsequent cycle, it will be billed in subsequent statement cycle\n• No statement generated if no outstanding due and no transaction in past month\n• **E-Statement** sent to registered email ID\n• **Physical statement NOT sent** to Cardholder\n• Download/print statement via iMobile app or Internet Banking\n\n**Billing Disputes Resolution:**\n• All contents deemed correct if Card Member does NOT inform ICICI Bank of discrepancies within **60 days** of Statement Date in writing\n• On receipt of information, Bank may reverse charge/transaction on temporary basis pending investigation\n• If liability confirmed, charge/transaction reinstated in subsequent statement\n• Within 60 days, ICICI Bank provides necessary documents from Member Bank (Visa/MasterCard/Amex/RuPay)\n• GST levied will NOT be reversed on any dispute on Fees/Charges/Interest/Transaction\n\n**Refund/Failed/Reversed Transactions:**\n• Merchant refund, income reversal, chargeback/fraud credit (permanent) considered as payment\n• If reversals received after statement generation but before payment due date → adjusted against Total Amount Due (TAD) and Minimum Amount Due (MAD) on current statement cycle\n• If reversals received after payment due date but before 2 days prior to next statement generation:\n  - If TAD paid by due date → amount transferred to Bank's savings account\n  - If not paid/partially paid → adjusted against current balance, residual transferred to ICICI Bank Savings account"
  },
  {
    topic: "Payment Methods",
    keywords: ["payment", "pay", "upi", "neft", "auto debit", "cheque", "cash", "internet banking", "imobile", "click to pay", "scan to pay"],
    answer: "**Methods to Pay Credit Card Bill:**\n\n1. **Scan to Pay**: QR-Code based UPI payments\n\n2. **UPI Payment**: Through any UPI-enabled app/BHIM app to ICICI Bank\n   - New UPI ID format: `ccpay.<10-digit-mobile-number><last-4-digits-of-Card-Number>@icici`\n   - Example: If mobile is 9999999999 and last 4 digits are 1234, UPI ID = `ccay.99999999991234@icici`\n\n3. **NEFT**: Pay from other bank's Internet Banking using Transaction Code 52 and IFS Code `ICIC0000004`\n\n4. **Cash**: Deposit at any ICICI Bank branch (attracts fee of ₹150 per payment transaction w.e.f Jan 15, 2026)\n\n5. **Cheque/Draft**: Make cheque/draft favoring 'ICICI Bank Credit Card No. XXXX XXXX XXXX XXXX' and drop at branch/Skypak drop box/ATM locations. Credit limit released only post cheque realization.\n\n6. **Internet Banking**: If you hold ICICI Savings Account, pay online at https://www.icici.bank.in/\n\n7. **Auto-Debit**: If you hold ICICI Savings Account, give written instruction to debit payment from account every month on payment due date\n\n8. **Click to Pay**: Pay from other bank Savings Accounts' net banking\n\n9. **iMobile Pay app**: Login and make payment\n\n10. **ICICI Bank ATMs**: Make payments using Debit Card"
  },
  {
    topic: "Card Cancellation & Closure",
    keywords: ["cancel", "closure", "close", "terminate", "surrender", "inactive", "12 months"],
    answer: "**Card Cancellation:**\n\n**For Existing Card Account:**\n• If all credit cards not used for 12 months, process to close card shall be initiated after intimating cardholder\n• Cardholder must give explicit consent within 30 days to continue; failing which card account shall be closed\n• Subject to payment of all dues by cardholder\n\n**For New Card:**\n• Card needs to be activated within 30 days of card issuance\n• If not activated, Bank shall keep card active only with OTP based consent/activation\n• All other cards shall be closed in next 7 working days (by 37th day from card issuance date) without any cost to customer\n• Bank will NOT levy fee and NOT report to bureau unless new card is activated\n\n**Voluntary Termination:**\n• Card Member may terminate Card Account at any time with or without prior notice\n• For avoiding misuse, cut Credit Card into four pieces ensuring hologram and magnetic strip destroyed permanently\n• Write to: ICICI Bank Limited, ICICI PhoneBanking Center, ICICI Bank Tower, 7th floor, Survey no: 115/27, Plot no. 12, Nanakramguda, Serilingampally, Hyderabad – 500032, India\n• Indicate complete Card number in communication\n• Termination effective only once ICICI Bank receives payment of all amounts due and outstanding\n\n**Changes in fees/charges**: Made only with prospective effect giving prior notice of at least one month. If cardholder desires to surrender on account of change to disadvantage, permitted without extra charge subject to payment of all dues."
  },
  {
    topic: "UPI on RuPay Credit Card",
    keywords: ["upi", "rupay", "cc on upi", "p2m", "p2p", "upi pin", "4-digit", "re-register", "device change", "new device", "re-registration", "change device", "sim"],
    answer: "**UPI on RuPay Credit Card Terms:**\n\n**Eligibility:**\n• ICICI Bank RuPay Credit Card users who satisfy eligibility criteria\n• Mobile number linked with UPI app must be set as registered mobile number for ICICI Bank RuPay Credit Card\n• Facility provided subject to approval at sole discretion of ICICI Bank\n\n**Activation:**\n• Set 4-digit UPI PIN to activate UPI functionality\n• All UPI payments authenticated using 4-digit UPI PIN (NOT the Credit Card PIN)\n• Setting-up UPI PIN = customer consent for activation of card\n\n**Transaction Rules:**\n• Only P2M (Person to Merchant) transactions allowed on RuPay network\n• NOT allowed: P2P, P2PM, digital account opening, lending platform, cash withdrawal at merchant/ATM, eRUPI, IPO, Foreign Inward Remittances, Mutual Funds\n• Subject to both credit card limits AND existing UPI transaction limits (whichever is lower)\n• All fees, finance charges, surcharges applicable on Credit Card transactions also apply on CC on UPI\n• Cash withdrawal NOT allowed from CC on UPI\n• Transactions deducted from existing credit card limit\n• Cannot be set as default option to receive funds\n\n**Re-registration Required:**\n• In case of renewal or replacement of card → re-register on UPI App with updated Card details\n• In case of device change → re-register for credit card on UPI app with same SIM. Previous device application de-registered."
  },
  {
    topic: "Airport Lounge Access",
    keywords: ["lounge", "airport", "complimentary", "75000", "quarterly", "spend", "domestic"],
    answer: "**Airport Lounge Access (w.e.f Jan 01, 2025):**\n\n**Eligibility Criteria:**\n• Spend **₹75,000 in the preceding calendar quarter** to unlock complimentary lounge access in subsequent calendar quarter\n\n**Example:**\n• Spend ₹75,000 between Sep 26, 2024 to Dec 25, 2024 → Complimentary lounge access between Jan 1, 2025 to March 31, 2025\n• Spend ₹75,000 between Dec 26, 2024 to March 25, 2025 → Access between April 1, 2025 to June 30, 2025\n• Spend ₹75,000 between March 26, 2025 to June 25, 2025 → Access between July 1, 2025 to Sept 30, 2025\n• Spend ₹75,000 between June 26, 2025 to Sept 25, 2025 → Access between Oct 1, 2025 to Dec 31, 2025\n\n**Card Validation Charges at Lounge:**\n• ₹2 authorisation on VISA/MasterCard/RuPay variants\n• ₹1 authorisation on AMEX variants\n\n**Cards EXEMPT from spend-based criteria (auto-eligible):**\n• ICICI Bank Diamant Credit Card\n• ICICI Bank Emeralde Private Metal Credit Card\n• ICICI Bank Emeralde Private Credit Card\n• ICICI Bank Emeralde Credit Card\n• ICICI Bank Emirates Emeralde Credit Card\n• Times Black ICICI Bank Credit Card\n• Adani One ICICI Bank Signature Credit Card (valid till Jun 30, 2026)\n• Adani One ICICI Bank Platinum Credit Card (valid till Jun 30, 2026)\n• MakeMyTrip ICICI Bank Credit Card (valid till Jun 30, 2026)\n\n**W.E.F Jul 01, 2026**: Adani One Signature, Adani One Platinum, and MakeMyTrip ICICI Bank Credit Card will require ₹75,000 spends per quarter to unlock lounge access."
  },
  {
    topic: "BookMyShow Offer",
    keywords: ["bookmyshow", "movie", "ticket", "offer", "25000", "quarter"],
    answer: "**BookMyShow Offer (w.e.f Jan 15, 2026):**\n\n**Eligibility:**\n• Spend **₹25,000 or more in the preceding quarter** to enjoy BookMyShow offer\n\n**Example:**\n• To enjoy offer in Apr 2026, May 2026, Jun 2026 → Spend ₹25,000 between Dec 26, 2025 and Mar 25, 2026\n• This cycle repeats every quarter\n\n**Eligible Cards:**\n• ICICI Bank Emeralde Private Credit Card (Non-Metal)\n• ICICI Bank Emeralde Credit Card\n• Emirates Skywards ICICI Bank Emeralde Credit Card\n• Emirates Skywards ICICI Bank Sapphiro Credit Card\n• Emirates Skywards ICICI Bank Rubyx Credit Card\n• ICICI Bank Sapphiro Credit Card\n• ICICI Bank Rubyx Credit Card\n• ICICI Bank Coral Credit Card\n• MakeMyTrip ICICI Bank Credit Card\n• MakeMyTrip ICICI Bank Platinum Credit Card\n• MakeMyTrip ICICI Bank Signature Credit Card\n• ICICI Bank HPCL Credit Card (All Variants)\n• Adani One ICICI Bank Platinum Credit Card\n• Adani One ICICI Bank Signature Credit Card\n• ICICI Bank Parakram Credit Card\n• ICICI Bank Parakram Select Credit Card\n• ICICI Bank Expressions Credit Card\n• Chennai Super Kings ICICI Bank Credit Card\n• ICICI Bank Manchester United Credit Card (All Variants)\n\n**Discontinued**: BookMyShow benefit on ICICI Bank Secured Platinum Credit Card discontinued w.e.f Feb 01, 2026."
  },
  {
    topic: "Customer Care & Grievance Redressal",
    keywords: ["customer care", "contact", "grievance", "complaint", "escalation", "toll free", "nodal officer", "helpline"],
    answer: "**ICICI Bank Customer Care Contact Details:**\n\n**Toll-Free Customer Care Numbers:**\n• India: **1800 1080**\n• Wealth Management Customer Care: **1800 103 8181**\n\n**Grievance Redressal/Complaints/Escalations:**\n\nIf not satisfied with services, register grievance by:\n1. Visiting 'Complaint Form' at https://www.icici.bank.in/\n2. Calling Customer Care number\n3. Writing to **Ms. Sharlet Malvankar, The Principal Nodal Officer, ICICI Bank Ltd, Bandra Kurla Complex, Mumbai 400 051**\n   - Telephone: 022-39337979 (Monday to Friday, 10:00 a.m. to 5:00 p.m. excluding Bank holidays)\n   - Email: pno@icicibank.com\n\n**Toll-Free Number for Grievance Redressal:**\n• **1800 1080** between 9 a.m. to 6 p.m. from Monday to Friday\n• Press 1 and enter Service Request Number (numeric digits only, not more than 2 months old)\n\n**Credit Cards Mis-selling or Harassment:**\n• Contact ICICI Bank at **1800 1080**\n• Email: customer.care@icicibank.com\n\n**Complete Postal Address:**\nICICI Bank Limited, ICICI Phone Banking Center, ICICI Bank Tower, 7th floor, Survey no: 115/27, Plot no. 12, Nanakramguda, Serilingampally, Hyderabad – 500032, India\n\n**In all communications, please indicate your complete Credit Card number.**"
  },
  {
    topic: "Insurance Coverage",
    keywords: ["insurance", "cover", "claim", "icici lombard", "comprehensive", "policy"],
    answer: "**Insurance Coverage:**\n\nICICI Bank offers free insurance cover on certain cards through tie-up with **ICICI Lombard General Insurance Company Limited** (or any other Insurance Company as decided by ICICI Bank).\n\n**Insurance Claim Process:**\n• Insurance is the subject matter of solicitation\n• Insurer: ICICI Lombard General Insurance Co. Ltd.\n• Policy governed by terms and conditions laid down by ICICI Lombard\n• **ICICI Bank is NOT responsible for processing of claims**\n• All claim-related queries need to be taken up directly with ICICI Lombard\n\n**Contact ICICI Lombard:**\n• Toll-Free Number: **1800-2666**\n• Email ID: ihealthcare@icicilombard.com\n\n**Reference Links:**\n• Comprehensive Insurance Cover T&C: https://www.icici.bank.in/content/dam/icicibank/india/managed-assets/revamp-page-images/docs/pdf/Comprehensive-Insurance-Cover-and-t-and-c.pdf\n• Parakram Base T&C: https://www.icici.bank.in/content/dam/icicibank/india/managed-assets/docs/parakram-base-tnc.pdf\n• Cancellation (CFAR) Claim Process: https://www.icici.bank.in/ms/Personal-Banking/cards/consumer-cards/credit-card/emeralde-credit-card/images/pdf/Cancellation-%20(CFAR)-Claim-Process.pdf\n\nFor insurance details, refer to brochure in welcome kit or visit https://www.icici.bank.in/"
  },
  {
    topic: "Credit Limit & Cash Limit",
    keywords: ["credit limit", "cash limit", "limit", "enhancement", "reduction", "withdrawal limit", "available"],
    answer: "**Credit Limit & Cash Limit:**\n\n**Credit Limit:**\n• Communicated at time of card delivery\n• Indicated in monthly statements\n• Available credit limit = Total Credit Limit - Utilized Limit\n• If loan availed within credit limit, outstanding loan amount also deducted from Total Credit Limit\n\n**Cash Limit:**\n• Sub-set of credit limit\n• **10% of credit limit up to maximum of ₹20,000 for first 180 days** from date of card issuance\n• After 180 days, ICICI Bank makes cash limit available at sole discretion\n\n**Multiple Credit Cards:**\n• If multiple credit cards mapped to one customer, total spends can be done only up to **combined aggregate credit limit**\n• Aggregate credit limit = maximum limit across all credit cards held by customer\n• Transactions exceeding aggregate credit limit shall be declined (except with explicit consent for over-limit facility)\n\n**Credit Limit Review:**\n• Card Member entitled for review/enhancement/reduction of credit limit and/or cash limit\n• ICICI Bank at sole discretion can review/alter (enhance or reduce) credit limit and/or cash limit at any time\n• Only enhancements effected with consent of Card Member\n\n**Over-limit Facility:**\n• Provided only with explicit consent from customer as per regulatory guideline\n• If outstanding exceeds credit limit, over-limit fee of 2.5% (min ₹550) levied\n• Excludes ICICI Bank Emeralde Private Metal and Emeralde Credit Card"
  },
  {
    topic: "Default & Recovery",
    keywords: ["default", "cibil", "bureau", "credit score", "recovery", "wilful defaulter", "death", "incapacity"],
    answer: "**Default & Circumstances:**\n\n**What is Default?**\n• If Card Member fails to pay Minimum Amount Due by date indicated in billing statement, it shall be treated as default\n• Bank can forward default report to Credit Information Bureaus (CIBIL) or other approved agencies\n• Time period between payment due date and billing date on statement = notice period for reporting as defaulter\n• Terms apply to Supplementary Card Holders as well\n\n**Withdrawal of Default Report:**\n• Bank submits Card Member's data to CIBIL every month in prescribed format\n• Data includes repayment status of all Cardholders (defaulters and current) for previous month\n• CIBIL uploads submitted data onto server in another 30 days\n\n**Recovery in Case of Death/Permanent Incapacity:**\n• In accordance with applicable laws\n• After giving sufficient notice for payment of dues\n• All information regarding outstanding dues provided to successors/nominees/legal heirs\n\n**Wilful Defaulter:**\n• Bank may suspend usage of sanctioned limits if Borrower declared wilful defaulter under RBI regulations\n• Borrower must promptly notify ICICI Bank upon being declared wilful defaulter\n• Borrower must allow ICICI Bank to appoint auditors/chartered accountants/cost accountants/forensic experts for concurrent or special audit examination\n\n**Debt Collection Policy:**\n• Built around dignity and respect to borrowers\n• Built on courtesy, fair treatment and persuasion\n• Detailed Policy on Collection of Dues available at https://www.icici.bank.in/personal-banking/debt-service/debt-service-policy"
  },
  {
    topic: "Emirates Skywards Cards Changes",
    keywords: ["emirates", "skywards", "miles", "changes", "jan 2026", "silver", "gold"],
    answer: "**Emirates Skywards ICICI Bank Credit Cards — Changes w.e.f Jan 15, 2026:**\n\n**Emirates Skywards ICICI Bank Emeralde Credit Card:**\n• 2 Skywards Miles per ₹100 spent (was 2.5 Miles) on eligible domestic & international retail spends\n• NO Miles on Insurance, Utility, Government & Education payments\n• Complimentary Emirates Skywards Silver Tier membership\n• Unlimited complimentary domestic & international lounge access\n• **Gold Tier**: Achieve ₹15 lakh annual spends (including ₹50,000 with Emirates on flights via emirates.com or Emirates Contact Centre) → Gold tier active upon annual fee payment in subsequent year. Must achieve milestone + pay annual fee to retain Gold status.\n\n**Emirates Skywards ICICI Bank Sapphiro Credit Card:**\n• 1.5 Skywards Miles per ₹100 spent (was 2 Miles) on eligible domestic & international retail spends\n• NO Miles on Insurance, Utility, Government & Education payments\n• Complimentary Emirates Skywards Silver Tier membership\n\n**Emirates Skywards ICICI Bank Rubyx Credit Card:**\n• 1 Skyward Mile per ₹100 spent on all eligible retail spends\n• NO Miles on Insurance, Utility, Government & Education payments"
  },
  {
    topic: "Spend Threshold Exclusions",
    keywords: ["spend threshold", "exclusion", "rent", "government", "education", "milestone", "annual fee reversal"],
    answer: "**Spend Threshold Criteria (w.e.f Nov 15, 2024):**\n\nThe spend threshold for annual fee reversal and milestone benefits will EXCLUDE:\n• **Rent payments**\n• **Government payments**\n• **Education payments**\n\n**Transactions NOT Included in Total Spends Calculation (for Annual Fee Waiver and Milestone Benefits):**\n• Credit Balance Refund\n• Joining Fee\n• Annual Fee\n• Late Payment Fee\n• Interest Charges\n• Principal amount\n• DCC fee\n• Reward redemption handling fee\n• Reversal transaction\n• Cancelled transaction\n• Equated Monthly Instalment (EMI) transaction\n• Other similar transactions\n\n**Important Note:** Annual gifts will NOT be issued in case customer receives benefit of Annual Fee reversal basis spend on any card.\n\n**Government transactions included under utility payment transactions w.e.f Feb 05, 2024** (does NOT apply to Amazon Pay ICICI Bank Credit Card)."
  },
  {
    topic: "Card Usage Policy & Restrictions",
    keywords: ["usage", "restriction", "personal use", "commercial", "business", "excess payment", "credit limit enhancement", "block", "suspend", "policy"],
    answer: "**Credit Card Usage Policy & Restrictions:**\n\n**Personal Use Only:**\n• Credit Card issued solely for personal use\n• Usage appearing to be for business/commercial purposes may be deemed breach of authorised end-use\n• Frequent or high-value transactions inconsistent with typical personal usage may be flagged\n• Bank reserves right to review and restrict such usage\n\n**Excess Payments Policy:**\n• Primary Card Members NOT permitted to make excess payments to enhance Card usage limits beyond sanctioned credit limit\n• Customer shall refrain from making credit payments in excess of Total Amount Due\n• ICICI Bank reserves right to restrict, suspend or block transactions exceeding sanctioned credit limit in a calendar month\n• For credit limit increase, customer advised to request Bank for the same\n\n**Bank's Rights to Block/Restrict:**\n• Bank may refuse authorisation for a transaction at merchant establishment\n• May restrict or defer usage of Card\n• May suspend or cancel Card at sole discretion without prior notice\n• Bank, acquiring bank, or merchant may retain/confiscate Card if necessary for managing credit/business risk or suspected misuse\n• Bank may block Credit Card on restricted MCCs as per RBI mandate\n\n**Card Replacement Limit:**\n• Card can be replaced up to **3 times**\n• After 3rd replacement, Cardholder needs to apply for new ICICI Bank Credit Card\n\n**Suspension/Termination Consequences:**\n• Immediate withdrawal of all associated privileges, benefits, and facilities\n• Card Member ceases to be eligible for earning reward points or cashback\n• All unused/unredeemed reward points or cashback automatically forfeited after cancellation\n\n**Cancellation Link:** https://www.icici.bank.in/personal-banking/cards/credit-card/cancellation"
  },
  {
    topic: "Loss, Theft & Misuse of Card",
    keywords: ["lost", "stolen", "loss", "theft", "misuse", "block card", "report", "ccblk", "5676766", "fir", "replacement", "damaged"],
    answer: "**Loss/Theft/Misuse of Card — What to Do:**\n\n**Immediate Reporting:**\n• Report loss/theft/misuse immediately to ICICI Bank through:\n  1. **Customer Care**: Call 1800 1080\n  2. **SMS**: Send `CCBLK <last four digits of card>` to **5676766** from registered mobile number only\n• Bank shall suspend the Card upon reporting\n\n**FIR Filing:**\n• Card Member advised to file FIR with local police station\n• Keep copy of FIR to produce whenever requested by Bank\n\n**Liability:**\n• Card Member primarily responsible for security of Card including theft\n• Card Member NOT liable for any transactions made on Card POST reporting loss/theft/damage\n• In case of dispute relating to time of reporting, Bank reserves right to ascertain time and authenticity of disputed transactions\n\n**Card Blocking for Security:**\n• ICICI Bank reserves right to block Credit Card on suspected risk of compromise\n• Protects interest of Card Member and avoids misuse\n• Card Member cannot use blocked Card for any transactions\n• **Replacement Card delivered within 7 working days**\n\n**Unblocking Risk:**\n• If Card Member informed of probable fraud risk but still requests to unblock Card:\n  - ICICI Bank NOT liable for fraudulent transactions reported thereafter\n  - Risk solely on Card Member\n\n**Card Replacement Limit:**\n• Card can be replaced up to **3 times** only\n• After 3rd replacement, must apply for new ICICI Bank Credit Card\n\n**Compensation Policy:** https://www.icici.bank.in/content/dam/icicibank/india/managed-assets/docs/personal/general-links/code-of-commitment/customer-compensation-policy.pdf"
  },
  {
    topic: "Periodic Reviews & Commercial Usage",
    keywords: ["review", "periodic", "commercial", "excessive", "utilization", "merchant collusion", "fund transfer", "self-funding", "investigation", "clarification"],
    answer: "**Periodic Reviews of Credit Card Usage:**\n\nTo ensure Credit Card usage aligns with regulatory guidelines, Terms & Conditions, and internal policies, ICICI Bank may conduct periodic reviews.\n\n**Review Covers (indicative, not exhaustive):**\n• Excessive utilisation beyond sanctioned credit limit within single billing cycle\n• Disproportionate usage at few merchant establishments\n• Use of card for repayment of other Credit Cards/loans\n• Fund transfers to Savings Accounts\n• Potential merchant collusion\n• Misuse of features/programmes for accumulating undue reward points, cashback or benefits\n• Usage for business or non-personal expenses (commercial usage) including:\n  - Purchase of electronics/mobile phones in high quantities together or over time\n  - High volume of bill payments\n  - Excessive insurance payments\n  - Excessive spends on fuel\n  - Multiple EMI booking followed by cancellations\n  - Self-funding\n  - Multiple usage of Card on own POS/QR offered by Bank\n\n**Bank's Actions on Detection:**\n• May cancel concerned Credit Card(s) including add-on Cards\n• May withhold or cancel accrued reward points or cashback at customer level\n• Without prior notice\n• May contact Card Member via phone or formal channels to seek clarification/documentation\n• Failure to provide satisfactory responses may lead to Card blocking/closure\n\n**Important:** This list of scenarios is indicative and not exhaustive."
  },
  {
    topic: "RBI Mandate on Standing Instructions",
    keywords: ["standing instruction", "si", "recurring", "auto debit", "bill payment", "rbi mandate", "april 2021", "re-register"],
    answer: "**RBI Mandate on Standing Instructions (effective April 1, 2021):**\n\n**What Changed:**\n• Standing Instructions (SI) of recurring merchant bill payments disabled from security point of view\n• As per regulatory guidelines effective 1st April 2021\n\n**What Customer Needs to Do:**\n\n**For Utility Bills:**\n• Re-register utility bill through Bill Payment section in Internet Banking or iMobile\n\n**For Other Standing Instructions:**\n• Re-register the biller at merchant's end\n\n**Important Notes:**\n• Any charges due to SI failure are NOT liability of Bank\n• Customer must take action to re-register to continue services\n• This is for security purposes as per RBI guidelines"
  },
  {
    topic: "Disclosure & Credit Bureau Reporting",
    keywords: ["disclosure", "credit bureau", "cibil", "reporting", "information sharing", "credit information", "retain documents", "privacy"],
    answer: "**Disclosure & Credit Bureau Reporting:**\n\n**Information Sharing:**\n• Bank shall part with all available information about Card Member including repayment history to:\n  - Credit Information Bureaus (CIBIL, etc.)\n  - Other agencies approved by law\n\n**Document Retention:**\n• ICICI Bank/Group Companies reserve right to retain:\n  - Application forms\n  - Documents provided therewith\n  - Photographs\n• Will NOT return the same\n\n**Lead Form Information:**\n• Bank reserves right to share all available information about customers filling up lead form with:\n  - Service providers\n  - Agents\n  - Affiliates\n  - Credit bureaus\n• For verification, storage, credit assessment, evaluation and other purposes required to offer products and services\n\n**Communication Consent:**\n• Bank and its representatives reserve right to Call/E-Mail/SMS/WhatsApp customers regarding ICICI Bank's Credit Card services\n\n**Reporting Frequency:**\n• All overdue accounts reported to Credit Bureau on monthly basis\n• Bank submits Card Member's data to CIBIL every month in prescribed format\n• CIBIL uploads data onto server in another 30 days\n\n**KYC Update Requirement:**\n• As per rule 9B of Prevention of Money Laundering Rules, customer must intimate Bank of any change in KYC details within 30 days\n• Updated documents required (address, contact details, profile, etc.)\n• Intimate via Internet Banking/Branch"
  },
  {
    topic: "SMA & NPA Classification",
    keywords: ["sma", "npa", "special mention account", "non performing asset", "overdue", "due date", "classification", "90 days", "default classification"],
    answer: "**SMA & NPA Classification (Credit Card Accounts):**\n\n**Key Definitions:**\n• **Dues**: Principal/interest/any charges levied on loan account payable within stipulated period\n• **Overdue**: Principal/interest/any charges payable but not paid within stipulated period — any amount due to bank under any credit facility is 'overdue' if not paid on due date\n\n**Special Mention Account (SMA) Categories:**\n\n| SMA Category | Basis for Classification |\n|---|---|\n| **SMA-0** | Up to 30 days overdue |\n| **SMA-1** | More than 30 days and up to 60 days |\n| **SMA-2** | More than 60 days and up to 90 days |\n\n**Non-Performing Asset (NPA):**\n• Credit card account treated as NPA if Minimum Amount Due (MAD) not paid fully within **90 days** from payment due date mentioned in statement\n\n**Illustrative Example:**\n• Due date: 01.01.2022, Payment on 01.01.2022 (full MAD paid) → Standard account, SMA: NIL\n• Due date: 01.02.2022, Partly paid on 01.02.2022 → SMA-0 (1 day overdue)\n• No payment till 03.03.2022 → SMA-1 (31 days overdue)\n• No payment till 02.04.2022 → SMA-2 (61 days overdue)\n• No payment till 02.05.2022 → **NPA** (91 days overdue, NPA Date: 02.05.2022)\n• Full payment on 01.10.2022 → Standard account with no overdues (STD from 01.10.2022)\n\n**Reporting to Credit Bureau:**\n• All overdue accounts reported to Credit Bureau on monthly basis\n\n**Note:** These clarifications/examples are illustrative in nature covering common scenarios. RBI norms and clarifications provided from time to time will prevail."
  },
  {
    topic: "Termination & Surrender of Card",
    keywords: ["terminate", "termination", "surrender", "revoke", "revocation", "close card", "cut card", "notice", "program closure", "renewal"],
    answer: "**Termination/Revocation/Surrender of Card Membership:**\n\n**Voluntary Termination by Card Member:**\n• May choose to terminate Card Account at any time with or without prior notice\n• For avoiding misuse, advised to cut Credit Card into four pieces\n• Ensure hologram and magnetic strip destroyed permanently\n\n**How to Terminate:**\n• Write to: ICICI Bank Limited, ICICI PhoneBanking Center, ICICI Bank Tower, 7th floor, Survey no: 115/27, Plot no. 12, Nanakramguda, Serilingampally, Hyderabad – 500032, India\n• Indicate complete Card number in communication\n\n**When Termination is Effective:**\n• Only effective once ICICI Bank receives payment of all amounts due and outstanding\n• Subject to payment of all dues by cardholder\n\n**Program Closure/Renewal:**\n• In event of credit card program closure or renewal:\n  - ICICI Bank at sole discretion reserves right to provide different card type from existing\n  - Credit limits and cash limits at any point are as per sole discretion of ICICI Bank\n  - Card application continues to be valid for any replacement card provided at time of closure/renewal\n\n**Termination by Bank:**\n• Bank may suspend/cancel Card at sole discretion without prior notice\n• Without assigning any reason\n• Results in immediate withdrawal of all associated privileges, benefits, and facilities\n• Bank not liable in any manner\n\n**Changes in Fees/Charges:**\n• Made only with prospective effect\n• Prior notice of at least one month to customer\n• If cardholder desires to surrender due to change to disadvantage:\n  - Permitted without levying extra charge\n  - Subject to payment of all dues\n\n**For New Cards (30-day activation rule):**\n• Card needs to be activated within 30 days of issuance\n• If not activated, Bank keeps card active only with OTP-based consent\n• All other cards closed in 7 working days (by 37th day) without cost\n• Bank will NOT levy fee and NOT report to bureau unless card activated"
  },
  {
    topic: "Compensation Policy & Grievance",
    keywords: ["compensation", "policy", "grievance", "complaint", "escalation", "nodal officer", "ombudsman", "service request"],
    answer: "**Compensation Policy & Grievance Redressal:**\n\n**Customer Compensation Policy:**\n• Available at: https://www.icici.bank.in/content/dam/icicibank/india/managed-assets/docs/personal/general-links/code-of-commitment/customer-compensation-policy.pdf\n• Alternative path: https://www.icici.bank.in/ → HELP → CONTACT (Top Right Corner) → Notice Board → Customer Compensation Policy\n\n**Grievance Escalation Levels:**\n\n**Level 1: Customer Care**\n• Toll-Free: **1800 1080**\n• Wealth Management: **1800 103 8181**\n• Email: customer.care@icicibank.com\n\n**Level 2: Principal Nodal Officer**\n• Name: Ms. Sharlet Malvankar\n• Designation: The Principal Nodal Officer\n• Address: ICICI Bank Ltd, Bandra Kurla Complex, Mumbai 400 051\n• Telephone: 022-39337979 (Monday to Friday, 10:00 a.m. to 5:00 p.m., excluding Bank holidays)\n• Email: pno@icicibank.com\n\n**Level 3: Toll-Free Grievance Number**\n• **1800 1080** between 9 a.m. to 6 p.m. (Monday to Friday)\n• Press 1 and enter Service Request Number (numeric digits only, not more than 2 months old)\n\n**Mis-selling or Harassment:**\n• Contact: 1800 1080\n• Email: customer.care@icicibank.com\n\n**Complete Postal Address:**\nICICI Bank Limited, ICICI Phone Banking Center, ICICI Bank Tower, 7th floor, Survey no: 115/27, Plot no. 12, Nanakramguda, Serilingampally, Hyderabad – 500032, India\n\n**Important:** In all communications, indicate complete Credit Card number.\n\n**Billing Disputes:**\n• Inform ICICI Bank of discrepancies within **60 days** of Statement Date in writing\n• Bank may reverse charge/transaction on temporary basis pending investigation\n• GST levied will NOT be reversed on any dispute"
  },
  {
    topic: "Disclaimer & Service Providers",
    keywords: ["disclaimer", "service provider", "agent", "external", "third party", "utilize services"],
    answer: "**Disclaimer & Service Providers:**\n\n**External Service Providers:**\n• ICICI Bank may at its sole discretion utilise services of:\n  - External service provider/s\n  - Agent/s\n• On such terms as required or necessary in relation to its products\n\n**Communication Consent:**\n• Bank and its representatives reserve right to:\n  - Call\n  - E-Mail\n  - SMS\n  - WhatsApp\n• Regarding ICICI Bank's Credit Card services\n\n**Information Usage:**\n• Bank reserves right to share information about customers filling lead form with:\n  - Service providers\n  - Agents\n  - Affiliates\n  - Credit bureaus\n• Purposes: Verification, storage, credit assessment, evaluation, and other purposes required to offer products and services\n\n**Important Notes:**\n• ICICI Bank/Goup Companies reserve right to retain application forms, documents, and photographs\n• Will NOT return the same\n• Bank not responsible for errors, delays, or problems in transmission or unauthorised/illegal interception of electronic data\n• Bank not liable for misuse of e-mail as means of transmission\n• Customer responsible for ensuring contact details are correct/complete"
  }
];

// Search knowledge base for relevant context — improved matching algorithm
function findRelevantContext(message: string): string {
  const lowerMsg = message.toLowerCase();
  const words = lowerMsg.split(/\s+/).filter(w => w.length > 2);

  const scored = knowledgeBase.map(entry => {
    let score = 0;
    let matchedKeywords = 0;

    entry.keywords.forEach(kw => {
      const lowerKw = kw.toLowerCase();
      if (lowerMsg.includes(lowerKw)) {
        // Longer keyword matches get higher weight (more specific)
        const weight = lowerKw.split(' ').length > 1 ? 3 : 1;
        score += weight;
        matchedKeywords++;
      }
    });

    // Bonus for matching multiple different keywords from same topic
    if (matchedKeywords >= 2) score += 2;
    if (matchedKeywords >= 3) score += 3;

    // Special intent detection — boost specific topics for specific question patterns
    const msgContains = (terms: string[]) => terms.some(t => lowerMsg.includes(t));

    // UPI on RuPay card questions (not general UPI payments)
    if (entry.topic === "UPI on RuPay Credit Card" && msgContains(['rupay', 'cc on upi', 'upi on credit', 'upi pin', 'p2m', 'device change', 're-register', 're-register upi', 'change device', 'new device'])) {
      score += 10;
    }

    // Lost/stolen card questions
    if (entry.topic === "Loss, Theft & Misuse of Card" && msgContains(['lost', 'stolen', 'theft', 'misuse', 'ccblk', 'block card', '5676766'])) {
      score += 10;
    }

    // Termination questions
    if (entry.topic === "Termination & Surrender of Card" && msgContains(['terminate', 'surrender', 'close card', 'cancel card', 'cancel my card', 'close my card'])) {
      score += 10;
    }

    // SMA/NPA questions
    if (entry.topic === "SMA & NPA Classification" && msgContains(['sma', 'npa', 'non performing', 'special mention', '90 days', 'default classification'])) {
      score += 10;
    }

    // EMI questions (not general payments)
    if (entry.topic === "EMI & Instalment Facility" && msgContains(['emi', 'instalment', 'installment', 'foreclosure', 'prepayment', 'prepay'])) {
      score += 8;
    }

    // Lounge access questions
    if (entry.topic === "Airport Lounge Access" && msgContains(['lounge', 'airport'])) {
      score += 10;
    }

    // Penalty for Payment Methods topic when question is about UPI features (not payment methods)
    if (entry.topic === "Payment Methods" && msgContains(['rupay', 'cc on upi', 'upi pin', 'p2m', 'device change', 're-register', 'change device'])) {
      score -= 5;
    }

    return { ...entry, score };
  });

  // Sort by score descending
  const sorted = scored
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score);

  // Stricter selection: only return topics with meaningful relevance
  let relevant: typeof sorted = [];

  if (sorted.length > 0) {
    const topScore = sorted[0].score;

    // Only include topics that have at least 40% of the top score
    // This filters out weak matches that might be irrelevant
    const threshold = Math.max(topScore * 0.4, 2);

    relevant = sorted.filter(e => e.score >= threshold).slice(0, 2); // Max 2 topics for focused answers
  }

  if (relevant.length === 0) {
    return "No specific knowledge base match found. The bot should respond generally and offer to help with ICICI Bank Credit Card related queries.";
  }

  return relevant.map(e => `[${e.topic}]: ${e.answer}`).join('\n\n');
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const context = findRelevantContext(message);
    const hasContext = !context.startsWith('No specific');

    const systemPrompt = `You are ICICI Card Assistant — a friendly, helpful bot that answers questions about ICICI Bank Credit Cards based on the official Most Important Terms and Conditions (MITC) document (last updated March 5, 2026).

Your personality:
- Professional, accurate, and helpful (banking context)
- Use bullet points and numbered lists for clarity
- Use bold formatting for important numbers, fees, and rates
- You NEVER make up information not in the knowledge base
- Always cite which section of MITC the answer comes from when relevant

${hasContext ? `KNOWLEDGE BASE CONTEXT (use this to answer):\n${context}` : 'No matching knowledge base entry found. Politely explain you don\'t have specific information on this topic and suggest contacting ICICI Bank Customer Care at 1800 1080.'}

CRITICAL RULES FOR CONTEXT SELECTION:
- Use ONLY the most relevant knowledge base section to answer the question.
- If multiple sections are provided, focus your answer on the section that BEST matches the user's specific question.
- Do NOT include information from irrelevant sections — even if provided in context.
- If the user asks about UPI on RuPay Credit Card (e.g., device change, re-register, UPI PIN, P2M), use ONLY the "UPI on RuPay Credit Card" section — NOT the "Payment Methods" section.
- If the user asks about general payment methods (how to pay bill), use the "Payment Methods" section.
- If the user asks about lost/stolen card, use ONLY "Loss, Theft & Misuse of Card" section.
- If the user asks about EMI/instalment, use ONLY "EMI & Instalment Facility" section — NOT "Payment Methods".
- If the user asks about SMA/NPA/default classification, use ONLY "SMA & NPA Classification" section.
- If the user asks about card cancellation/termination, use ONLY "Termination & Surrender of Card" section.
- Always read the question carefully and pick the MOST RELEVANT section from the context provided.
- If the question is about a specific fee (e.g., late payment, fuel surcharge, foreign markup), answer ONLY about that fee — do not list all fees.

Rules:
1. Answer based ONLY on the provided knowledge base context when available
2. If no context matches, say: "I don't have specific information about that. For detailed assistance, please contact ICICI Bank Customer Care at 1800 1080 or visit https://www.icici.bank.in/"
3. Keep responses concise but complete — include all relevant numbers, fees, rates
4. Always offer follow-up help at the end
5. Never invent fees, rates, or policies not in the context
6. This information is based on MITC document last updated March 5, 2026
7. For complex queries, suggest referring to the complete Terms and Conditions at https://www.icici.bank.in/`;

    let botReply: string;

    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.2,
        max_tokens: 800,
      });

      botReply = response.choices?.[0]?.message?.content ||
        "I'm having trouble processing that right now. Please try again or contact ICICI Bank Customer Care at 1800 1080.";
    } catch {
      if (hasContext) {
        // Use the same scored matching to find the BEST entry (not just the first match)
        const lowerMsg = message.toLowerCase();
        const scored = knowledgeBase.map(entry => {
          let score = 0;
          let matchedKeywords = 0;
          entry.keywords.forEach(kw => {
            const lowerKw = kw.toLowerCase();
            if (lowerMsg.includes(lowerKw)) {
              const weight = lowerKw.split(' ').length > 1 ? 3 : 1;
              score += weight;
              matchedKeywords++;
            }
          });
          if (matchedKeywords >= 2) score += 2;
          if (matchedKeywords >= 3) score += 3;

          const msgContains = (terms: string[]) => terms.some(t => lowerMsg.includes(t));

          if (entry.topic === "UPI on RuPay Credit Card" && msgContains(['rupay', 'cc on upi', 'upi on credit', 'upi pin', 'p2m', 'device change', 're-register', 'change device', 'new device'])) {
            score += 10;
          }
          if (entry.topic === "Loss, Theft & Misuse of Card" && msgContains(['lost', 'stolen', 'theft', 'misuse', 'ccblk', 'block card', '5676766'])) {
            score += 10;
          }
          if (entry.topic === "Termination & Surrender of Card" && msgContains(['terminate', 'surrender', 'close card', 'cancel card', 'close my card'])) {
            score += 10;
          }
          if (entry.topic === "SMA & NPA Classification" && msgContains(['sma', 'npa', 'non performing', 'special mention', '90 days', 'default classification'])) {
            score += 10;
          }
          if (entry.topic === "EMI & Instalment Facility" && msgContains(['emi', 'instalment', 'installment', 'foreclosure', 'prepayment', 'prepay'])) {
            score += 8;
          }
          if (entry.topic === "Airport Lounge Access" && msgContains(['lounge', 'airport'])) {
            score += 10;
          }
          if (entry.topic === "Payment Methods" && msgContains(['rupay', 'cc on upi', 'upi pin', 'p2m', 'device change', 're-register', 'change device'])) {
            score -= 5;
          }

          return { ...entry, score };
        });

        const topEntry = scored
          .filter(e => e.score > 0)
          .sort((a, b) => b.score - a.score)[0];

        botReply = topEntry?.answer || "I found a match in our knowledge base but couldn't format the response. Please try again or contact ICICI Bank Customer Care at 1800 1080.";
      } else {
        botReply = "I don't have specific information about that. For detailed assistance, please contact ICICI Bank Customer Care at 1800 1080 or visit https://www.icici.bank.in/. You can also ask me about credit card fees, interest rates, reward points, billing, EMI options, lounge access, or any other ICICI credit card topic!";
      }
    }

    const nodesTriggered = hasContext
      ? ['Webhook', 'Knowledge Base', 'AI Agent', 'Response']
      : ['Webhook', 'AI Agent', 'Fallback Handler', 'Response'];

    return NextResponse.json({
      reply: botReply,
      nodesTriggered,
      knowledgeBaseHit: hasContext,
      topic: hasContext ? context.split(']:')[0].replace('[', '') : null,
      sessionId: sessionId || 'default',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Chat API error:', error);

    const fallbackReplies = [
      "I'm here to help with ICICI Bank Credit Card queries! Ask me about fees, interest rates, reward points, billing, EMI options, lounge access, and more.",
      "Thanks for reaching out! I can assist with ICICI Bank Credit Card questions. What would you like to know?",
      "Hello! I'm the ICICI Card Assistant. Feel free to ask about any ICICI Bank Credit Card fees, charges, or features."
    ];

    return NextResponse.json({
      reply: fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)],
      nodesTriggered: ['Webhook', 'AI Agent', 'Response'],
      knowledgeBaseHit: false,
      topic: null,
      sessionId: 'default',
      timestamp: new Date().toISOString(),
    });
  }
}
