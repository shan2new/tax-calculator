"use client";

import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  PiggyBank, 
  Heart, 
  Home, 
  Calculator, 
  Sparkles,
  Users,
  Target,
  TrendingUp,
  LucideIcon,
  GraduationCap,
  Banknote,
  HelpCircle,
  Check
} from "lucide-react";
import { formatIndianNumber, parseIndianNumber } from "@/lib/formatters";
import { OldTaxRegimeInputs } from "./OldTaxRegimeForm";
import { cn } from "@/lib/utils";

interface SmartDeductionsWizardProps {
  deductions: OldTaxRegimeInputs;
  onDeductionsChange: (deductions: OldTaxRegimeInputs) => void;
  grossIncome: number;
}

type SetupMode = 'quick-select' | 'guided';
type WizardStep = 'profile' | 'investments' | 'housing' | 'health' | 'others' | 'summary';

interface UserProfile {
  type: 'simple' | 'investor' | 'renter' | 'homeowner';
  ageGroup: '20-25' | '25-30' | '30-35' | '35+';
  city: 'metro' | 'non-metro';
}

// Shadcn-style Checkbox component
const Checkbox = ({ 
  checked, 
  onCheckedChange, 
  className, 
  children,
  ...props 
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  children?: React.ReactNode;
} & React.ComponentProps<"button">) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "flex items-center space-x-2 text-sm cursor-pointer hover:bg-accent/50 rounded-md p-2 transition-colors",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-4 w-4 rounded border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary text-primary-foreground" : "bg-background"
        )}
      >
        {checked && (
          <Check className="h-3 w-3 m-0.5" />
        )}
      </div>
      {children}
    </button>
  );
};

// Enhanced selection button component
const SelectionButton = ({ 
  selected, 
  onSelect, 
  children, 
  className,
  ...props 
}: {
  selected?: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<"button">) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left p-3 rounded-lg border-2 transition-all hover:bg-accent/50",
        selected 
          ? "border-primary bg-primary/5 text-primary" 
          : "border-border hover:border-primary/50",
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <div className={cn(
          "w-4 h-4 rounded-full border-2 flex items-center justify-center",
          selected ? "border-primary bg-primary" : "border-muted-foreground"
        )}>
          {selected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
        </div>
        <span className="text-sm">{children}</span>
      </div>
    </button>
  );
};

const SMART_DEFAULTS = {
  simple: {
    section80C: 75000,
    section80D: 15000,
    hraReceived: 0,
    rentPaid: 0,
    isMetroCity: false,
    homeLoanInterest: 0,
    section80E: 0,
    section80G: 0,
    section80EE: 0,
    section80EEA: 0,
    section80TTA: 5000
  },
  investor: {
    section80C: 150000,
    section80D: 25000,
    hraReceived: 0,
    rentPaid: 0,
    isMetroCity: false,
    homeLoanInterest: 0,
    section80E: 0,
    section80G: 10000,
    section80EE: 0,
    section80EEA: 0,
    section80TTA: 10000
  },
  renter: {
    section80C: 120000,
    section80D: 25000,
    hraReceived: 240000,
    rentPaid: 360000,
    isMetroCity: true,
    homeLoanInterest: 0,
    section80E: 0,
    section80G: 5000,
    section80EE: 0,
    section80EEA: 0,
    section80TTA: 8000
  },
  homeowner: {
    section80C: 150000,
    section80D: 25000,
    hraReceived: 0,
    rentPaid: 0,
    isMetroCity: false,
    homeLoanInterest: 200000,
    section80E: 0,
    section80G: 10000,
    section80EE: 50000,
    section80EEA: 0,
    section80TTA: 10000
  }
};

export function SmartDeductionsWizard({ deductions, onDeductionsChange, grossIncome }: SmartDeductionsWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('profile');
  const [setupMode, setSetupMode] = useState<SetupMode>('quick-select');
  const [tempDeductions, setTempDeductions] = useState<OldTaxRegimeInputs>(deductions);
  const [selectedAge, setSelectedAge] = useState<string>('25-30');
  const [selectedCity, setSelectedCity] = useState<string>('metro');

  const steps: { id: WizardStep; label: string; icon: LucideIcon }[] = useMemo(() => [
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'investments', label: 'Investments', icon: PiggyBank },
    { id: 'housing', label: 'Housing', icon: Home },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'others', label: 'Others', icon: Banknote },
    { id: 'summary', label: 'Summary', icon: CheckCircle2 }
  ], []);

  const currentStepIndex = useMemo(() => 
    steps.findIndex(step => step.id === currentStep), 
    [steps, currentStep]
  );
  
  const progress = useMemo(() => 
    ((currentStepIndex + 1) / steps.length) * 100, 
    [currentStepIndex, steps.length]
  );

  const getIncomeBasedSuggestions = useCallback((income: number) => {
    if (income <= 500000) return { section80C: 50000, section80D: 15000 };
    if (income <= 1000000) return { section80C: 100000, section80D: 20000 };
    if (income <= 1500000) return { section80C: 150000, section80D: 25000 };
    return { section80C: 150000, section80D: 25000 };
  }, []);

  const calculateTaxSavings = useCallback((deductions: OldTaxRegimeInputs) => {
    const rate = grossIncome > 1000000 ? 0.312 : grossIncome > 500000 ? 0.208 : 0.052;
    const total80C = Math.min(deductions.section80C, 150000);
    const total80D = Math.min(deductions.section80D, 25000);
    const hraExemption = calculateHRAExemption(deductions);
    const homeLoan = Math.min(deductions.homeLoanInterest, 200000);
    const others = deductions.section80E + Math.min(deductions.section80G, 10000) + Math.min(deductions.section80TTA, 10000);
    
    return Math.round((total80C + total80D + hraExemption + homeLoan + others) * rate);
  }, [grossIncome]);

  const calculateHRAExemption = useCallback((deductions: OldTaxRegimeInputs) => {
    if (deductions.hraReceived === 0 || deductions.rentPaid === 0) return 0;
    const hraPercent = deductions.isMetroCity ? 0.5 : 0.4;
    const exemptionOptions = [
      deductions.hraReceived,
      grossIncome * hraPercent,
      Math.max(0, deductions.rentPaid - (grossIncome * 0.1))
    ];
    return Math.min(...exemptionOptions);
  }, [grossIncome]);

  const handleQuickSelect = useCallback((profileType: UserProfile['type']) => {
    const defaults = SMART_DEFAULTS[profileType];
    setTempDeductions(defaults);
    setCurrentStep('summary');
  }, []);

  const handleGuidedSetup = useCallback(() => {
    setSetupMode('guided');
    setCurrentStep('profile');
  }, []);

  const goToStep = useCallback((stepId: WizardStep) => {
    setCurrentStep(stepId);
  }, []);

  const nextStep = useCallback(() => {
    const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
    setCurrentStep(steps[nextIndex].id);
  }, [currentStepIndex, steps]);

  const prevStep = useCallback(() => {
    const prevIndex = Math.max(currentStepIndex - 1, 0);
    setCurrentStep(steps[prevIndex].id);
  }, [currentStepIndex, steps]);

  const handleComplete = useCallback(() => {
    onDeductionsChange(tempDeductions);
  }, [onDeductionsChange, tempDeductions]);

  // Memoize deduction update handlers to prevent re-renders
  const updateDeductions = useCallback((updates: Partial<OldTaxRegimeInputs>) => {
    setTempDeductions(prev => ({ ...prev, ...updates }));
  }, []);

  // Tooltip content definitions
  const tooltipContent = {
    section80C: {
      title: "Section 80C - Tax Saving Investments",
      description: "Investments that save tax up to ₹1.5 lakh per year",
      examples: [
        "PPF (Public Provident Fund) - 15-year lock-in",
        "ELSS Mutual Funds - 3-year lock-in", 
        "Life Insurance Premium - for yourself/family",
        "Employee PF - automatic deduction from salary",
        "NSC/Tax Saver FD - 5-year lock-in"
      ],
      note: "Example: Invest ₹1,50,000 → Save ₹31,200 in tax (at 20.8% rate)"
    },
    hra: {
      title: "HRA - House Rent Allowance",
      description: "Tax exemption on rent you pay if you receive HRA from employer",
      examples: [
        "You get ₹40,000 HRA + pay ₹30,000 rent monthly",
        "Metro cities: 50% of salary is exempt",
        "Non-metro: 40% of salary is exempt"
      ],
      note: "Example: ₹30k rent × 12 months = ₹3.6L yearly → Save ₹75k+ in tax"
    },
    homeLoan: {
      title: "Home Loan Interest",
      description: "Deduction on interest paid for home loans (not principal amount)",
      examples: [
        "Self-occupied property: Up to ₹2 lakh per year",
        "Under-construction property: No limit (Section 24b)",
        "Only interest component qualifies, not EMI principal"
      ],
      note: "Example: ₹2,00,000 interest → Save ₹41,600 in tax (at 20.8% rate)"
    },
    section80D: {
      title: "Section 80D - Health Insurance",
      description: "Premiums paid for health insurance for yourself and family",
      examples: [
        "Self + Family: Up to ₹25,000",
        "Parents (below 60): Additional ₹25,000",
        "Parents (above 60): Additional ₹50,000"
      ],
      note: "Example: ₹25,000 premium → Save ₹5,200 in tax (at 20.8% rate)"
    },
    section80E: {
      title: "Section 80E - Education Loan Interest",
      description: "Interest paid on education loans (for yourself, spouse, or children)",
      examples: [
        "Higher education loans from banks/institutions",
        "No upper limit on deduction amount",
        "Available for 8 years or until interest is paid"
      ],
      note: "Example: ₹1,00,000 interest → Save ₹20,800 in tax (at 20.8% rate)"
    },
    section80G: {
      title: "Section 80G - Charitable Donations",
      description: "Donations to approved charitable organizations and government funds",
      examples: [
        "PM Relief Fund: 100% deduction",
        "Government/approved NGOs: 50% deduction",
        "Check 80G certificate before donating"
      ],
      note: "Example: ₹10,000 donation → Save ₹1,040-2,080 in tax (depending on organization)"
    },
    section80TTA: {
      title: "Section 80TTA - Savings Account Interest",
      description: "Interest earned on savings bank accounts",
      examples: [
        "All savings accounts with banks/cooperatives",
        "Maximum deduction: ₹10,000 per year",
        "FD/RD interest doesn't qualify"
      ],
      note: "Example: ₹10,000 interest → Save ₹2,080 in tax (at 20.8% rate)"
    }
  };

  // Helper component for labels with tooltips
  const LabelWithTooltip = ({ children, tooltipKey }: { children: React.ReactNode; tooltipKey: keyof typeof tooltipContent }) => {
    const content = tooltipContent[tooltipKey];
    return (
      <div className="flex items-center gap-2">
        {children}
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="max-w-sm p-4 bg-white dark:bg-gray-900 border shadow-lg"
            sideOffset={8}
          >
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{content.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{content.description}</p>
              </div>
              <div>
                <p className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">Examples:</p>
                <ul className="text-sm space-y-1">
                  {content.examples.map((example, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5 text-base">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md p-3">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{content.note}</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  };

  if (setupMode === 'quick-select') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center pb-2">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            Smart Tax Deductions
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose your profile for instant optimization
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Select Cards */}
          <div className="grid gap-3 md:grid-cols-2">
            {/* Simple Employee */}
            <Card 
              className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
              onClick={() => handleQuickSelect('simple')}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">Simple Employee</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Basic investments only
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>PPF/ELSS:</span>
                        <span className="font-medium">₹75,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Health Ins:</span>
                        <span className="font-medium">₹15,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investor */}
            <Card 
              className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
              onClick={() => handleQuickSelect('investor')}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">Active Investor</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Maximize investments
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>80C Max:</span>
                        <span className="font-medium">₹1,50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Health Ins:</span>
                        <span className="font-medium">₹25,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Renter */}
            <Card 
              className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
              onClick={() => handleQuickSelect('renter')}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Home className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">Paying Rent</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Includes HRA benefits
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Investments:</span>
                        <span className="font-medium">₹1,20,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HRA Benefit:</span>
                        <span className="font-medium">₹2,40,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Homeowner */}
            <Card 
              className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
              onClick={() => handleQuickSelect('homeowner')}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calculator className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">Home Owner</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Includes home loan benefits
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>80C Max:</span>
                        <span className="font-medium">₹1,50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Home Loan:</span>
                        <span className="font-medium">₹2,00,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Custom Setup Button */}
          <div className="pt-4 text-center">
            <Button 
              variant="outline" 
              onClick={handleGuidedSetup}
              className="w-full md:w-auto"
            >
              I want to customize my deductions
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {/* Progress Header */}
      <CardHeader className="pb-2">
        <div className="space-y-3">
          {/* Stage Indicator */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tax Deductions Setup</h2>
            <Badge variant="outline" className="text-xs">
              Step {currentStepIndex + 1} of {steps.length}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{steps[currentStepIndex].label}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          {/* Clickable Visual Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className="flex flex-col items-center cursor-pointer group transition-all hover:scale-105"
                  aria-label={`Go to ${step.label} step`}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all
                    ${isCompleted ? 'bg-primary text-primary-foreground' : 
                      isCurrent ? 'bg-primary/20 text-primary border-2 border-primary' : 
                      'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-xs mt-1 hidden sm:block transition-colors ${
                    isCurrent ? 'text-primary font-medium' : 'text-muted-foreground group-hover:text-foreground'
                  }`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step Content */}
        {currentStep === 'profile' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tell us about yourself</h3>
            <p className="text-sm text-muted-foreground">
              This helps us suggest the best deductions for your situation
            </p>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="cursor-pointer transition-all hover:border-primary">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Age Group</h4>
                  <div className="space-y-2">
                    {['20-25', '25-30', '30-35', '35+'].map((age) => (
                      <SelectionButton
                        key={age}
                        selected={selectedAge === age}
                        onSelect={() => setSelectedAge(age)}
                      >
                        {age} years
                      </SelectionButton>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer transition-all hover:border-primary">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Location</h4>
                  <div className="space-y-2">
                    <SelectionButton
                      selected={selectedCity === 'metro'}
                      onSelect={() => setSelectedCity('metro')}
                    >
                      Metro City (Mumbai, Delhi, etc.)
                    </SelectionButton>
                    <SelectionButton
                      selected={selectedCity === 'non-metro'}
                      onSelect={() => setSelectedCity('non-metro')}
                    >
                      Non-Metro City
                    </SelectionButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentStep === 'investments' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Investment Deductions (80C)</h3>
              <p className="text-sm text-muted-foreground">
                Tax-saving investments up to ₹1,50,000
              </p>
            </div>

            <Card className="p-4">
              <div className="space-y-4">
                <LabelWithTooltip tooltipKey="section80C">
                  <Label className="text-sm font-medium">Investment Amount</Label>
                </LabelWithTooltip>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Suggested: ₹{formatIndianNumber(getIncomeBasedSuggestions(grossIncome).section80C)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Slider
                    value={[tempDeductions.section80C]}
                    onValueChange={(value: number[]) => updateDeductions({ section80C: value[0] })}
                    max={150000}
                    step={5000}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹0</span>
                    <span className="text-primary font-medium">
                      ₹{formatIndianNumber(tempDeductions.section80C)}
                    </span>
                    <span>₹1,50,000 (Max)</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateDeductions({ section80C: 75000 })}
                  >
                    Conservative
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateDeductions({ section80C: 120000 })}
                  >
                    Balanced
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateDeductions({ section80C: 150000 })}
                  >
                    Maximum
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentStep === 'housing' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Housing Benefits</h3>
              <p className="text-sm text-muted-foreground">
                You can claim both HRA and home loan benefits if applicable
              </p>
            </div>

            {/* HRA Section */}
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <LabelWithTooltip tooltipKey="hra">
                    <h4 className="font-medium">House Rent Allowance (HRA)</h4>
                  </LabelWithTooltip>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateDeductions({ 
                      hraReceived: tempDeductions.hraReceived > 0 ? 0 : 240000,
                      rentPaid: tempDeductions.rentPaid > 0 ? 0 : 360000,
                      isMetroCity: true
                    })}
                  >
                    {tempDeductions.hraReceived > 0 ? 'Remove HRA' : 'Add HRA'}
                  </Button>
                </div>

                {tempDeductions.hraReceived > 0 && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Monthly Rent</Label>
                      <Input
                        type="text"
                        placeholder="30,000"
                        value={formatIndianNumber(tempDeductions.rentPaid / 12)}
                        onChange={(e) => {
                          const monthlyRent = parseIndianNumber(e.target.value);
                          updateDeductions({ rentPaid: monthlyRent * 12 });
                        }}
                        className="mt-1"
                      />
                    </div>
                    <Checkbox
                      checked={tempDeductions.isMetroCity}
                      onCheckedChange={(checked) => updateDeductions({ isMetroCity: checked })}
                    >
                      I live in a metro city
                    </Checkbox>
                  </div>
                )}
              </div>
            </Card>

            {/* Home Loan Section */}
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <LabelWithTooltip tooltipKey="homeLoan">
                    <h4 className="font-medium">Home Loan Interest</h4>
                  </LabelWithTooltip>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateDeductions({ homeLoanInterest: tempDeductions.homeLoanInterest > 0 ? 0 : 200000 })}
                  >
                    {tempDeductions.homeLoanInterest > 0 ? 'Remove Home Loan' : 'Add Home Loan'}
                  </Button>
                </div>

                {tempDeductions.homeLoanInterest > 0 && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Annual Interest Amount</Label>
                      <Slider
                        value={[tempDeductions.homeLoanInterest]}
                        onValueChange={(value: number[]) => updateDeductions({ homeLoanInterest: value[0] })}
                        max={200000}
                        step={10000}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>₹0</span>
                        <span className="text-primary font-medium">
                          ₹{formatIndianNumber(tempDeductions.homeLoanInterest)}
                        </span>
                        <span>₹2,00,000 (Max)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {currentStep === 'health' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Health Insurance (80D)</h3>
              <p className="text-sm text-muted-foreground">
                Health insurance premiums up to ₹25,000
              </p>
            </div>

            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <LabelWithTooltip tooltipKey="section80D">
                    <Label className="text-sm font-medium">Annual Premium</Label>
                  </LabelWithTooltip>
                  <span className="text-sm text-muted-foreground">
                    Typical: ₹15,000-25,000
                  </span>
                </div>

                <Slider
                  value={[tempDeductions.section80D]}
                  onValueChange={(value: number[]) => updateDeductions({ section80D: value[0] })}
                  max={25000}
                  step={1000}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹0</span>
                  <span className="text-primary font-medium">
                    ₹{formatIndianNumber(tempDeductions.section80D)}
                  </span>
                  <span>₹25,000 (Max)</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateDeductions({ section80D: 15000 })}
                  >
                    Individual
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateDeductions({ section80D: 25000 })}
                  >
                    Family
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentStep === 'others' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Other Deductions</h3>
              <p className="text-sm text-muted-foreground">
                Additional deductions that can save you tax
              </p>
            </div>

            {/* Education Loan Interest */}
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <LabelWithTooltip tooltipKey="section80E">
                    <h4 className="font-medium">Education Loan Interest (80E)</h4>
                  </LabelWithTooltip>
                </div>
                <div>
                  <Label className="text-sm">Annual Interest Amount</Label>
                  <Input
                    type="text"
                    placeholder="50,000"
                    value={formatIndianNumber(tempDeductions.section80E)}
                    onChange={(e) => {
                      const value = parseIndianNumber(e.target.value);
                      updateDeductions({ section80E: value });
                    }}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">No upper limit</p>
                </div>
              </div>
            </Card>

            {/* Donations */}
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <LabelWithTooltip tooltipKey="section80G">
                    <h4 className="font-medium">Charitable Donations (80G)</h4>
                  </LabelWithTooltip>
                </div>
                <div>
                  <Label className="text-sm">Annual Donations</Label>
                  <Input
                    type="text"
                    placeholder="10,000"
                    value={formatIndianNumber(tempDeductions.section80G)}
                    onChange={(e) => {
                      const value = parseIndianNumber(e.target.value);
                      updateDeductions({ section80G: value });
                    }}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Generally limited to 10% of gross income</p>
                </div>
              </div>
            </Card>

            {/* Savings Account Interest */}
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-green-600" />
                  <LabelWithTooltip tooltipKey="section80TTA">
                    <h4 className="font-medium">Savings Account Interest (80TTA)</h4>
                  </LabelWithTooltip>
                </div>
                <div>
                  <Label className="text-sm">Annual Interest Earned</Label>
                  <Input
                    type="text"
                    placeholder="10,000"
                    value={formatIndianNumber(tempDeductions.section80TTA)}
                    onChange={(e) => {
                      const value = parseIndianNumber(e.target.value);
                      updateDeductions({ section80TTA: Math.min(value, 10000) });
                    }}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Maximum limit: ₹10,000</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentStep === 'summary' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Tax Savings Summary</h3>
              <p className="text-sm text-muted-foreground">
                Review your optimized deductions
              </p>
            </div>

            <Card className="p-6 bg-primary/5">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-primary">
                  ₹{formatIndianNumber(calculateTaxSavings(tempDeductions))}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Total Annual Tax Savings
                </p>
              </div>
            </Card>

            <div className="space-y-3">
              {[
                { 
                  label: '80C Investments', 
                  amount: Math.min(tempDeductions.section80C, 150000),
                  savings: Math.round(Math.min(tempDeductions.section80C, 150000) * 0.208)
                },
                { 
                  label: 'Health Insurance', 
                  amount: Math.min(tempDeductions.section80D, 25000),
                  savings: Math.round(Math.min(tempDeductions.section80D, 25000) * 0.208)
                },
                { 
                  label: 'HRA Exemption', 
                  amount: calculateHRAExemption(tempDeductions),
                  savings: Math.round(calculateHRAExemption(tempDeductions) * 0.208)
                },
                { 
                  label: 'Home Loan Interest', 
                  amount: Math.min(tempDeductions.homeLoanInterest, 200000),
                  savings: Math.round(Math.min(tempDeductions.homeLoanInterest, 200000) * 0.208)
                },
                { 
                  label: 'Education Loan Interest', 
                  amount: tempDeductions.section80E,
                  savings: Math.round(tempDeductions.section80E * 0.208)
                },
                { 
                  label: 'Charitable Donations', 
                  amount: Math.min(tempDeductions.section80G, 10000),
                  savings: Math.round(Math.min(tempDeductions.section80G, 10000) * 0.208)
                },
                { 
                  label: 'Savings Interest', 
                  amount: Math.min(tempDeductions.section80TTA, 10000),
                  savings: Math.round(Math.min(tempDeductions.section80TTA, 10000) * 0.208)
                }
              ].filter(item => item.amount > 0).map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <span className="font-medium text-sm">{item.label}</span>
                    <p className="text-xs text-muted-foreground">₹{formatIndianNumber(item.amount)}</p>
                  </div>
                  <Badge variant="secondary">
                    Saves ₹{formatIndianNumber(item.savings)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button 
            type="button"
            variant="outline" 
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep === 'summary' ? (
            <Button type="button" onClick={handleComplete} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Apply Settings
            </Button>
          ) : (
            <Button type="button" onClick={nextStep} className="flex items-center gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 