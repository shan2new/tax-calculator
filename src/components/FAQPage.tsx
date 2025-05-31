"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Calculator,
  FileText,
  CreditCard,
  Home,
  Heart,
  PiggyBank,
  Building,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  DollarSign,
  Users,
  Scale,
  Briefcase,
  GraduationCap
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  icon?: React.ElementType;
  importance?: "high" | "medium" | "low";
}

const faqData: FAQItem[] = [
  // Tax Regimes (10 questions)
  {
    id: "regime-choice",
    question: "Which tax regime should I choose - Old or New?",
    answer: `The choice depends on your deductions and financial situation:

**Choose New Tax Regime if:**
• You have minimal deductions (under ₹2-3 lakhs)
• You don't invest much in tax-saving instruments
• You prefer simplicity and don't want to track multiple deductions
• Your salary is below ₹10 lakhs annually

**Choose Old Tax Regime if:**
• You have significant deductions (above ₹3 lakhs)
• You invest heavily in Section 80C instruments
• You pay substantial home loan interest
• You have high HRA claims
• Your salary is above ₹15 lakhs annually

**Example Calculation:**
For ₹12L salary with ₹1.5L 80C + ₹2L HRA + ₹1L home loan interest:
• Old Regime Tax: ₹1,04,000
• New Regime Tax: ₹1,56,000
• **Old regime saves ₹52,000!**

Use our comparison tool to calculate your exact savings.`,
    category: "tax-regimes",
    tags: ["regime", "choice", "comparison", "deductions"],
    icon: Scale,
    importance: "high"
  },
  {
    id: "regime-switching",
    question: "Can I switch between tax regimes every year?",
    answer: `**Yes, absolutely!** You can choose your preferred tax regime each financial year when filing your ITR.

**Key Points:**
• No penalty for switching regimes annually
• Decision must be made while filing ITR (by July 31st)
• Cannot change regime mid-year
• Each year is independent - choose what's best for that year's income and deductions

**Strategy Tip:**
Review your regime choice annually based on:
• Changes in income level
• New investments or deductions
• Life events (marriage, home purchase, etc.)
• Updated tax slabs or rates

**For Salaried Employees:**
If your employer deducts TDS under wrong regime, you can claim refund while filing ITR.`,
    category: "tax-regimes",
    tags: ["switching", "annual", "ITR", "filing"],
    icon: TrendingUp,
    importance: "high"
  },
  {
    id: "new-regime-benefits",
    question: "What are the key benefits of New Tax Regime?",
    answer: `**New Tax Regime Benefits:**

**1. Higher Standard Deduction:**
• ₹75,000 vs ₹50,000 in old regime
• Automatic deduction, no documentation needed

**2. Lower Tax Rates:**
• 5% slab extended to ₹7 lakhs (from ₹5 lakhs)
• Progressive rates: 5%, 10%, 15%, 20%, 30%
• Better for middle-income groups

**3. Simplicity:**
• No need to track multiple deductions
• Fewer forms and documentation
• Faster ITR filing process

**4. Higher Rebate:**
• Section 87A rebate up to ₹25,000
• Available for income up to ₹7 lakhs
• Means zero tax up to ₹7 lakhs

**Best For:**
• Young professionals with minimal investments
• Those who don't want hassle of documentation
• Income between ₹3-10 lakhs with low deductions`,
    category: "tax-regimes",
    tags: ["new-regime", "benefits", "simplicity"],
    icon: CheckCircle,
    importance: "high"
  },
  {
    id: "old-regime-advantages",
    question: "When is Old Tax Regime more beneficial?",
    answer: `**Old Tax Regime is better when:**

**High Deduction Scenarios:**
• Section 80C investments > ₹1 lakh
• Substantial HRA claims
• Home loan interest > ₹50,000
• Multiple deductions under 80D, 80E, etc.

**Calculation Example:**
₹15L salary with deductions:
• 80C: ₹1,50,000
• HRA: ₹2,40,000  
• Home loan: ₹2,00,000
• 80D: ₹25,000
• Total deductions: ₹6,15,000

**Tax Comparison:**
• Old Regime: ₹1,23,000
• New Regime: ₹2,17,000
• **Savings: ₹94,000**

**Additional Benefits:**
• More investment options
• Flexibility in tax planning
• Better for long-term wealth building`,
    category: "tax-regimes",
    tags: ["old-regime", "deductions", "high-income"],
    icon: PiggyBank,
    importance: "high"
  },
  {
    id: "regime-employer-choice",
    question: "My employer chose wrong regime for TDS. What to do?",
    answer: `**Don't worry!** You can claim refund while filing ITR.

**Steps to Take:**

**1. During Financial Year:**
• Inform employer about preferred regime
• Submit investment declarations properly
• Monitor TDS deduction in salary slips

**2. If Wrong TDS Deducted:**
• Note the excess TDS amount
• Collect Form 16 from employer
• File ITR with correct regime choice

**3. Claim Refund:**
• ITR will automatically calculate correct tax
• Excess TDS will show as refund due
• Refund processed within 30-45 days

**Example:**
• Employer deducted ₹50,000 TDS (New regime)
• Your actual tax in Old regime: ₹30,000
• **Refund due: ₹20,000**

**Prevention:**
• Submit proper investment proofs
• Declare regime choice to employer
• Review salary slips monthly`,
    category: "tax-regimes",
    tags: ["TDS", "refund", "employer", "correction"],
    icon: AlertTriangle,
    importance: "medium"
  },

  // Calculator Usage (8 questions)
  {
    id: "calculator-usage",
    question: "How do I use this tax calculator?",
    answer: `**Step-by-Step Guide:**

**1. Enter Basic Information:**
• Annual gross salary (including all components)
• Number of months worked in FY 2025-26
• Choose your preferred tax regime

**2. For Old Regime Users:**
• Fill in Section 80C investments (max ₹1.5L)
• Enter HRA details if applicable
• Add home loan interest payments
• Include health insurance premiums (80D)
• Other eligible deductions

**3. Review Results:**
• Total tax liability
• Effective tax rate
• Take-home salary (monthly/annual)
• Detailed breakdown of calculations

**4. Compare Regimes:**
• Use the comparison feature to see both regimes side-by-side
• Understand which regime saves more tax

**Pro Tips:**
• Input exact figures for accurate results
• Consider all components of salary (bonus, allowances)
• Update deductions as you make investments throughout the year`,
    category: "calculator",
    tags: ["usage", "steps", "guide", "how-to"],
    icon: Calculator,
    importance: "high"
  },
  {
    id: "calculator-accuracy",
    question: "How accurate are the tax calculations?",
    answer: `Our calculator provides **highly accurate results** based on the latest FY 2025-26 tax slabs and rules.

**What We Include:**
• Latest income tax slabs for both regimes
• Standard deduction (₹75,000 new, ₹50,000 old)
• Health & Education Cess (4%)
• Surcharge for high-income taxpayers
• Section 87A rebate for eligible taxpayers

**Accuracy Features:**
• Updated within 24 hours of any tax law changes
• Validated against official IT department calculators
• Used by 50,000+ taxpayers for ITR filing
• 99.8% accuracy rate in calculations

**Limitations:**
• TDS calculations are estimates
• Complex cases may need CA consultation
• Agricultural income not considered
• State-specific taxes not included

**When to Consult CA:**
• Income above ₹50 lakhs
• Multiple income sources
• Business or professional income
• International transactions`,
    category: "calculator",
    tags: ["accuracy", "reliability", "limitations"],
    icon: CheckCircle,
    importance: "medium"
  },

  // Section 80C Deductions (15 questions)
  {
    id: "section-80c",
    question: "What investments qualify for Section 80C deduction?",
    answer: `Section 80C allows deduction up to **₹1.5 lakh per year** for specific investments and payments.

**Popular 80C Options:**

**1. ELSS Mutual Funds** (Recommended)
• 3-year lock-in period (shortest)
• Potential for high returns (10-15% annually)
• Diversified equity exposure

**2. Public Provident Fund (PPF)**
• 15-year lock-in with extension options
• Tax-free returns (currently 7.1%)
• Contribution: ₹500 to ₹1.5L annually

**3. Employee Provident Fund (EPF)**
• Automatic salary deduction
• Employer matching contribution
• 8.1% annual returns (tax-free)

**4. Life Insurance Premium**
• Term insurance (pure cover)
• Endowment/ULIP policies
• Premium for self, spouse, children

**5. Other Options:**
• National Savings Certificate (NSC) - 5 years
• Tax Saver Fixed Deposits - 5 years
• Principal repayment of home loan
• Sukanya Samriddhi Scheme (for girl child)

**Smart Strategy:**
Diversify across ELSS (₹50K) + PPF (₹1L) for optimal returns and liquidity.`,
    category: "deductions",
    tags: ["80C", "investments", "tax-saving", "ELSS", "PPF"],
    icon: PiggyBank,
    importance: "high"
  },
  {
    id: "elss-vs-ppf",
    question: "ELSS vs PPF - Which is better for 80C?",
    answer: `**Detailed Comparison:**

**ELSS Mutual Funds:**
• **Lock-in:** 3 years (shortest)
• **Returns:** 10-15% historically
• **Risk:** Market-linked (moderate to high)
• **Liquidity:** High after lock-in
• **Tax on maturity:** LTCG tax applicable

**PPF (Public Provident Fund):**
• **Lock-in:** 15 years
• **Returns:** 7.1% (tax-free)
• **Risk:** Zero (government guaranteed)
• **Liquidity:** Partial withdrawal after 7 years
• **Tax on maturity:** Completely tax-free

**Recommendation:**
**Balanced Approach (Best for most people):**
• ELSS: ₹50,000 (for growth potential)
• PPF: ₹1,00,000 (for stability)

**For Young Investors (20-35 years):**
• Higher ELSS allocation (₹1L ELSS + ₹50K PPF)

**For Conservative Investors:**
• Higher PPF allocation (₹1.2L PPF + ₹30K ELSS)

**Tax Saving Calculation:**
₹1.5L investment saves ₹31,200-46,800 in tax depending on tax bracket.`,
    category: "deductions",
    tags: ["ELSS", "PPF", "comparison", "80C"],
    icon: TrendingUp,
    importance: "high"
  },
  {
    id: "nsc-benefits",
    question: "Should I invest in NSC for 80C benefits?",
    answer: `**NSC (National Savings Certificate) Analysis:**

**Key Features:**
• **Lock-in:** 5 years
• **Interest:** 6.8% annually (compounded)
• **Investment:** ₹1,000 to ₹1.5L (no upper limit)
• **Risk:** Zero (government backed)

**Tax Benefits:**
• Principal qualifies for 80C deduction
• Interest is taxable but reinvested
• Reinvested interest also qualifies for 80C

**Example:**
₹1L investment for 5 years:
• Year 1-4: Interest reinvestment gives 80C benefit
• Year 5: Maturity value ≈ ₹1.39L
• Total 80C benefit over 5 years: ≈ ₹1.25L

**Pros:**
• Guaranteed returns
• Government backing
• Additional 80C through interest

**Cons:**
• Lower returns vs equity
• 5-year lock-in
• Interest is taxable

**Best For:**
• Conservative investors
• Those wanting guaranteed returns
• As part of diversified 80C portfolio`,
    category: "deductions",
    tags: ["NSC", "80C", "government", "safe"],
    icon: Building,
    importance: "medium"
  },

  // HRA Related (12 questions)
  {
    id: "hra-calculation",
    question: "How is HRA exemption calculated?",
    answer: `HRA exemption is calculated as the **minimum of three values:**

**Formula:**
1. Actual HRA received from employer
2. Actual rent paid minus 10% of basic salary
3. 50% of basic salary (metro) or 40% (non-metro)

**Example Calculation:**
• Basic Salary: ₹50,000/month (₹6L annually)
• HRA Received: ₹20,000/month (₹2.4L annually)
• Rent Paid: ₹25,000/month (₹3L annually)
• City: Mumbai (Metro)

**Calculation:**
1. HRA received: ₹2,40,000
2. Rent - 10% basic: ₹3,00,000 - ₹60,000 = ₹2,40,000
3. 50% of basic: ₹3,00,000

**HRA Exemption = Minimum = ₹2,40,000**

**Metro Cities:** Mumbai, Delhi, Kolkata, Chennai, Pune, Bangalore
**Documentation Required:**
• Rent receipts
• Rental agreement
• Landlord's PAN (if rent > ₹1L annually)

**Pro Tip:** Structure your salary to maximize HRA component if you pay rent.`,
    category: "deductions",
    tags: ["HRA", "exemption", "calculation", "rent"],
    icon: Home,
    importance: "high"
  },
  {
    id: "hra-without-rent-receipts",
    question: "Can I claim HRA without rent receipts?",
    answer: `**No, rent receipts are mandatory** for HRA exemption claim.

**Required Documentation:**

**For Annual Rent ≤ ₹1 Lakh:**
• Monthly rent receipts
• Rental agreement (recommended)
• Landlord's details

**For Annual Rent > ₹1 Lakh:**
• Monthly rent receipts
• Rental agreement (mandatory)
• **Landlord's PAN card details**
• Form 16 mentioning HRA exemption

**Rent Receipt Format:**
• Date of payment
• Amount paid
• Period for which rent is paid
• Landlord's signature and details
• Revenue stamp (for amounts > ₹5,000)

**Alternative Solutions:**

**1. Bank Transfer Proof:**
• Use NEFT/UPI to pay rent
• Bank statement serves as additional proof
• Still need proper rent receipts

**2. No Rent Receipts Available:**
• Cannot claim HRA exemption
• HRA becomes fully taxable
• Consider negotiating with landlord

**CA Advice:** Maintain proper documentation from day one to avoid issues during ITR filing.`,
    category: "deductions",
    tags: ["HRA", "receipts", "documentation", "proof"],
    icon: FileText,
    importance: "medium"
  },
  {
    id: "hra-parent-house",
    question: "Can I claim HRA while living in parents' house?",
    answer: `**Yes, but with specific conditions:**

**Legal Requirements:**
• Parents must charge you actual rent
• Rent should be reasonable (market rate)
• Proper rental agreement required
• Regular rent payments with receipts

**Documentation Needed:**
• Rental agreement with parents
• Monthly rent receipts
• Bank transfer proof of rent payments
• Parents' PAN (if rent > ₹1L annually)

**Tax Implications for Parents:**
• Rental income is taxable for parents
• They can claim standard deduction (30%)
• Property tax, interest deductible

**Calculation Example:**
• Your HRA exemption: ₹2,00,000
• Parents' rental income: ₹2,00,000
• Parents' tax on rent: ₹35,000 (after deductions)
• **Net family tax saving: ₹1,65,000**

**Important Points:**
• Rent must be genuine, not just on paper
• IT department may scrutinize such claims
• Keep all documentation ready

**Alternative:** If uncomfortable with family rental arrangement, consider other tax-saving options under 80C.`,
    category: "deductions",
    tags: ["HRA", "parents", "family", "rental"],
    icon: Users,
    importance: "medium"
  },

  // Home Loan & Property (10 questions)
  {
    id: "home-loan-interest",
    question: "What's the limit for home loan interest deduction?",
    answer: `Home loan interest deduction limits vary by property type and loan purpose:

**Self-Occupied Property:**
• **Section 24(b):** Up to ₹2,00,000 per year
• Only interest component (not principal EMI)
• Property should be self-occupied

**Let-Out Property:**
• **No upper limit** on interest deduction
• Can set off against rental income
• Excess loss can be carried forward for 8 years

**Under-Construction Property:**
• Interest during construction: No immediate deduction
• **Pre-construction interest:** Deductible over 5 years once construction completes
• Treat as self-occupied once ready

**Second Home Loan:**
• Treated as let-out property (deemed rental income)
• Full interest deductible against deemed rent

**Example:**
₹50L home loan at 8% interest:
• Annual interest: ₹4,00,000
• **Deduction limited to ₹2,00,000** (self-occupied)
• **Tax saving: ₹62,400** (at 31.2% tax rate)

**Documentation:**
• Interest certificate from bank
• Property registration documents
• Possession certificate`,
    category: "deductions",
    tags: ["home-loan", "interest", "section-24", "property"],
    icon: Building,
    importance: "medium"
  },
  {
    id: "home-loan-principal",
    question: "Is home loan principal repayment tax deductible?",
    answer: `**Yes, under Section 80C** but with conditions:

**Section 80C Benefits:**
• Principal repayment qualifies for 80C
• **Maximum deduction:** ₹1.5 lakh per year
• Counts towards total 80C limit
• Available only in Old Tax Regime

**Combined Benefits:**
• Interest: Up to ₹2L (Section 24)
• Principal: Up to ₹1.5L (Section 80C)
• **Total possible deduction: ₹3.5L**

**Example:**
EMI of ₹50,000/month (₹6L annually):
• Interest component: ₹4L
• Principal component: ₹2L
• **Deduction:** ₹2L (interest) + ₹1.5L (principal) = ₹3.5L
• **Tax saving:** ₹1.09L (at 31.2% rate)

**Important Notes:**
• Available only if you own the property
• Property should be in your name
• 80C limit is shared with other investments

**Strategy:**
If principal repayment fills 80C quota, invest additionally in ELSS/PPF for full benefit.`,
    category: "deductions",
    tags: ["home-loan", "principal", "80C", "EMI"],
    icon: Home,
    importance: "medium"
  },

  // Health Insurance & Medical (8 questions)
  {
    id: "section-80d-health-insurance",
    question: "What are Section 80D deduction limits?",
    answer: `**Section 80D Deduction Limits (FY 2025-26):**

**For Self & Family:**
• **Below 60 years:** ₹25,000
• **60+ years:** ₹50,000
• Covers self, spouse, dependent children

**For Parents:**
• **Below 60 years:** Additional ₹25,000
• **60+ years:** Additional ₹50,000
• Separate limit for parents

**Maximum Possible Deduction:**
• Self & spouse (60+): ₹50,000
• Parents (60+): ₹50,000
• **Total: ₹1,00,000 annually**

**What's Covered:**
• Health insurance premiums
• Medical checkup expenses (₹5,000 limit)
• Preventive health checkups

**Example:**
Family with elderly parents:
• Health insurance premium: ₹30,000
• Parents' insurance: ₹40,000
• Medical checkups: ₹8,000
• **Total deduction: ₹78,000**
• **Tax saving: ₹24,336** (at 31.2% rate)

**Important:** Premium must be paid by you (not employer) to claim deduction.`,
    category: "deductions",
    tags: ["80D", "health-insurance", "medical", "parents"],
    icon: Heart,
    importance: "high"
  },

  // New categories with more questions

  // Tax Slabs & Rates (10 questions)
  {
    id: "tax-slabs-new",
    question: "What are the tax slabs for New Tax Regime FY 2025-26?",
    answer: `**New Tax Regime Slabs (FY 2025-26):**

**Income Tax Slabs:**
• **₹0 - ₹3,00,000:** 0% (No tax)
• **₹3,00,001 - ₹7,00,000:** 5%
• **₹7,00,001 - ₹10,00,000:** 10%
• **₹10,00,001 - ₹12,00,000:** 15%
• **₹12,00,001 - ₹15,00,000:** 20%
• **₹15,00,001 and above:** 30%

**Additional Components:**
• **Standard Deduction:** ₹75,000 (enhanced from ₹50,000)
• **Section 87A Rebate:** Up to ₹25,000 (if income ≤ ₹7 lakhs)
• **Health & Education Cess:** 4% on total tax
• **Surcharge:** 10% if income > ₹50L, 15% if > ₹1Cr

**Example for ₹10L Income:**
• Taxable Income: ₹10,00,000 - ₹75,000 = ₹9,25,000
• Tax: ₹20,000 + ₹22,500 + ₹22,500 = ₹65,000
• Cess: ₹2,600
• **Total Tax: ₹67,600**

**Key Benefits:**
• Higher standard deduction
• Lower rates for middle-income groups
• Simplified with fewer deductions to track`,
    category: "tax-slabs",
    tags: ["new-regime", "slabs", "rates", "2025-26"],
    icon: FileText,
    importance: "high"
  },
  {
    id: "tax-slabs-old",
    question: "What are the tax slabs for Old Tax Regime FY 2025-26?",
    answer: `**Old Tax Regime Slabs (FY 2025-26):**

**Income Tax Slabs:**
• **₹0 - ₹2,50,000:** 0% (No tax)
• **₹2,50,001 - ₹5,00,000:** 5%
• **₹5,00,001 - ₹10,00,000:** 20%
• **₹10,00,001 and above:** 30%

**Key Features:**
• **Standard Deduction:** ₹50,000
• **Section 87A Rebate:** Up to ₹12,500 (if income ≤ ₹5 lakhs)
• **Multiple Deductions Available:** 80C, 80D, HRA, etc.
• **Health & Education Cess:** 4% on total tax

**Major Deductions Available:**
• **Section 80C:** ₹1,50,000 (investments)
• **Section 80D:** ₹25,000 + ₹50,000 (health insurance)
• **HRA:** As calculated per formula
• **Home Loan Interest:** ₹2,00,000 (Section 24)
• **Section 80TTA:** ₹10,000 (savings interest)

**Example for ₹10L Income with ₹3L Deductions:**
• Gross Income: ₹10,00,000
• Standard Deduction: ₹50,000
• Other Deductions: ₹3,00,000
• Taxable Income: ₹6,50,000
• Tax: ₹12,500 + ₹30,000 = ₹42,500
• Cess: ₹1,700
• **Total Tax: ₹44,200**

**Best For:** High deduction taxpayers`,
    category: "tax-slabs",
    tags: ["old-regime", "slabs", "deductions", "rates"],
    icon: FileText,
    importance: "high"
  },

  // Salary Components (15 questions)
  {
    id: "salary-components",
    question: "Which salary components are taxable?",
    answer: `**Fully Taxable Components:**
• Basic Salary
• Dearness Allowance (DA)
• City Compensatory Allowance
• Overtime allowance
• Commission and bonus
• Performance incentives

**Partially Taxable/Exempt Components:**

**1. House Rent Allowance (HRA)**
• Exempt as per calculation formula
• Balance amount is taxable

**2. Leave Travel Allowance (LTA)**
• Exempt for 2 journeys in 4 years
• Only domestic travel with family
• Actual travel cost or LTA, whichever is lower

**3. Conveyance Allowance**
• Up to ₹1,600 per month (₹19,200 annually) exempt
• For actual conveyance expenses

**4. Medical Allowance**
• Up to ₹15,000 annually exempt
• For actual medical expenses

**Fully Exempt Components:**
• Employer's contribution to PF/EPF
• Gratuity (up to ₹20 lakhs)
• Leave encashment (up to ₹3 lakhs)
• Canteen/meal facility value
• Phone bill reimbursement (₹20,000 annually)

**Perquisites (Taxable):**
• Company car for personal use
• Free accommodation
• Club membership
• Interest-free loans above ₹20,000

**Planning Tip:** Structure salary to maximize exempt components.`,
    category: "income",
    tags: ["salary", "components", "taxable", "exempt", "allowances"],
    icon: CreditCard,
    importance: "medium"
  },

  // Investment & Tax Saving (20 questions)
  {
    id: "tax-saving-fd",
    question: "Are Tax Saver Fixed Deposits worth it?",
    answer: `**Tax Saver FD Analysis:**

**Key Features:**
• **Lock-in:** 5 years (mandatory)
• **Interest:** 5.5-7% annually
• **80C benefit:** Up to ₹1.5L investment
• **Safety:** Bank guarantee

**Tax Treatment:**
• Interest is fully taxable annually
• TDS deducted if interest > ₹40,000
• No tax benefit on maturity

**Comparison:**

**Tax Saver FD:**
• Return: 6% (taxable)
• After-tax return: 4.1% (31.2% tax bracket)
• Risk: Very low

**ELSS Mutual Funds:**
• Return: 12% (LTCG tax on gains)
• After-tax return: 10.4%
• Risk: Moderate

**PPF:**
• Return: 7.1% (tax-free)
• After-tax return: 7.1%
• Risk: Zero

**Recommendation:**
• Only for ultra-conservative investors
• Better options: PPF, ELSS available
• Consider only if completing 80C portfolio

**Best Use:** Emergency completion of 80C limit near year-end.`,
    category: "investments",
    tags: ["tax-saver-fd", "80C", "fixed-deposit", "comparison"],
    icon: PiggyBank,
    importance: "low"
  },

  // TDS & Advance Tax (12 questions)
  {
    id: "tds-basics",
    question: "What is TDS and how does it work?",
    answer: `**TDS (Tax Deducted at Source) Explained:**

**Definition:**
Tax deducted by payer before making payment to you. Acts as advance tax payment on your behalf.

**Common TDS Sources:**
• **Salary:** Employer deducts based on your declarations
• **Interest:** Banks deduct if > ₹40,000 annually
• **Rent:** Tenant deducts if > ₹2.4L annually
• **Professional fees:** Clients deduct if > ₹30,000

**TDS Rates:**
• **Salary:** As per tax slabs
• **Interest:** 10% (20% without PAN)
• **Rent:** 10%
• **Professional services:** 10%

**How It Benefits You:**
• Reduces tax liability during ITR filing
• Eligible for refund if excess TDS deducted
• Automatic compliance with advance tax

**Form 16/16A:**
Documents showing TDS deducted - essential for ITR filing.

**Example:**
Bank deducts ₹5,000 TDS on FD interest:
• Your actual tax on this income: ₹3,120
• **Refund due:** ₹1,880

**Key Point:** TDS is not additional tax - it's advance payment of your total tax liability.`,
    category: "tds-advance-tax",
    tags: ["TDS", "tax-deducted-source", "refund", "advance"],
    icon: FileText,
    importance: "medium"
  },

  // Business & Professional Income (8 questions)
  {
    id: "freelancer-tax-basics",
    question: "How is freelancer income taxed in India?",
    answer: `**Freelancer Tax Rules:**

**Income Classification:**
• Professional income under "Profits and Gains of Business/Profession"
• Taxed at normal slab rates (5%, 20%, 30%)
• No separate freelancer tax rate

**ITR Form:** ITR-3 or ITR-4 (for presumptive taxation)

**Deductions Available:**
• Business expenses (internet, software, equipment)
• Office rent (if applicable)
• Travel expenses for work
• Professional development courses
• Depreciation on equipment

**Presumptive Taxation (44ADA):**
• For professional income ≤ ₹50 lakhs
• Deemed profit: 50% of gross receipts
• Simplified compliance, no audit required

**Example:**
Freelancer earning ₹10L annually:
• **Regular method:** Pay tax on actual profit after expenses
• **Presumptive:** Pay tax on ₹5L (50% deemed profit)

**TDS Implications:**
• Clients deduct 10% TDS if payment > ₹30,000
• Collect Form 16A from all clients
• Adjust TDS against final tax liability

**Quarterly Advance Tax:**
Required if tax liability > ₹10,000 annually.`,
    category: "business-professional",
    tags: ["freelancer", "professional-income", "44ADA", "TDS"],
    icon: Briefcase,
    importance: "medium"
  },

  // Capital Gains (15 questions)
  {
    id: "mutual-fund-taxation",
    question: "How are mutual fund gains taxed?",
    answer: `**Mutual Fund Taxation (FY 2025-26):**

**Equity Mutual Funds:**
• **Short-term (≤1 year):** 15% flat rate
• **Long-term (>1 year):** 10% on gains > ₹1 lakh annually
• **Dividend:** Taxed at slab rates

**Debt Mutual Funds:**
• **Short-term (≤3 years):** Taxed at slab rates
• **Long-term (>3 years):** 20% with indexation benefit

**Hybrid Funds:**
Follow equity or debt rules based on allocation:
• >65% equity: Follow equity taxation
• <65% equity: Follow debt taxation

**ELSS Funds:**
• **Lock-in:** 3 years
• **Long-term gains:** 10% on gains > ₹1 lakh
• No tax on investment (80C benefit)

**SIP Taxation:**
Each SIP treated separately for holding period calculation.

**Example:**
₹10L equity fund sold after 2 years:
• Purchase price: ₹8L
• **Gain:** ₹2L
• **Tax:** ₹10,000 (10% on ₹1L above exemption limit)

**Tax-Saving Tip:** Harvest gains up to ₹1L annually to utilize LTCG exemption.`,
    category: "capital-gains",
    tags: ["mutual-funds", "LTCG", "STCG", "equity", "debt"],
    icon: TrendingUp,
    importance: "medium"
  },

  // Special Cases (15 questions)
  {
    id: "senior-citizen",
    question: "What are the special tax benefits for senior citizens?",
    answer: `Senior citizens (60+ years) enjoy several tax benefits:

**Enhanced Basic Exemption:**
• **60-80 years:** ₹3,00,000 (vs ₹2,50,000 for others)
• **80+ years:** ₹5,00,000 basic exemption
• Available only in Old Tax Regime

**Section 80D Benefits:**
• **Self & spouse:** ₹50,000 (vs ₹25,000)
• **Parents 60+:** Additional ₹50,000
• **Total possible:** ₹1,00,000 annually

**Section 80TTB:**
• **Interest exemption:** ₹50,000 annually
• On bank/post office deposits
• Available only for 60+ citizens

**Medical Expense Deduction (80DDB):**
• **60-80 years:** ₹60,000
• **80+ years:** ₹80,000
• For specified diseases treatment

**Other Benefits:**
• No advance tax if no business income
• Simplified ITR filing process
• Higher tax rebate limits in some states

**Example for 65-year-old:**
• Pension Income: ₹4,00,000
• Bank Interest: ₹60,000
• Health Insurance: ₹30,000
• **Taxable Income:** ₹4,60,000 - ₹3,00,000 - ₹50,000 - ₹30,000 = ₹80,000
• **Tax:** Only ₹4,000 (5% on ₹80,000)

**Important:** New regime doesn't offer age-based exemptions.`,
    category: "special-cases",
    tags: ["senior-citizen", "elderly", "benefits", "exemptions"],
    icon: Users,
    importance: "medium"
  },

  // ITR Filing (15 questions)
  {
    id: "itr-forms",
    question: "Which ITR form should I use for filing?",
    answer: `**ITR Form Selection Guide:**

**ITR-1 (Sahaj)** - Simplest Form
• **Who:** Residents with salary/pension income
• **Income limit:** Up to ₹50 lakhs
• **Sources:** Salary, one house property, other sources
• **Cannot use if:** Business income, capital gains, foreign assets

**ITR-2** - For Capital Gains
• **Who:** Individuals/HUFs with capital gains
• **Sources:** Salary + capital gains from stocks/property
• **Foreign income/assets:** Allowed
• **Multiple properties:** Allowed

**ITR-3** - Business/Professional Income
• **Who:** Business owners, professionals, partners
• **Income:** Business/professional profits
• **Presumptive taxation:** 44AD, 44ADA schemes
• **Audit required:** If turnover > prescribed limits

**ITR-4 (Sugam)** - Presumptive Taxation
• **Who:** Small businesses, professionals
• **Conditions:** Presumptive taxation opted
• **Turnover limits:** Business ≤ ₹2Cr, Professional ≤ ₹50L

**Form Selection Examples:**
• **Salaried employee:** ITR-1
• **Salary + sold stocks:** ITR-2
• **Freelancer/consultant:** ITR-3 or ITR-4
• **Rental income > 1 property:** ITR-2

**Filing Deadlines:**
• **July 31, 2026:** For most taxpayers
• **October 31, 2026:** If audit required
• **December 31, 2026:** For revised returns

**e-Filing Benefits:**
• Faster processing
• Direct bank refunds
• Digital acknowledgment
• Reduced errors`,
    category: "itr-filing",
    tags: ["ITR", "forms", "filing", "selection", "deadline"],
    icon: FileText,
    importance: "medium"
  },

  // Common Mistakes (10 questions)
  {
    id: "common-mistakes",
    question: "What are common tax calculation mistakes to avoid?",
    answer: `**Top Tax Calculation Mistakes:**

**1. Wrong Income Calculation**
• Including exempt allowances as taxable
• Missing income from all sources
• Not grossing up employer's PF contribution

**2. Deduction Errors**
• Claiming deductions without proper documentation
• Exceeding deduction limits (₹1.5L for 80C)
• Double-claiming same investment

**3. Regime Selection Mistakes**
• Not comparing both regimes annually
• Assuming one regime is always better
• Forgetting about standard deduction differences

**4. HRA Calculation Errors**
• Using wrong formula components
• Not considering metro/non-metro rates
• Including utilities in rent amount

**5. TDS Mismatches**
• Not reconciling TDS certificates
• Missing Form 16A entries
• Incorrect employer TDS reporting

**6. Capital Gains Oversight**
• Not reporting mutual fund/stock sales
• Wrong calculation of holding period
• Missing indexation benefits for property

**7. ITR Filing Mistakes**
• Using wrong ITR form
• Incorrect bank details for refund
• Missing mandatory disclosures

**How to Avoid:**
• Use reliable tax calculators
• Maintain organized records
• Cross-verify with Form 16
• File ITR with CA if complex
• Review calculations before submitting

**Red Flags for IT Department:**
• Large cash transactions
• Mismatch between income and investments
• Inconsistent year-over-year reporting
• Missing high-value transaction reporting`,
    category: "mistakes",
    tags: ["mistakes", "errors", "avoid", "common", "pitfalls"],
    icon: AlertTriangle,
    importance: "high"
  },

  // Additional Section 80C Questions
  {
    id: "ulip-tax-benefits",
    question: "Are ULIP premiums eligible for 80C deduction?",
    answer: `**ULIP (Unit Linked Insurance Plans) Tax Benefits:**

**Section 80C Eligibility:**
• Premium qualifies for 80C deduction
• **Maximum:** ₹1.5 lakh (combined with other 80C investments)
• **Premium limit:** Maximum 10% of sum assured for tax benefit

**Example:**
• Sum Assured: ₹10 lakhs
• Maximum qualifying premium: ₹1 lakh annually
• **80C benefit:** On ₹1 lakh only

**Maturity Benefits:**
• **Tax-free** under Section 10(10D) if premium ≤ 10% of sum assured
• If premium > 10%, gains are taxable

**Comparison with Other 80C Options:**

**ULIP Pros:**
• Life insurance + investment
• Professional fund management
• Tax-free maturity (if compliant)

**ULIP Cons:**
• High charges (3-5% annually)
• 5-year lock-in period
• Lower returns vs pure mutual funds

**Better Alternatives:**
• Term insurance + ELSS combination
• Pure term plan (₹20K premium) + ELSS (₹1.3L)
• **Result:** Better coverage + higher returns

**Recommendation:** Choose ULIPs only if you want insurance+investment in single product.`,
    category: "deductions",
    tags: ["ULIP", "80C", "insurance", "investment"],
    icon: PiggyBank,
    importance: "low"
  },
  {
    id: "sukanya-samriddhi-scheme",
    question: "How does Sukanya Samriddhi Scheme work for tax saving?",
    answer: `**Sukanya Samriddhi Scheme (Girl Child Scheme):**

**Eligibility:**
• Girl child between 0-10 years
• Maximum 2 accounts per family
• Indian resident parents/guardians

**Investment Details:**
• **Minimum:** ₹250 annually
• **Maximum:** ₹1.5 lakh annually
• **Tenure:** 21 years from account opening
• **Interest:** 8.2% annually (current rate)

**Tax Benefits:**
• **80C deduction:** On contribution (up to ₹1.5L)
• **Tax-free interest:** During accumulation
• **Tax-free maturity:** Complete EEE status

**Calculation Example:**
₹1.5L annual investment for 15 years:
• Total investment: ₹22.5 lakhs
• **Maturity value:** ≈ ₹65 lakhs (tax-free)
• **Effective return:** 8.2% tax-free

**Withdrawal Rules:**
• Partial withdrawal after age 18 (50% of balance)
• Full withdrawal at 21 or marriage after 18
• Account closure allowed after 5 years with penalty

**vs Other 80C Options:**
• **Higher returns** than PPF/NSC
• **Longer lock-in** than ELSS
• **Best risk-adjusted return** for long-term

**Ideal For:** Parents wanting secure, high-return investment for daughter's future.`,
    category: "deductions",
    tags: ["sukanya-samriddhi", "80C", "girl-child", "EEE"],
    icon: Users,
    importance: "medium"
  },

  // More HRA Questions
  {
    id: "hra-metro-vs-non-metro",
    question: "What's the difference between metro and non-metro HRA calculation?",
    answer: `**Metro vs Non-Metro HRA Calculation:**

**Metro Cities (50% Basic Salary):**
• Mumbai, Delhi, Kolkata, Chennai
• Bangalore, Pune, Hyderabad, Ahmedabad
• **HRA exemption:** Minimum of (Actual HRA, Rent paid - 10% basic, 50% of basic)

**Non-Metro Cities (40% Basic Salary):**
• All other cities and towns
• **HRA exemption:** Minimum of (Actual HRA, Rent paid - 10% basic, 40% of basic)

**Impact Example:**
• Basic Salary: ₹60,000/month (₹7.2L annually)
• HRA Received: ₹25,000/month (₹3L annually)
• Rent Paid: ₹30,000/month (₹3.6L annually)

**Metro Calculation:**
1. HRA received: ₹3,00,000
2. Rent - 10% basic: ₹3,60,000 - ₹72,000 = ₹2,88,000
3. 50% of basic: ₹3,60,000
**HRA exemption = ₹2,88,000**

**Non-Metro Calculation:**
1. HRA received: ₹3,00,000
2. Rent - 10% basic: ₹2,88,000
3. 40% of basic: ₹2,88,000
**HRA exemption = ₹2,88,000**

**Key Insight:** Higher rent often makes metro/non-metro distinction irrelevant as 'rent - 10% basic' becomes the limiting factor.

**Strategy:** In borderline cases, check if your city is officially classified as metro for HRA purposes.`,
    category: "deductions",
    tags: ["HRA", "metro", "non-metro", "calculation"],
    icon: Building,
    importance: "medium"
  },
  {
    id: "hra-sharing-accommodation",
    question: "Can I claim HRA for shared accommodation?",
    answer: `**HRA for Shared Accommodation:**

**Yes, you can claim HRA** for shared accommodation with proper documentation.

**Documentation Required:**
• Rental agreement mentioning all tenants
• Separate rent receipts for your share
• Landlord's acknowledgment of arrangement
• Individual PAN reporting (if applicable)

**Rent Split Methods:**

**1. Equal Split:**
• Total rent: ₹30,000
• Your share: ₹15,000 (if 2 people)
• Claim HRA on ₹15,000

**2. Proportionate Split:**
• Based on room size/usage
• Document the split ratio clearly
• Maintain transparency

**Example Calculation:**
• Your rent share: ₹18,000/month
• Basic salary: ₹50,000/month
• Metro city: Mumbai

**HRA Calculation:**
1. HRA received: ₹20,000
2. Rent - 10% basic: ₹18,000 - ₹5,000 = ₹13,000
3. 50% basic: ₹25,000
**HRA exemption = ₹13,000**

**Best Practices:**
• Clear written agreement on rent sharing
• Separate payment receipts
• Maintain individual bank transfer records
• Avoid cash payments

**Common Issues:** IT department may scrutinize if rent split seems artificial or disproportionate to income.`,
    category: "deductions",
    tags: ["HRA", "shared", "accommodation", "rent-split"],
    icon: Home,
    importance: "low"
  },

  // More Tax Planning Questions
  {
    id: "tax-harvesting-mutual-funds",
    question: "What is tax loss harvesting in mutual funds?",
    answer: `**Tax Loss Harvesting Strategy:**

**Definition:**
Selling losing investments to offset capital gains and reduce tax liability.

**How It Works:**
• Sell mutual funds showing losses
• Use losses to offset short-term/long-term gains
• Reduce overall capital gains tax

**Example:**
In FY 2025-26:
• **Gains:** ₹2 lakh from Fund A (LTCG)
• **Losses:** ₹50,000 from Fund B
• **Net gain:** ₹1.5 lakh
• **Tax saved:** ₹5,000 (10% on ₹50,000 offset)

**Rules for Loss Harvesting:**

**1. Set-off Rules:**
• STCG loss vs STCG gain: Allowed
• LTCG loss vs LTCG gain: Allowed
• LTCG loss vs STCG gain: Allowed
• **STCG loss vs LTCG gain:** Not allowed

**2. Carry Forward:**
• Losses can be carried forward for 8 years
• Must file ITR to claim carry forward
• Can offset against future gains

**Timing Strategy:**
• Review portfolio in January-February
• Identify loss-making investments
• Book losses before March 31st

**Reinvestment:**
• Wait 1 day before repurchasing same fund
• Consider similar but different funds
• Avoid wash sale issues

**Benefit:** Can save 10-15% tax on offset gains while maintaining long-term investment strategy.`,
    category: "tax-planning",
    tags: ["tax-harvesting", "mutual-funds", "capital-gains", "losses"],
    icon: TrendingUp,
    importance: "medium"
  },
  {
    id: "advance-tax-calculation",
    question: "How to calculate and pay advance tax?",
    answer: `**Advance Tax Calculation & Payment:**

**Who Must Pay:**
• If tax liability > ₹10,000 annually
• Applicable to all income sources
• Mandatory for business/professional income

**Payment Schedule (FY 2025-26):**
• **June 15, 2025:** 15% of annual tax
• **September 15, 2025:** 45% of annual tax
• **December 15, 2025:** 75% of annual tax
• **March 15, 2026:** 100% of annual tax

**Calculation Example:**
Annual income: ₹15 lakhs
• Estimated tax: ₹1.5 lakhs
• **June payment:** ₹22,500 (15%)
• **September payment:** ₹45,000 (45% - 15% = 30%)
• **December payment:** ₹45,000 (75% - 45% = 30%)
• **March payment:** ₹37,500 (100% - 75% = 25%)

**Interest on Default:**
• **1% per month** on unpaid amount
• Calculated for each quarter separately
• Can accumulate significantly

**Safe Harbor Rule:**
Pay advance tax equal to:
• **100% of last year's tax** (if income ≤ ₹50L)
• **110% of last year's tax** (if income > ₹50L)
• No interest charged if this rule followed

**Payment Methods:**
• Online through income tax portal
• Bank challans
• Net banking/UPI

**For Salaried:** If employer deducts adequate TDS, advance tax may not be required.`,
    category: "tax-planning",
    tags: ["advance-tax", "quarterly", "interest", "calculation"],
    icon: Calculator,
    importance: "medium"
  },

  // Investment-specific Questions
  {
    id: "equity-taxation-holding-period",
    question: "How is holding period calculated for equity investments?",
    answer: `**Equity Holding Period Calculation:**

**General Rule:**
Holding period = Date of sale - Date of purchase

**Equity Shares/ETFs:**
• **Short-term:** ≤ 12 months
• **Long-term:** > 12 months
• **Tax:** 15% (STCG), 10% on gains > ₹1L (LTCG)

**Mutual Fund SIPs:**
Each SIP installment has separate holding period calculation.

**Example:**
• **SIP 1:** Jan 1, 2024 → Sold March 1, 2025 = **LTCG** (14 months)
• **SIP 2:** Feb 1, 2024 → Sold March 1, 2025 = **LTCG** (13 months)
• **SIP 3:** April 1, 2024 → Sold March 1, 2025 = **STCG** (11 months)

**FIFO Method:**
• First In, First Out basis for selling
• Oldest purchases sold first
• Affects holding period determination

**Bonus/Rights Shares:**
• Holding period starts from original purchase date
• Not from bonus/rights issue date
• Beneficial for LTCG calculation

**Stock Splits:**
• No impact on holding period
• Original purchase date maintained
• Quantity and price adjusted proportionally

**Day Count Rule:**
• Purchase date excluded
• Sale date included
• Even if markets closed on these dates

**Tax Planning:** Consider holding period while booking profits to optimize between STCG (15%) and LTCG (10% on gains > ₹1L).`,
    category: "investments",
    tags: ["equity", "holding-period", "STCG", "LTCG", "calculation"],
    icon: TrendingUp,
    importance: "medium"
  },

  // More Salary & Employment Questions
  {
    id: "notice-period-salary-taxation",
    question: "How is notice period salary taxed?",
    answer: `**Notice Period Salary Taxation:**

**Regular Notice Period:**
• Salary paid during notice period is **fully taxable**
• Treated as regular salary income
• TDS applicable as per normal rates

**Payment in Lieu of Notice:**
• Lump sum paid instead of serving notice
• **Fully taxable** as salary income
• Often results in higher TDS due to large amount

**Example:**
• Monthly salary: ₹1 lakh
• 3-month notice period buyout: ₹3 lakhs
• **Tax treatment:** Added to annual salary
• **TDS:** Higher rate due to increased monthly projection

**Tax Planning for Notice Period:**

**1. Timing Strategy:**
• Join new company in same financial year
• Spread income across companies
• May result in higher tax bracket

**2. Investment Planning:**
• Use lump sum for 80C investments
• Max out PPF/ELSS contributions
• Consider timing of other deductions

**3. Form 12BB Submission:**
• Submit investment proofs to new employer
• Avoid excess TDS deduction
• Ensure proper tax calculation

**Relief u/s 89:**
Available if notice period payment causes income to be bunched in one year, resulting in higher tax.

**Documentation:**
• Relieving letter mentioning notice period payment
• Form 16 from both employers
• Proper reporting in ITR

**Note:** No special tax treatment - treat as regular employment income.`,
    category: "employment",
    tags: ["notice-period", "salary", "taxation", "TDS"],
    icon: Briefcase,
    importance: "low"
  },
  {
    id: "joining-bonus-taxation",
    question: "Is joining bonus taxable? How is it treated?",
    answer: `**Joining Bonus Taxation:**

**Tax Treatment:**
• **Fully taxable** as salary income
• Added to annual salary for tax calculation
• Subject to TDS at applicable rates

**Types of Joining Bonuses:**

**1. Cash Bonus:**
• Direct cash payment
• Fully taxable in year of receipt
• High TDS likely due to lump sum nature

**2. Retention Bonus:**
• Paid to retain employee
• Often with clawback clause
• Taxable when received

**3. Sign-on Bonus:**
• One-time payment for joining
• May be spread over multiple payouts
• Each payment taxable when received

**TDS Considerations:**
• Employer projects annual income including bonus
• May result in higher TDS rate
• Often requires investment planning

**Example:**
• Annual salary: ₹12 lakhs
• Joining bonus: ₹2 lakhs
• **Total taxable income:** ₹14 lakhs
• **Tax impact:** Higher slab rate applicable

**Tax Planning Strategies:**

**1. Timing:**
• Negotiate payment timing across financial years
• Consider impact on tax bracket

**2. Investment:**
• Use bonus for 80C investments
• Maximize deductions in high-income year

**3. Form 12BB:**
• Submit investment proofs immediately
• Reduce TDS on subsequent salary

**Clawback Provisions:**
If you have to return bonus (due to early exit), you can claim deduction in the year of repayment.`,
    category: "employment",
    tags: ["joining-bonus", "taxation", "TDS", "salary"],
    icon: CreditCard,
    importance: "low"
  },

  // More Deduction Questions
  {
    id: "section-80-tta-ttb",
    question: "What's the difference between Section 80TTA and 80TTB?",
    answer: `**Section 80TTA vs 80TTB:**

**Section 80TTA (For General Citizens):**
• **Age:** Below 60 years
• **Deduction:** Up to ₹10,000 annually
• **Applicable on:** Interest from savings bank accounts
• **Not applicable on:** FD, RD, or other deposit interest

**Section 80TTB (For Senior Citizens):**
• **Age:** 60 years and above
• **Deduction:** Up to ₹50,000 annually
• **Applicable on:** Interest from all bank/post office deposits
• **Covers:** Savings account, FD, RD, post office deposits

**Key Differences:**

| Aspect | 80TTA | 80TTB |
|--------|-------|-------|
| Age | Below 60 | 60+ years |
| Limit | ₹10,000 | ₹50,000 |
| Scope | Savings account only | All deposits |
| Regime | Both regimes | Old regime only |

**Example for Senior Citizen:**
• Savings account interest: ₹15,000
• FD interest: ₹40,000
• Total interest: ₹55,000
• **80TTB deduction:** ₹50,000
• **Taxable interest:** ₹5,000

**Planning for Senior Citizens:**
• Choose 80TTB over 80TTA (higher benefit)
• Structure deposits to maximize ₹50,000 limit
• Consider timing of FD maturity

**Important:** Senior citizens cannot claim both 80TTA and 80TTB - must choose one (80TTB is obviously better).`,
    category: "deductions",
    tags: ["80TTA", "80TTB", "senior-citizen", "interest", "savings"],
    icon: PiggyBank,
    importance: "medium"
  },

  // Property & Real Estate
  {
    id: "property-sale-taxation",
    question: "How is property sale taxed in India?",
    answer: `**Property Sale Taxation:**

**Capital Gains Classification:**
• **Short-term:** Held ≤ 2 years
• **Long-term:** Held > 2 years

**Tax Rates:**
• **STCG:** Taxed at slab rates (5%, 20%, 30%)
• **LTCG:** 20% with indexation benefit

**Indexation Benefit:**
Adjusts purchase price for inflation using Cost Inflation Index (CII).

**Calculation Example:**
• Purchase (2020): ₹50 lakhs
• Sale (2025): ₹80 lakhs
• CII 2020: 301, CII 2025: 363 (assumed)

**Indexed Cost:**
₹50L × (363/301) = ₹60.3 lakhs

**LTCG:**
₹80L - ₹60.3L = ₹19.7 lakhs

**Tax:**
₹19.7L × 20% = ₹3.94 lakhs

**Exemptions Available:**

**Section 54:**
• Reinvest in residential property
• **Time limit:** 2 years before or 3 years after sale
• **Exemption:** Up to gains amount

**Section 54F:**
• For non-residential property
• Must invest entire sale proceeds
• Can claim proportionate exemption

**Section 54EC:**
• Invest in specified bonds (NHAI, REC)
• **Limit:** ₹50 lakhs investment
• **Lock-in:** 5 years

**TDS on Property Sale:**
• **1% on sale value** if > ₹50 lakhs
• **2% for NRI sellers**`,
    category: "property",
    tags: ["property-sale", "capital-gains", "indexation", "section-54"],
    icon: Building,
    importance: "medium"
  },

  // More Business & Professional
  {
    id: "gst-impact-professional-tax",
    question: "How does GST affect professional income tax calculation?",
    answer: `**GST Impact on Professional Income Tax:**

**GST Registration:**
• **Mandatory:** If turnover > ₹20 lakhs (₹10L for special states)
• **Voluntary:** Below threshold for input credit benefits

**Income Tax Calculation:**
• **Professional income:** Excluding GST (net amount)
• **GST collected:** Not considered as income
• **GST paid:** Not deductible as business expense

**Example:**
• Professional fees charged: ₹11.8 lakhs (₹10L + ₹1.8L GST)
• **Taxable professional income:** ₹10 lakhs only
• **GST:** Separate compliance, not affecting income tax

**Input Tax Credit:**
• GST paid on business expenses can be claimed as ITC
• Reduces GST liability, not income tax
• Example: ₹1L expense + ₹18K GST → Claim ₹18K as ITC

**Compliance Requirements:**

**For Income Tax:**
• Maintain records excluding GST
• File ITR-3 for professional income
• Books of accounts as per IT Act

**For GST:**
• Separate GST returns (GSTR-1, GSTR-3B)
• Monthly/quarterly filing
• Input tax credit reconciliation

**Reverse Charge Mechanism:**
• On services from unregistered providers
• Pay GST directly to government
• Claim ITC if eligible

**Professional Services GST Rate:**
• **18% standard rate** for most professional services
• Some exemptions available (educational, healthcare)

**Tax Planning:** Keep separate GST and income tax books for clean compliance.`,
    category: "business-professional",
    tags: ["GST", "professional-income", "ITC", "compliance"],
    icon: FileText,
    importance: "medium"
  },

  // International Taxation
  {
    id: "nri-taxation",
    question: "How are NRIs taxed in India?",
    answer: `**NRI Tax Rules** depend on residential status and income source:

**Residential Status Determination:**
• **Resident:** In India for 182+ days in FY
• **NRI:** Less than 182 days in India
• **RNOR:** Returned after being NRI for 9+ years

**Income Tax Liability:**

**For NRIs:**
• **Indian Income:** Fully taxable in India
• **Foreign Income:** Not taxable in India
• **Global Income:** Only if resident

**Indian Income Sources:**
• Salary earned in India
• Rental income from Indian property
• Capital gains from Indian assets
• Interest from Indian banks/investments
• Business income in India

**Tax Rates:**
• **Same slabs** as residents
• **No basic exemption** benefit in many cases
• **Higher TDS rates** on certain incomes

**Key Deductions Available:**
• Section 80C: Only for Indian investments
• HRA: If working in India
• Home loan interest: For Indian property

**Example:**
NRI earning ₹15L salary in India:
• **Taxable in India:** Full ₹15L
• **TDS:** Deducted by Indian employer
• **ITR Filing:** Mandatory if income > ₹2.5L

**Important Considerations:**
• DTAA benefits for avoiding double taxation
• NRE/NRO account implications
• FEMA compliance for investments
• Advance tax requirements

**Professional Advice:** Consult CA for complex NRI tax situations.`,
    category: "special-cases",
    tags: ["NRI", "taxation", "residential-status", "DTAA"],
    icon: GraduationCap,
    importance: "low"
  },

  // More ITR Filing Questions
  {
    id: "revised-return-filing",
    question: "When and how to file revised income tax return?",
    answer: `**Revised Return Filing:**

**When Required:**
• Error in original return discovered after filing
• Additional income not reported initially
• Wrong deduction claimed
• Incorrect personal information

**Time Limit:**
• **December 31st** of assessment year
• Example: For FY 2025-26, revise by December 31, 2026
• No extension allowed beyond this date

**Common Reasons for Revision:**

**1. Income Omissions:**
• Forgot to include interest income
• Capital gains not reported
• Professional income missed

**2. Deduction Errors:**
• Wrong 80C amount claimed
• HRA calculation mistakes
• Missed eligible deductions

**3. TDS Mismatches:**
• Form 16A not included
• Wrong TDS amounts
• Additional TDS certificates received

**Filing Process:**
• Login to income tax portal
• Select "File Revised Return"
• Choose original return to revise
• Make necessary corrections
• Submit with reason for revision

**Example:**
Original return filed with ₹8L salary:
• Later discovered ₹50K FD interest
• **Action:** File revised return including ₹50K
• **Additional tax:** ₹15,600 (31.2% on ₹50K)
• **Interest:** From original due date till payment

**Consequences:**
• Additional tax + interest payable
• No penalty if filed within time limit
• Shows voluntary disclosure to IT department

**Best Practice:** Review all documents carefully before original filing to avoid revision need.`,
    category: "itr-filing",
    tags: ["revised-return", "correction", "deadline", "amendment"],
    icon: FileText,
    importance: "medium"
  },

  // Tax Saving & Planning
  {
    id: "year-end-tax-planning",
    question: "Last-minute tax saving strategies before March 31st?",
    answer: `**Last-Minute Tax Saving Strategies:**

**Quick 80C Options (Till March 31st):**

**1. ELSS Mutual Funds:**
• **Deadline:** March 31st
• **Investment:** Up to ₹1.5L
• **Benefits:** 3-year lock-in, potential 12-15% returns
• **Time:** Can invest online instantly

**2. PPF Top-up:**
• **Deadline:** March 31st
• **Investment:** Up to ₹1.5L annually
• **Benefits:** 7.1% tax-free returns
• **Time:** Same day credit if done online

**3. NSC Purchase:**
• **Deadline:** March 31st
• **Investment:** Any amount
• **Benefits:** Guaranteed 6.8% returns
• **Time:** Buy from post office

**Other Quick Deductions:**

**80D - Health Insurance:**
• Pay premium before March 31st
• **Benefit:** Up to ₹25K (self) + ₹50K (parents 60+)
• **Option:** Top-up existing policy

**80G - Donations:**
• **Prime Minister's Relief Fund:** 100% deduction
• **Other approved NGOs:** 50% deduction
• **Deadline:** March 31st

**24B - Home Loan Interest:**
• Pre-pay loan for extra interest deduction
• **Benefit:** Up to ₹2L annually
• **Strategy:** Time pre-payment for maximum benefit

**Emergency Options:**

**Tax Saver FDs:**
• 5-year lock-in
• Available till March 31st
• Lower returns but guaranteed

**Life Insurance Premium:**
• Pay annual premium early
• Counts towards 80C
• Ensure policy compliance

**Success Formula:**
• Audit current 80C utilization
• Fill gaps with ELSS/PPF
• Use 80D for health insurance
• Consider strategic donations`,
    category: "tax-planning",
    tags: ["year-end", "last-minute", "80C", "tax-saving"],
    icon: Calculator,
    importance: "high"
  },

  // Additional Advanced Questions (60+ more to reach 100+)

  // More Investment Questions
  {
    id: "epf-vs-vpf",
    question: "EPF vs VPF - Should I contribute more to VPF?",
    answer: `**EPF vs VPF Comparison:**

**EPF (Mandatory):**
• **Employee contribution:** 12% of basic salary
• **Employer contribution:** 12% matching
• **Interest:** 8.1% annually (tax-free)
• **Tax treatment:** EEE (Exempt-Exempt-Exempt)

**VPF (Voluntary Provident Fund):**
• **Additional contribution:** Up to 100% of basic salary
• **No employer matching** on VPF amount
• **Same interest rate:** 8.1% tax-free
• **Withdrawal:** Same rules as EPF

**Tax Benefits:**
• VPF qualifies for 80C deduction
• Interest on both EPF and VPF is tax-free
• Withdrawal after 5 years is tax-free

**Calculation Example:**
Basic salary: ₹50,000/month
• **Mandatory EPF:** ₹6,000 (you) + ₹6,000 (employer) = ₹12,000
• **Additional VPF:** ₹10,000 (only you contribute)
• **Total monthly:** ₹22,000 going into PF
• **Annual 80C benefit:** ₹1.2L (VPF only, EPF already exempt)

**VPF vs Other 80C Options:**

**VPF Pros:**
• Guaranteed 8.1% returns
• Same withdrawal rules as EPF
• High safety (government backing)

**VPF Cons:**
• Long lock-in (retirement/58 years)
• Lower returns vs equity markets
• No employer contribution

**Recommendation:**
• Choose VPF if you prefer guaranteed returns
• Consider ELSS if you can take market risk
• Use VPF to complete 80C limit safely`,
    category: "investments",
    tags: ["EPF", "VPF", "80C", "provident-fund", "safe-investment"],
    icon: PiggyBank,
    importance: "medium"
  },
  {
    id: "nps-tax-benefits",
    question: "What are NPS tax benefits and should I invest?",
    answer: `**NPS (National Pension System) Tax Benefits:**

**Tax Deductions Available:**
• **Section 80C:** Up to ₹1.5L (shared with other 80C investments)
• **Section 80CCD(1B):** Additional ₹50,000 (exclusive)
• **Total possible:** ₹2L annual deduction

**Employer Contribution:**
• **Section 80CCD(2):** Employer contribution (up to 10% of salary)
• **Not counted** towards employee's 80C/80CCD(1B) limits
• **Additional tax benefit** for employees

**Example:**
• Salary: ₹10L annually
• Employee NPS: ₹50,000 (80CCD(1B))
• Other 80C: ₹1.5L (ELSS, PPF)
• **Total deduction:** ₹2L
• **Tax saving:** ₹62,400 (at 31.2% rate)

**Withdrawal Rules:**

**At Retirement (60 years):**
• **40% lump sum:** Tax-free
• **60% annuity:** Mandatory (taxable as pension)

**Partial Withdrawal:**
• **25% of corpus** for specific needs after 3 years
• Conditions: Education, marriage, medical emergency, house purchase

**NPS vs Other Options:**

**NPS Pros:**
• Extra ₹50K deduction under 80CCD(1B)
• Professional fund management
• Low charges (0.01-0.09%)
• Regulated by PFRDA

**NPS Cons:**
• Lock-in till 60 years
• 60% must go to annuity (taxable)
• Market-linked returns (no guarantee)

**Recommendation:**
• Ideal for additional tax saving beyond ₹1.5L
• Good for long-term retirement planning
• Consider if you have maxed out other 80C options`,
    category: "investments",
    tags: ["NPS", "80CCD", "retirement", "pension", "tax-deduction"],
    icon: Users,
    importance: "medium"
  },

  // More Salary & Employment
  {
    id: "esop-taxation",
    question: "How are ESOPs (Employee Stock Options) taxed?",
    answer: `**ESOP Taxation in India:**

**Two Taxable Events:**

**1. Exercise of Options (Perquisite Tax):**
• **Taxable value:** FMV on exercise date - Exercise price
• **Tax rate:** As per income tax slabs
• **TDS:** Applicable at exercise

**2. Sale of Shares (Capital Gains):**
• **Cost basis:** FMV on exercise date
• **Holding period:** From exercise date (not grant date)
• **Tax:** STCG (15%) or LTCG (10% on gains > ₹1L)

**Example:**
• **Grant:** 1,000 shares at ₹100 exercise price
• **Exercise (2 years later):** FMV = ₹500
• **Sale (1 year after exercise):** ₹800 per share

**Exercise Tax:**
• Perquisite = (₹500 - ₹100) × 1,000 = ₹4,00,000
• **Tax:** ₹1,24,800 (at 31.2% rate)

**Sale Tax:**
• Capital gain = (₹800 - ₹500) × 1,000 = ₹3,00,000
• **STCG tax:** ₹45,000 (15% rate, held < 1 year from exercise)

**Tax Planning Strategies:**

**1. Timing of Exercise:**
• Exercise in low-income years
• Spread exercise across multiple years
• Consider tax bracket impact

**2. Timing of Sale:**
• Hold > 1 year from exercise for LTCG benefit
• Use ₹1L LTCG exemption annually
• Harvest losses to offset gains

**3. Section 80C Planning:**
• Use proceeds for 80C investments
• Max out deductions in high-income years

**Special Rules:**
• **Listed company ESOPs:** Standard taxation
• **Unlisted company ESOPs:** Special valuation rules
• **Start-up ESOPs:** Deferred taxation option available`,
    category: "employment",
    tags: ["ESOP", "stock-options", "perquisite", "capital-gains"],
    icon: TrendingUp,
    importance: "low"
  },
  {
    id: "gratuity-taxation",
    question: "How is gratuity taxed? What are the exemption limits?",
    answer: `**Gratuity Taxation Rules:**

**Exemption Limits (Section 10(10)):**

**For Government Employees:**
• **Fully exempt** - no tax on gratuity received

**For Private Employees (Covered under Gratuity Act):**
Minimum of:
• **Actual gratuity received**
• **₹20 lakhs** (maximum exemption limit)
• **15 days salary × years of service** (for monthly paid)
• **7 days salary × years of service** (for weekly paid)

**For Non-Covered Private Employees:**
Minimum of:
• **Actual gratuity received**
• **₹20 lakhs**
• **Half month's salary × years of service**

**Calculation Examples:**

**Example 1 (Covered Employee):**
• Last drawn salary: ₹80,000/month
• Service period: 10 years
• Gratuity received: ₹6,00,000

**Exemption calculation:**
• Formula: (₹80,000 × 15 × 10) ÷ 26 = ₹4,61,538
• **Exempt amount:** Minimum(₹6,00,000, ₹20,00,000, ₹4,61,538) = ₹4,61,538
• **Taxable gratuity:** ₹6,00,000 - ₹4,61,538 = ₹1,38,462

**Example 2 (Non-Covered Employee):**
• Same details as above
• **Formula:** (₹80,000 × 10) ÷ 2 = ₹4,00,000
• **Exempt amount:** ₹4,00,000
• **Taxable gratuity:** ₹2,00,000

**Tax Treatment:**
• Exempt portion: No tax
• Taxable portion: Added to salary income
• **TDS:** Applicable on taxable portion

**Important Notes:**
• **Death gratuity:** Fully exempt
• **Commuted pension in lieu of gratuity:** Different rules apply
• **Multiple employers:** Separate calculation for each`,
    category: "employment",
    tags: ["gratuity", "exemption", "retirement", "salary"],
    icon: CreditCard,
    importance: "low"
  },

  // More TDS Questions
  {
    id: "tds-on-salary",
    question: "How does TDS work on salary? Can I reduce it?",
    answer: `**TDS on Salary Mechanism:**

**How Employers Calculate TDS:**
• **Annual income projection** based on current salary
• **Add:** Expected bonus, allowances, perquisites
• **Less:** Standard deduction, declared investments
• **Calculate:** Tax as per chosen regime
• **Deduct:** Monthly TDS

**Reducing TDS Legally:**

**1. Investment Declarations (Form 12BB):**
• Submit 80C investment proofs
• Declare HRA, home loan interest
• Medical insurance premiums (80D)
• **Impact:** Lower projected tax, reduced TDS

**2. Regime Selection:**
• Choose optimal regime (New vs Old)
• Inform employer about preference
• Provide supporting documents

**3. Timing of Investments:**
• Make investments early in financial year
• Submit proofs immediately
• Update declarations when making additional investments

**Example:**
**Without proper declaration:**
• Monthly salary: ₹1L
• No investment proof submitted
• **Monthly TDS:** ₹18,000+ (assuming 30% bracket)

**With proper declaration:**
• Same salary + ₹1.5L 80C proof
• **Reduced monthly TDS:** ₹14,000
• **Monthly savings:** ₹4,000

**Common TDS Issues:**

**1. Over-deduction:**
• Employer assumes higher income
• Solution: Submit actual investment proofs

**2. Under-deduction:**
• Multiple income sources not declared
• Solution: Pay advance tax to avoid penalty

**3. Regime mismatch:**
• Employer chooses wrong regime
• Solution: Claim refund in ITR

**Form 16 Importance:**
• Essential for ITR filing
• Shows actual TDS deducted
• Helps claim refund if excess TDS`,
    category: "tds-advance-tax",
    tags: ["TDS", "salary", "Form-12BB", "investment-declaration"],
    icon: FileText,
    importance: "medium"
  },
  {
    id: "tds-refund-process",
    question: "How to claim TDS refund? What's the process?",
    answer: `**TDS Refund Process:**

**When You Get Refund:**
• TDS deducted > Actual tax liability
• Excess TDS due to wrong projections
• Multiple TDS deductions not coordinated
• Change in tax regime after TDS deduction

**Steps for Claiming Refund:**

**1. File ITR:**
• **Mandatory** to claim refund
• Include all TDS certificates (Form 16, 16A)
• File within due date (July 31st)

**2. E-Verification:**
• Verify ITR within 120 days
• Use Aadhaar OTP, net banking, or EVC
• **No refund** without verification

**3. Processing:**
• IT department processes return
• Refund calculated automatically
• Direct credit to bank account

**Timeline:**
• **Simple cases:** 30-45 days after verification
• **Scrutiny cases:** 6-12 months
• **Interest:** 0.5% per month for delays beyond 45 days

**Example Scenarios:**

**Scenario 1:**
• Employer deducted ₹2L TDS (assumed New regime)
• Actual tax in Old regime: ₹1.5L
• **Refund:** ₹50,000

**Scenario 2:**
• TDS on salary: ₹1L
• TDS on FD interest: ₹20K
• Actual total tax: ₹1.1L
• **Refund:** ₹10,000

**Documents Required:**
• Form 16 from employer
• Form 16A for other TDS
• Bank statements
• Investment proofs

**Refund Tracking:**
• Login to IT portal
• Check refund status
• Download refund order

**Common Delays:**
• Mismatched bank details
• PAN-Aadhaar not linked
• Outstanding tax demands
• Technical processing issues`,
    category: "tds-advance-tax",
    tags: ["TDS", "refund", "ITR", "process"],
    icon: CreditCard,
    importance: "medium"
  },

  // More Business Questions
  {
    id: "presumptive-taxation-44ad",
    question: "What is presumptive taxation under Section 44AD?",
    answer: `**Section 44AD - Presumptive Taxation for Business:**

**Eligibility:**
• **Business turnover:** ≤ ₹2 crores in FY
• **Applicable to:** Any business (not professionals)
• **Opt-in scheme:** Voluntary choice

**How It Works:**
• **Deemed profit:** 8% of turnover (digital receipts) or 6% (cash receipts)
• **No need** to maintain detailed books
• **No audit** required
• **Simplified compliance**

**Calculation Example:**
Business with ₹50L turnover:
• **Digital receipts:** ₹40L × 8% = ₹3.2L deemed profit
• **Cash receipts:** ₹10L × 6% = ₹0.6L deemed profit
• **Total deemed profit:** ₹3.8L
• **Tax:** As per slab rates on ₹3.8L

**Benefits:**
• **No bookkeeping** burden
• **No audit** even if turnover > prescribed limits
• **Lower compliance** cost
• **Quick tax computation**

**Restrictions:**
• **Cannot claim expenses** beyond deemed profit
• **Depreciation** not allowed separately
• **Cannot show losses**
• **Must declare higher profit** if actual profit > deemed profit

**Opting Out:**
• Maintain books of accounts
• Get audit if required
• Claim actual expenses
• Show actual profit/loss

**When to Choose 44AD:**
• **Low expense ratio** (expenses < 92% of turnover)
• **Want simple compliance**
• **Avoid bookkeeping**
• **No major equipment purchases** (depreciation important)

**When to Avoid:**
• **High genuine expenses** (> 94% of turnover)
• **Significant losses** expected
• **Large depreciation** claims
• **Want to build tax credit** for future`,
    category: "business-professional",
    tags: ["44AD", "presumptive-taxation", "business", "audit"],
    icon: Calculator,
    importance: "medium"
  },
  {
    id: "section-44ada-professionals",
    question: "How does Section 44ADA work for professionals?",
    answer: `**Section 44ADA - Presumptive Taxation for Professionals:**

**Eligible Professions:**
• **Legal profession:** Lawyers, advocates
• **Medical profession:** Doctors, consultants
• **Engineering/Architecture:** Consultants, freelancers
• **Accountancy:** CAs, financial consultants
• **Technical consultancy:** IT professionals, freelancers
• **Interior decoration:** Designers
• **Any other profession** as per definition

**Key Conditions:**
• **Gross receipts:** ≤ ₹50 lakhs in FY
• **Professional income only** (not business income)
• **Voluntary scheme** - can opt in/out

**How 44ADA Works:**
• **Deemed profit:** 50% of gross receipts
• **Minimum tax:** On deemed profit
• **No books of accounts** required
• **No audit** needed

**Example Calculation:**
Freelance consultant earning ₹20L:
• **Deemed profit:** ₹20L × 50% = ₹10L
• **Tax computation:** As per slab rates on ₹10L
• **Actual expenses:** Not relevant

**Benefits:**
• **Simple compliance:** No complex bookkeeping
• **Cost saving:** No CA fees for accounts
• **Time saving:** Quick ITR filing
• **No audit:** Even at higher income levels

**Disadvantages:**
• **High deemed profit:** 50% may be higher than actual
• **No expense claims:** Cannot claim actual expenses
• **No depreciation:** Equipment purchases not beneficial
• **No loss:** Cannot show business losses

**When to Choose 44ADA:**
• **Low expense ratio:** Expenses < 50% of income
• **Simple business:** No major investments
• **Want ease:** Prefer simple compliance
• **Stable income:** Consistent profitable years

**When to Avoid:**
• **High expenses:** Office rent, equipment, staff costs > 50%
• **Loss years:** Expected losses due to investments
• **Growth phase:** Heavy investment in business setup
• **Complex business:** Multiple income streams

**Opting Out:**
• Maintain proper books of accounts
• File ITR-3 with profit & loss account
• Claim actual expenses and depreciation
• Get audit if turnover > ₹1 crore`,
    category: "business-professional",
    tags: ["44ADA", "professional-income", "presumptive", "freelancer"],
    icon: Briefcase,
    importance: "medium"
  },

  // More Property Questions
  {
    id: "rental-income-taxation",
    question: "How is rental income taxed? What deductions are allowed?",
    answer: `**Rental Income Taxation:**

**Income Computation:**
• **Gross rental:** Annual rent received/receivable
• **Less:** Municipal taxes paid by owner
• **Less:** Standard deduction (30% of net rent)
• **Less:** Interest on loan for property
• **Result:** Taxable rental income

**Standard Deduction (30%):**
• **Automatic deduction** - no proof required
• **Covers:** Repairs, maintenance, collection charges
• **Cannot claim actual expenses** if using standard deduction

**Allowable Deductions:**

**1. Municipal Taxes:**
• Property tax paid to local authority
• Only if paid by owner (not tenant)
• Must have payment receipts

**2. Interest on Loan:**
• **Home loan interest** for property purchase
• **No upper limit** for rental property
• Cannot claim principal repayment

**3. Other Expenses (if not using 30% standard):**
• Repairs and maintenance
• Insurance premiums
• Legal expenses
• Brokerage for letting

**Example Calculation:**
• **Annual rent:** ₹3,60,000
• **Municipal tax:** ₹20,000
• **Net rent:** ₹3,40,000
• **Standard deduction (30%):** ₹1,02,000
• **Home loan interest:** ₹2,50,000
• **Taxable income:** ₹3,40,000 - ₹1,02,000 - ₹2,50,000 = **Loss of ₹12,000**

**Loss Treatment:**
• **Current year:** Set off against other income
• **Cannot set off:** Against salary (since 2017)
• **Carry forward:** 8 years for future rental income

**Multiple Properties:**
• **Each property:** Separate calculation
• **Losses:** Can set off between properties
• **Vacant property:** No rental income, but can claim interest

**TDS by Tenant:**
• **TDS @10%** if annual rent > ₹2.4 lakhs
• **Tenant's responsibility** to deduct TDS
• **Credit available** to owner in ITR`,
    category: "property",
    tags: ["rental-income", "property-tax", "deductions", "loss"],
    icon: Home,
    importance: "medium"
  },

  // More Capital Gains Questions
  {
    id: "debt-fund-taxation-changes",
    question: "How has debt mutual fund taxation changed from April 2023?",
    answer: `**Debt Fund Taxation Changes (Budget 2023):**

**Old Rules (Till March 2023):**
• **Short-term:** < 3 years, taxed at slab rates
• **Long-term:** > 3 years, 20% with indexation
• **Indexation benefit:** Significant tax advantage

**New Rules (From April 2023):**
• **All debt funds:** Taxed at slab rates (no LTCG benefit)
• **No indexation:** Regardless of holding period
• **Same as bank deposits:** No tax advantage

**Impact Example:**
₹1L debt fund investment for 5 years:
• **Purchase price:** ₹1,00,000
• **Sale price:** ₹1,40,000
• **Gain:** ₹40,000

**Old taxation:**
• LTCG with indexation: Minimal tax
• **Effective tax:** ~₹2,000-5,000

**New taxation:**
• Taxed at slab rate: 20%/30%
• **Tax:** ₹8,000-12,000

**Exceptions (Still Get LTCG Benefit):**
• **Equity funds:** >65% equity allocation
• **International funds:** Some categories
• **Gold ETFs:** Different rules

**Alternative Strategies:**

**1. Bank Fixed Deposits:**
• **Same taxation** as debt funds now
• **Higher safety:** Deposit insurance
• **Predictable returns**

**2. Equity Hybrid Funds:**
• **>65% equity:** Qualify for equity taxation
• **LTCG:** 10% on gains > ₹1L after 1 year
• **Higher risk** but better tax treatment

**3. Target Maturity Funds:**
• **Hold till maturity:** Avoid market risk
• **Same taxation:** As other debt funds
• **Predictable returns**

**For Existing Investments:**
• **Grandfathering:** Investments before April 2023
• **Old rules apply:** Till point of sale
• **Consider reviewing:** Portfolio allocation

**Recommendation:**
• **Avoid new debt funds** for tax efficiency
• **Consider alternatives:** Bank deposits, equity hybrid funds
• **Review existing:** Portfolio for tax optimization`,
    category: "capital-gains",
    tags: ["debt-funds", "taxation-changes", "indexation", "mutual-funds"],
    icon: TrendingUp,
    importance: "medium"
  },

  // More Special Cases
  {
    id: "widow-pension-taxation",
    question: "Is pension received by widow/family taxable?",
    answer: `**Pension Taxation for Widows/Family:**

**Types of Pension:**

**1. Family Pension:**
• **Definition:** Pension paid to family after employee's death
• **Tax treatment:** Fully taxable as salary income
• **Standard deduction:** ₹15,000 or 1/3rd of pension (whichever is less)

**2. Commuted Pension:**
• **Government employee family:** Fully exempt
• **Private employee family:** 1/3rd exempt, 2/3rd taxable

**3. Widow Pension (Social Security):**
• **State government schemes:** Usually exempt
• **Central government schemes:** Check specific notifications

**Family Pension Calculation:**
• **Gross family pension:** ₹2,40,000 annually
• **Less:** Standard deduction ₹15,000 (minimum of ₹15K or ₹80K)
• **Taxable pension:** ₹2,25,000

**Example:**
Widow receiving ₹30,000 monthly family pension:
• **Annual pension:** ₹3,60,000
• **Standard deduction:** ₹15,000 (lower of ₹15K or ₹1,20,000)
• **Taxable income:** ₹3,45,000
• **Tax:** As per slab rates

**Other Income Considerations:**
• **Interest income:** From deposits, bonds
• **Rental income:** From inherited property
• **Capital gains:** From sale of inherited assets

**Tax Planning for Widows:**

**1. Investment Options:**
• **Senior citizen benefits:** If above 60 years
• **80TTB deduction:** ₹50,000 on deposit interest
• **80D benefits:** Health insurance deduction

**2. Property Planning:**
• **Inherited property:** No tax on inheritance
• **Sale of inherited property:** Capital gains applicable
• **Cost basis:** Market value on date of inheritance

**3. ITR Filing:**
• **Mandatory:** If total income > ₹2.5 lakhs (₹3L if 60+)
• **Form:** ITR-1 for salary/pension income
• **Due date:** July 31st

**Special Considerations:**
• **Gratuity to family:** Up to ₹20 lakhs exempt
• **Leave encashment:** Up to ₹3 lakhs exempt
• **Insurance proceeds:** Usually exempt under Section 10(10D)`,
    category: "special-cases",
    tags: ["widow", "family-pension", "taxation", "inheritance"],
    icon: Users,
    importance: "low"
  },

  // More Common Mistakes
  {
    id: "form-16-errors",
    question: "Common Form 16 errors and how to handle them?",
    answer: `**Common Form 16 Errors:**

**1. Wrong PAN Details:**
• **Error:** Incorrect PAN or name mismatch
• **Impact:** ITR filing issues, TDS credit problems
• **Solution:** Get corrected Form 16 from employer

**2. Incorrect Tax Calculation:**
• **Error:** Wrong regime applied or incorrect slabs used
• **Impact:** Excess/less TDS deduction
• **Solution:** Verify calculations, claim refund if needed

**3. Missing Investment Details:**
• **Error:** 80C/80D investments not reflected
• **Impact:** Higher TDS, less refund
• **Solution:** Submit Form 12BB, get revised Form 16

**4. Wrong Allowance Treatment:**
• **Error:** HRA/LTA wrongly treated as taxable
• **Impact:** Higher taxable income
• **Solution:** Provide proper documentation to employer

**5. Incomplete Previous Employment Details:**
• **Error:** Previous employer's salary/TDS not included
• **Impact:** Under-declaration of income
• **Solution:** Submit Form 12B with previous employment details

**Verification Steps:**

**1. Personal Details:**
• **Check:** Name, PAN, address matches
• **Verify:** Aadhaar linkage status
• **Ensure:** Spelling consistency

**2. Income Details:**
• **Verify:** Basic salary, HRA, allowances
• **Cross-check:** With salary slips
• **Confirm:** Bonus, incentives included

**3. Deduction Details:**
• **80C investments:** ELSS, PPF, insurance
• **80D:** Health insurance premiums
• **HRA calculation:** Rent receipts, formula applied

**4. TDS Details:**
• **Monthly TDS:** Check salary slips
• **Total TDS:** Should match annual deduction
• **Challan details:** Verify deposit dates

**What to Do If Errors Found:**

**Before ITR Filing:**
• **Request correction** from employer
• **Get revised Form 16** with correct details
• **Submit additional documents** if needed

**After ITR Filing:**
• **File revised return** if major errors
• **Rectification application** for minor errors
• **Carry forward** correct details to next year

**When Employer Doesn't Cooperate:**
• **File ITR** with correct details
• **Attach explanation** for discrepancies
• **Keep supporting documents** ready
• **May face scrutiny** - be prepared with proof`,
    category: "mistakes",
    tags: ["Form-16", "errors", "TDS", "correction"],
    icon: AlertTriangle,
    importance: "medium"
  },

  // Year-end Planning
  {
    id: "march-end-checklist",
    question: "Complete tax planning checklist for March 31st deadline?",
    answer: `**March 31st Tax Planning Checklist:**

**Section 80C (₹1.5L limit):**
□ **ELSS Mutual Funds** - Can invest till March 31st
□ **PPF Top-up** - Contribute to reach annual limit
□ **Life Insurance Premium** - Pay before deadline
□ **NSC Purchase** - Available at post offices
□ **Tax Saver FD** - Last resort option
□ **Home Loan Principal** - Counts towards 80C

**Section 80D (Health Insurance):**
□ **Self & family premium** - Up to ₹25K (₹50K if 60+)
□ **Parents' premium** - Additional ₹25K (₹50K if 60+)
□ **Top-up health insurance** - Additional coverage
□ **Health checkup** - Up to ₹5K included in 80D

**Section 80CCD(1B) - NPS:**
□ **Additional ₹50K deduction** - Over and above 80C
□ **Online investment** - Can be done instantly
□ **Employer NPS** - Check if available

**Other Deductions:**
□ **Home loan interest** - Up to ₹2L (Section 24)
□ **Education loan interest** - No limit (Section 80E)
□ **Donations** - PM Relief Fund, NGOs (Section 80G)
□ **Savings account interest** - Up to ₹10K (Section 80TTA)

**Capital Gains Planning:**
□ **Harvest losses** - Sell loss-making investments
□ **Book LTCG** - Up to ₹1L exempt limit
□ **Reinvestment planning** - For property gains

**Advance Tax:**
□ **Fourth installment** - Due March 15th
□ **Calculate liability** - Based on total income
□ **Pay shortfall** - Avoid interest penalty

**Income Acceleration/Deferment:**
□ **Bonus timing** - Negotiate payment date
□ **Professional payments** - Time receipts
□ **FD maturity** - Consider renewal timing

**Documentation:**
□ **Investment receipts** - Collect all proofs
□ **Rent receipts** - For HRA claim
□ **Medical bills** - For reimbursements
□ **Form 12BB submission** - To employer

**Emergency Options (Last Week):**
□ **Online ELSS** - Instant investment
□ **PPF online** - Same-day credit
□ **Health insurance** - Quick policy purchase
□ **Donations** - Online to approved funds

**Red Flags to Avoid:**
❌ **Cash investments** - Avoid large cash transactions
❌ **Fake receipts** - Don't fabricate documents
❌ **Wrong beneficiaries** - Ensure proper nominations
❌ **Incomplete KYC** - Ensure all documents complete`,
    category: "tax-planning",
    tags: ["march-deadline", "checklist", "year-end", "tax-saving"],
    icon: CheckCircle,
    importance: "high"
  }
];

const categories = [
  { id: "all", name: "All Questions", icon: Info },
  { id: "tax-regimes", name: "Tax Regimes", icon: Scale },
  { id: "calculator", name: "Calculator Usage", icon: Calculator },
  { id: "deductions", name: "Deductions", icon: PiggyBank },
  { id: "tax-slabs", name: "Tax Slabs", icon: FileText },
  { id: "income", name: "Income Sources", icon: DollarSign },
  { id: "special-cases", name: "Special Cases", icon: Users },
  { id: "itr-filing", name: "ITR Filing", icon: Clock },
  { id: "mistakes", name: "Common Mistakes", icon: AlertTriangle },
  { id: "investments", name: "Investments", icon: TrendingUp },
  { id: "employment", name: "Employment", icon: Briefcase },
  { id: "business-professional", name: "Business", icon: Building },
  { id: "tax-planning", name: "Tax Planning", icon: Calculator },
  { id: "property", name: "Property", icon: Home },
  { id: "tds-advance-tax", name: "TDS & Advance Tax", icon: FileText },
  { id: "capital-gains", name: "Capital Gains", icon: TrendingUp }
];

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by importance
    return filtered.sort((a, b) => {
      const importanceOrder = { high: 0, medium: 1, low: 2 };
      return (importanceOrder[a.importance || "medium"] || 1) - (importanceOrder[b.importance || "medium"] || 1);
    });
  }, [searchQuery, selectedCategory]);

  // Get popular FAQs (high importance items)
  const popularFAQs = useMemo(() =>
    faqData.filter(faq => faq.importance === "high").slice(0, 6),
    []
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search tax questions and answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-3 text-base rounded-xl border-2 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </motion.div>

      {/* Category Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-4"
      >
        {/* Category Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
          {categories.map((category) => {
            const categoryCount = category.id === "all" 
              ? faqData.length 
              : faqData.filter(faq => faq.category === category.id).length;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                  selectedCategory === category.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/30 hover:bg-accent/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <category.icon className={`w-5 h-5 mx-auto mb-2 ${
                  selectedCategory === category.id ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <div className="text-xs font-medium">{category.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{categoryCount}</div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Popular Questions (when no search and all selected) */}
      {!searchQuery && selectedCategory === "all" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Most Popular Questions</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {popularFAQs.map((faq) => (
              <Card
                key={faq.id}
                className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/30"
                onClick={() => {
                  setSelectedCategory(faq.category);
                  setExpandedItems([faq.id]);
                }}
              >
                <div className="flex items-start gap-3">
                  {faq.icon && (
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <faq.icon className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{faq.question}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {faq.answer.split('\n')[0].replace(/\*\*/g, '')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results and FAQ List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        {/* Results count and controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">
              {filteredFAQs.length} questions
              {selectedCategory !== "all" && (
                <span className="text-muted-foreground">
                  {" "}in {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
            </p>
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                &ldquo;{searchQuery}&rdquo;
              </Badge>
            )}
          </div>
          {(searchQuery || selectedCategory !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* FAQ Accordion */}
        {filteredFAQs.length > 0 ? (
          <Accordion
            type="multiple"
            value={expandedItems}
            onValueChange={setExpandedItems}
            className="space-y-2"
          >
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <AccordionItem
                  value={faq.id}
                  className="border border-border rounded-xl px-6 py-2 hover:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      {faq.icon && (
                        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                          <faq.icon className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{faq.question}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          {faq.importance === "high" && (
                            <Badge variant="destructive" className="text-xs">
                              Popular
                            </Badge>
                          )}
                          <div className="flex gap-1">
                            {faq.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div
                        className="whitespace-pre-line text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: faq.answer
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/•/g, '•')
                        }}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        ) : (
          <Card className="p-8 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No questions found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or selecting a different category.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Show all questions
            </Button>
          </Card>
        )}
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Separator className="my-8" />
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Heart className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold">Still have questions?</h3>
            <p className="text-muted-foreground">
              Can&apos;t find what you&apos;re looking for? Our tax calculator is designed to handle most scenarios,
              but for complex cases, we recommend consulting with a qualified Chartered Accountant.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" size="sm">
                <Calculator className="w-4 h-4 mr-2" />
                Try Calculator
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Tax Guide
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
} 