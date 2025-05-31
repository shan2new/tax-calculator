"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Info, Home, PiggyBank, Building2, Calculator, GraduationCap, Heart, Banknote } from "lucide-react";
import { formatIndianNumber, parseIndianNumber } from "@/lib/formatters";

export interface OldTaxRegimeInputs {
  section80C: number;
  section80D: number;
  hraReceived: number;
  rentPaid: number;
  isMetroCity: boolean;
  homeLoanInterest: number;
  section80E: number;
  section80G: number;
  section80EE: number;
  section80EEA: number;
  section80TTA: number;
}

interface OldTaxRegimeFormProps {
  deductions: OldTaxRegimeInputs;
  onDeductionsChange: (deductions: OldTaxRegimeInputs) => void;
  grossIncome: number;
}

export function OldTaxRegimeForm({ deductions, onDeductionsChange, grossIncome }: OldTaxRegimeFormProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    section80C: true,
    hraDetails: false,
    section80D: false,
    homeLoan: false,
    others: false
  });

  const updateDeduction = (field: keyof OldTaxRegimeInputs, value: number | boolean) => {
    onDeductionsChange({
      ...deductions,
      [field]: value
    });
  };

  const handleInputChange = (field: keyof OldTaxRegimeInputs, value: string) => {
    const numValue = parseIndianNumber(value);
    updateDeduction(field, numValue);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getTotalDeductions = () => {
    const hraExemption = calculateHRAExemption();
    return Math.min(deductions.section80C, 150000) + 
           Math.min(deductions.section80D, 25000) + 
           hraExemption +
           Math.min(deductions.homeLoanInterest, 200000) +
           deductions.section80E +
           Math.min(deductions.section80G, 10000) +
           Math.min(deductions.section80EE, 50000) +
           Math.min(deductions.section80EEA, 150000) +
           Math.min(deductions.section80TTA, 10000) +
           50000; // Standard deduction for old regime
  };

  const calculateHRAExemption = () => {
    if (deductions.hraReceived === 0 || deductions.rentPaid === 0) return 0;
    
    const basicSalary = grossIncome; // Simplified assumption
    const hraPercent = deductions.isMetroCity ? 0.5 : 0.4;
    const exemptionOptions = [
      deductions.hraReceived,
      basicSalary * hraPercent,
      Math.max(0, deductions.rentPaid - (basicSalary * 0.1))
    ];
    
    return Math.min(...exemptionOptions);
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl text-primary-foreground">
              <Building2 className="w-5 h-5" />
            </div>
            Old Tax Regime Deductions
            <Badge variant="outline" className="ml-auto">
              Higher Deductions
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Maximize your tax savings with comprehensive deductions and exemptions
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Section 80C */}
          <Collapsible 
            open={expandedSections.section80C}
            onOpenChange={() => toggleSection('section80C')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto bg-muted/50 hover:bg-muted">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-foreground">
                      Section 80C - Investment Deductions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tax-saving investments up to ₹1,50,000
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    ₹{formatIndianNumber(Math.min(deductions.section80C, 150000))}
                  </Badge>
                  {expandedSections.section80C ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4 pl-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  Total 80C Investments
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <p className="font-medium mb-2">Popular 80C Options:</p>
                        <ul className="text-xs space-y-1">
                          <li>• PPF contributions</li>
                          <li>• ELSS Mutual Funds</li>
                          <li>• Life Insurance Premium</li>
                          <li>• Employee PF</li>
                          <li>• NSC, Tax Saver FD</li>
                          <li>• ULIP, Sukanya Samriddhi</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  type="text"
                  value={formatIndianNumber(deductions.section80C)}
                  onChange={(e) => handleInputChange('section80C', e.target.value)}
                  placeholder="1,50,000"
                  className="text-lg font-medium"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Maximum limit: ₹1,50,000</span>
                  <span className={`font-medium ${deductions.section80C > 150000 ? 'text-destructive' : 'text-chart-1'}`}>
                    Eligible: ₹{formatIndianNumber(Math.min(deductions.section80C, 150000))}
                  </span>
                </div>
                {deductions.section80C > 150000 && (
                  <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg">
                    ⚠️ Amount exceeds limit. Only ₹1,50,000 will be considered for deduction.
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* HRA Section */}
          <Collapsible 
            open={expandedSections.hraDetails}
            onOpenChange={() => toggleSection('hraDetails')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto bg-chart-1/10 hover:bg-chart-1/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-1 rounded-lg text-primary-foreground">
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-foreground">
                      HRA Exemption
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      House Rent Allowance benefits
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    ₹{formatIndianNumber(calculateHRAExemption())}
                  </Badge>
                  {expandedSections.hraDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4 pl-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">HRA Received (Annual)</Label>
                  <Input
                    type="text"
                    value={formatIndianNumber(deductions.hraReceived)}
                    onChange={(e) => handleInputChange('hraReceived', e.target.value)}
                    placeholder="2,40,000"
                    className="focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rent Paid (Annual)</Label>
                  <Input
                    type="text"
                    value={formatIndianNumber(deductions.rentPaid)}
                    onChange={(e) => handleInputChange('rentPaid', e.target.value)}
                    placeholder="3,60,000"
                    className="focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                <input
                  type="checkbox"
                  checked={deductions.isMetroCity}
                  onChange={(e) => updateDeduction('isMetroCity', e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <Label className="text-sm">I live in a metro city (Mumbai, Delhi, Kolkata, Chennai)</Label>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl border">
                <p className="text-sm font-semibold text-foreground mb-2">
                  💰 HRA Exemption: ₹{formatIndianNumber(calculateHRAExemption())}
                </p>
                <p className="text-xs text-muted-foreground">
                  Calculated as minimum of: HRA received, {deductions.isMetroCity ? '50%' : '40%'} of salary, 
                  or (Rent paid - 10% of salary)
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Section 80D - Health Insurance */}
          <Collapsible 
            open={expandedSections.section80D}
            onOpenChange={() => toggleSection('section80D')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto bg-chart-5/10 hover:bg-chart-5/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-5 rounded-lg text-primary-foreground">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-foreground">
                      Section 80D - Health Insurance
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Medical insurance premiums up to ₹25,000
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    ₹{formatIndianNumber(Math.min(deductions.section80D, 25000))}
                  </Badge>
                  {expandedSections.section80D ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4 pl-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  Health Insurance Premium (Annual)
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <p className="font-medium mb-2">Eligible Premiums:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Self & family insurance</li>
                          <li>• Parents insurance (additional)</li>
                          <li>• Preventive health checkup</li>
                          <li>• Medical expenses for senior parents</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  type="text"
                  value={formatIndianNumber(deductions.section80D)}
                  onChange={(e) => handleInputChange('section80D', e.target.value)}
                  placeholder="25,000"
                  className="text-lg font-medium"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Maximum limit: ₹25,000 (Basic)</span>
                  <span className={`font-medium ${deductions.section80D > 25000 ? 'text-destructive' : 'text-chart-1'}`}>
                    Eligible: ₹{formatIndianNumber(Math.min(deductions.section80D, 25000))}
                  </span>
                </div>
                {deductions.section80D > 25000 && (
                  <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg">
                    ⚠️ Basic limit is ₹25,000. Higher limits available for senior citizens.
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Home Loan Interest */}
          <Collapsible 
            open={expandedSections.homeLoan}
            onOpenChange={() => toggleSection('homeLoan')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto bg-chart-4/10 hover:bg-chart-4/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-4 rounded-lg text-primary-foreground">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-foreground">
                      Home Loan Interest
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Interest on housing loan up to ₹2,00,000
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    ₹{formatIndianNumber(Math.min(deductions.homeLoanInterest, 200000))}
                  </Badge>
                  {expandedSections.homeLoan ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4 pl-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  Home Loan Interest (Annual)
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <p className="font-medium mb-2">Conditions:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Self-occupied property</li>
                          <li>• Maximum ₹2 lakh per year</li>
                          <li>• Only interest component</li>
                          <li>• Property should be completed</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  type="text"
                  value={formatIndianNumber(deductions.homeLoanInterest)}
                  onChange={(e) => handleInputChange('homeLoanInterest', e.target.value)}
                  placeholder="2,00,000"
                  className="text-lg font-medium"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Maximum limit: ₹2,00,000</span>
                  <span className={`font-medium ${deductions.homeLoanInterest > 200000 ? 'text-destructive' : 'text-chart-1'}`}>
                    Eligible: ₹{formatIndianNumber(Math.min(deductions.homeLoanInterest, 200000))}
                  </span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Other Deductions */}
          <Collapsible 
            open={expandedSections.others}
            onOpenChange={() => toggleSection('others')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto bg-chart-3/10 hover:bg-chart-3/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-3 rounded-lg text-primary-foreground">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-foreground">
                      Other Deductions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Education loan, donations, savings interest
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    ₹{formatIndianNumber(deductions.section80E + Math.min(deductions.section80G, 10000) + Math.min(deductions.section80TTA, 10000))}
                  </Badge>
                  {expandedSections.others ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 pt-4 pl-6">
              {/* Section 80E - Education Loan */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <GraduationCap className="w-4 h-4 text-chart-2" />
                  Section 80E - Education Loan Interest
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">No upper limit. Interest on education loan for higher studies.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  type="text"
                  value={formatIndianNumber(deductions.section80E)}
                  onChange={(e) => handleInputChange('section80E', e.target.value)}
                  placeholder="50,000"
                  className="focus:ring-2 focus:ring-chart-2"
                />
                <p className="text-xs text-muted-foreground">No upper limit for education loan interest</p>
              </div>

              {/* Section 80G - Donations */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Heart className="w-4 h-4 text-chart-5" />
                  Section 80G - Charitable Donations
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">Donations to approved charitable organizations. Typically 50% or 100% deductible.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  type="text"
                  value={formatIndianNumber(deductions.section80G)}
                  onChange={(e) => handleInputChange('section80G', e.target.value)}
                  placeholder="10,000"
                  className="focus:ring-2 focus:ring-chart-5"
                />
                <p className="text-xs text-muted-foreground">
                  Generally 10% of gross income or actual, whichever is lower
                </p>
              </div>

              {/* Section 80TTA - Savings Interest */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <PiggyBank className="w-4 h-4 text-chart-1" />
                  Section 80TTA - Savings Account Interest
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">Interest earned on savings bank account up to ₹10,000</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  type="text"
                  value={formatIndianNumber(deductions.section80TTA)}
                  onChange={(e) => handleInputChange('section80TTA', e.target.value)}
                  placeholder="10,000"
                  className="focus:ring-2 focus:ring-chart-1"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Maximum limit: ₹10,000</span>
                  <span className={`font-medium ${deductions.section80TTA > 10000 ? 'text-destructive' : 'text-chart-1'}`}>
                    Eligible: ₹{formatIndianNumber(Math.min(deductions.section80TTA, 10000))}
                  </span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Enhanced Summary */}
          <Separator className="my-8" />
          <div className="bg-muted/50 p-6 rounded-lg">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Total Deduction Summary</h3>
              <p className="text-sm text-muted-foreground">Your total available deductions under the old tax regime</p>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deduction Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    label: "Standard Deduction",
                    amount: 50000,
                    icon: Calculator,
                    description: "Standard deduction under Old Tax Regime"
                  },
                  {
                    label: "Section 80C",
                    amount: Math.min(deductions.section80C, 150000),
                    icon: PiggyBank,
                    description: "Tax-saving investments and payments"
                  },
                  {
                    label: "Section 80D",
                    amount: Math.min(deductions.section80D, 25000),
                    icon: Heart,
                    description: "Health insurance premiums"
                  },
                  {
                    label: "HRA Exemption",
                    amount: calculateHRAExemption(),
                    icon: Home,
                    description: "House Rent Allowance exemption"
                  },
                  {
                    label: "Home Loan Interest",
                    amount: Math.min(deductions.homeLoanInterest, 200000),
                    icon: Building2,
                    description: "Interest on housing loan"
                  },
                  {
                    label: "Education Loan (80E)",
                    amount: deductions.section80E,
                    icon: GraduationCap,
                    description: "Interest on education loan"
                  },
                  {
                    label: "Other Deductions",
                    amount: Math.min(deductions.section80G, 10000) + Math.min(deductions.section80TTA, 10000),
                    icon: Banknote,
                    description: "Donations and savings account interest"
                  }
                ].map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-primary">
                        ₹{formatIndianNumber(item.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">Total Deductions</span>
                </div>
                <span className="text-lg font-semibold text-primary">
                  ₹{formatIndianNumber(getTotalDeductions())}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
} 