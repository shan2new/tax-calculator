"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Calculator, DollarSign, PieChart, Target, ChevronUp } from "lucide-react";
import { calculateTax, calculateOldTaxRegime, compareRegimes, type TaxResult, type OldTaxRegimeInputs, type TaxRegimeComparison } from "@/lib/taxCalculations";
import { 
  formatCurrency, 
  formatIndianNumber, 
  parseIndianNumber, 
  convertToWords, 
  formatPercentage, 
  validateIncome, 
  validateMonths 
} from "@/lib/formatters";
import confetti from "canvas-confetti";
import { TaxRegimeSelector, type TaxRegime } from "@/components/TaxRegimeSelector";
import { OldTaxRegimeForm } from "@/components/OldTaxRegimeForm";
import { SalaryComparison } from "@/components/SalaryComparison";
import { About } from "@/components/About";
import { useNavigation } from "@/lib/navigation-context";

const formSchema = z.object({
  grossIncome: z.string().min(1, "Income is required"),
  monthsWorked: z.number().min(1, "Must work at least 1 month").max(12, "Cannot exceed 12 months"),
});

type FormData = z.infer<typeof formSchema>;

export function TaxCalculator() {
  const { currentPage } = useNavigation();
  const [selectedRegime, setSelectedRegime] = useState<TaxRegime>('new');
  const [oldRegimeDeductions, setOldRegimeDeductions] = useState<OldTaxRegimeInputs>({
    section80C: 150000,
    section80D: 25000,
    hraReceived: 240000,
    rentPaid: 360000,
    isMetroCity: true,
    homeLoanInterest: 200000,
    section80E: 50000,
    section80G: 10000,
    section80EE: 0,
    section80EEA: 0,
    section80TTA: 10000
  });
  const [results, setResults] = useState<TaxResult | null>(null);
  const [comparisonResults, setComparisonResults] = useState<TaxRegimeComparison | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [amountInWords, setAmountInWords] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossIncome: "75,00,000",
      monthsWorked: 12,
    },
  });

  const grossIncomeValue = form.watch("grossIncome");
  const monthsWorkedValue = form.watch("monthsWorked");

  // Update amount in words when income changes
  useEffect(() => {
    const income = parseIndianNumber(grossIncomeValue);
    if (income > 0) {
      setAmountInWords(convertToWords(income));
    } else {
      setAmountInWords("");
    }
  }, [grossIncomeValue]);

  // Handle scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      setShowScrollTop(scrollTop > windowHeight * 0.3);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset state when switching away from calculator page
  useEffect(() => {
    if (currentPage !== "calculator") {
      setShowResults(false);
      setShowComparison(false);
    }
  }, [currentPage]);

  const onSubmit = useCallback(async (data: FormData) => {
    const income = parseIndianNumber(data.grossIncome);
    const incomeValidation = validateIncome(income);
    const monthsValidation = validateMonths(data.monthsWorked);

    if (!incomeValidation.isValid) {
      toast.error(incomeValidation.message);
      return;
    }

    if (!monthsValidation.isValid) {
      toast.error(monthsValidation.message);
      return;
    }

    setIsCalculating(true);
    setShowResults(false);
    setShowComparison(false);

    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      let taxResult: TaxResult;
      
      if (selectedRegime === 'new') {
        taxResult = calculateTax(income, data.monthsWorked);
      } else {
        taxResult = calculateOldTaxRegime(income, data.monthsWorked, oldRegimeDeductions);
      }
      
      setResults(taxResult);
      setShowResults(true);
      
      // Success feedback
      toast.success("✓ Tax calculation completed successfully!");
      
      // Enhanced celebration effect
      const colors = ['hsl(var(--chart-2))', 'hsl(var(--chart-1))', 'hsl(var(--chart-4))', 'hsl(var(--destructive))', 'hsl(var(--chart-5))'];
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors,
        ticks: 400,
        gravity: 0.8,
        scalar: 1.2
      });

      // Additional burst
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
      }, 200);

      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);

    } catch (error) {
      toast.error("Error calculating tax. Please try again.");
      console.error("Tax calculation error:", error);
    } finally {
      setIsCalculating(false);
    }
  }, [selectedRegime, oldRegimeDeductions]);

  const handleCompareRegimes = useCallback(async () => {
    const grossIncome = form.getValues("grossIncome");
    const monthsWorked = form.getValues("monthsWorked");
    const income = parseIndianNumber(grossIncome);
    const incomeValidation = validateIncome(income);
    const monthsValidation = validateMonths(monthsWorked);

    if (!incomeValidation.isValid || !monthsValidation.isValid) {
      toast.error("Please enter valid income and months worked before comparing.");
      return;
    }

    setIsCalculating(true);
    setShowComparison(false);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const comparison = compareRegimes(income, monthsWorked, oldRegimeDeductions);
      setComparisonResults(comparison);
      setShowComparison(true);
      
      toast.success("✓ Tax regime comparison completed!");
      
      // Scroll to comparison results
      setTimeout(() => {
        const comparisonElement = document.getElementById('comparison-results');
        if (comparisonElement) {
          comparisonElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);

    } catch (error) {
      toast.error("Error comparing tax regimes. Please try again.");
      console.error("Comparison error:", error);
    } finally {
      setIsCalculating(false);
    }
  }, [oldRegimeDeductions, form]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTaxEfficiencyText = (rate: number) => {
    if (rate <= 10) return "Excellent tax efficiency";
    if (rate <= 20) return "Good tax efficiency";
    if (rate <= 30) return "Moderate tax efficiency";
    return "Consider tax planning";
  };

  const handleRegimeChange = (regime: TaxRegime) => {
    setSelectedRegime(regime);
    setShowResults(false);
    setShowComparison(false);
    
    // If compare is selected, automatically trigger comparison
    if (regime === 'compare') {
      // Use a timeout to ensure state is set first
      setTimeout(() => {
        handleCompareRegimes();
      }, 100);
    }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case "comparison":
        return <SalaryComparison />;
      
      case "regimes":
  return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TaxRegimeSelector
              selectedRegime={selectedRegime}
              onRegimeChange={handleRegimeChange}
              income={parseIndianNumber(grossIncomeValue)}
              showComparison={true}
            />
            </div>
        );
      
      case "guide":
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-display font-semibold">
                  About Indian Tax Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tax Year 2025-26 Features</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Updated tax slabs and rates for FY 2025-26</li>
                      <li>• Support for both New and Old tax regimes</li>
                      <li>• Comprehensive deduction calculations</li>
                      <li>• Real-time comparison between regimes</li>
                      <li>• Professional tax computation with surcharge and cess</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Important Deadlines</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Financial Year: April 1, 2025 to March 31, 2026</li>
                      <li>• ITR Filing Deadline: July 31, 2026</li>
                      <li>• Tax Payment Deadline: March 31, 2026</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case "help":
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-display font-semibold">
                  Help & Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">How to Use This Calculator</h3>
                    <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                      <li>Enter your annual gross income</li>
                      <li>Select the number of months worked</li>
                      <li>Choose between New or Old tax regime</li>
                      <li>If using Old regime, fill in your deductions</li>
                      <li>Click Calculate Tax to see your results</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Common Questions</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Q: Which tax regime should I choose?</h4>
                        <p className="text-muted-foreground text-sm">
                          It depends on your deductions. Use our comparison tool to see which works better for your situation.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Q: What is the standard deduction?</h4>
                        <p className="text-muted-foreground text-sm">
                          ₹75,000 for New Regime and ₹50,000 for Old Regime (FY 2025-26).
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Q: Can I switch regimes every year?</h4>
                        <p className="text-muted-foreground text-sm">
                          Yes, you can choose your preferred regime each financial year when filing your ITR.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case "about":
        return <About />;
      
      default: // calculator
        return (
          <div className="container max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">
                Income Tax Calculator
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Calculate your income tax liability for FY 2025-26 under the {selectedRegime === 'new' ? 'New' : 'Old'} Tax Regime
                      </p>
                    </div>
                    
            {/* Tax Regime Selector */}
            <TaxRegimeSelector
              selectedRegime={selectedRegime}
              onRegimeChange={handleRegimeChange}
              income={parseIndianNumber(grossIncomeValue)}
              showComparison={true}
            />

            {/* Main Calculator or Comparison Results */}
            {selectedRegime === 'compare' ? (
              // Show comparison results when Compare Both is selected
              showComparison && comparisonResults ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Regime Comparison</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Detailed comparison between both tax regimes
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Comparison Overview */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* New Regime Card */}
                      <Card className={comparisonResults.recommendation === 'new' ? 'border-primary' : ''}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">New Tax Regime</CardTitle>
                            {comparisonResults.recommendation === 'new' && (
                              <Badge>Recommended</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Tax:</span>
                            <span className="font-medium">{formatCurrency(comparisonResults.newRegime.totalTax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Take Home:</span>
                            <span className="font-medium">{formatCurrency(comparisonResults.newRegime.afterTaxAnnual)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Effective Rate:</span>
                            <span className="font-medium">{formatPercentage(comparisonResults.newRegime.effectiveTaxRate)}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Old Regime Card */}
                      <Card className={comparisonResults.recommendation === 'old' ? 'border-primary' : ''}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Old Tax Regime</CardTitle>
                            {comparisonResults.recommendation === 'old' && (
                              <Badge>Recommended</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Tax:</span>
                            <span className="font-medium">{formatCurrency(comparisonResults.oldRegime.totalTax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Take Home:</span>
                            <span className="font-medium">{formatCurrency(comparisonResults.oldRegime.afterTaxAnnual)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Effective Rate:</span>
                            <span className="font-medium">{formatPercentage(comparisonResults.oldRegime.effectiveTaxRate)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Savings Summary */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-semibold">Potential Savings</h3>
                          <p className="text-3xl font-bold text-primary">
                            ₹{formatIndianNumber(comparisonResults.savings)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            By choosing {comparisonResults.recommendation === 'new' ? 'New' : 'Old'} Tax Regime
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Regime Comparison</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Enter your income details to see the comparison
                    </p>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">
                      Generating comparison results...
                    </p>
                  </CardContent>
                </Card>
              )
            ) : (
              // Show calculator form for New or Old tax regimes
              <Card>
                <CardHeader>
                  <CardTitle>Tax Calculator</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Enter your income details to calculate tax liability
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Annual Gross Income */}
                        <FormField
                          control={form.control}
                          name="grossIncome"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Annual Gross Income</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</div>
                                  <Input
                                    {...field}
                                    placeholder="75,00,000"
                                    className="pl-8 h-10"
                                    onChange={(e) => {
                                      const numValue = parseIndianNumber(e.target.value);
                                      if (!isNaN(numValue)) {
                                        field.onChange(formatIndianNumber(numValue));
                                      }
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <div className="min-h-[20px]">
                                {amountInWords && (
                                  <FormDescription>
                                    {amountInWords}
                                  </FormDescription>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Months Worked */}
                        <FormField
                          control={form.control}
                          name="monthsWorked"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Months Worked</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="1"
                                  max="12"
                                  className="h-10"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <div className="min-h-[20px]">
                                {field.value < 12 && field.value > 0 && (
                                  <FormDescription>
                                    Pro-rated calculation for {field.value} months
                                  </FormDescription>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Old Tax Regime Deductions Form */}
                      {selectedRegime === 'old' && (
                        <div className="space-y-4">
                          <OldTaxRegimeForm
                            deductions={oldRegimeDeductions}
                            onDeductionsChange={setOldRegimeDeductions}
                            grossIncome={parseIndianNumber(grossIncomeValue)}
                          />
                        </div>
                      )}

                      {/* Calculate Button */}
                      <div className="flex justify-center pt-4">
                        <Button 
                          type="submit"
                          disabled={isCalculating}
                          size="lg"
                        >
                          {isCalculating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                              Calculating...
                            </>
                          ) : (
                            <>
                              <Calculator className="w-4 h-4 mr-2" />
                              Calculate Tax
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

          {/* Results Section */}
            {showResults && results && (
              <div className="space-y-8">
                {/* Tax Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Summary</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Your tax calculation results for FY 2025-26
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Effective Income</p>
                              <p className="text-2xl font-semibold">{formatCurrency(results.effectiveIncome)}</p>
                              <p className="text-xs text-muted-foreground mt-1">After standard deduction</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Tax Payable (Annual)</p>
                              <p className="text-2xl font-semibold">{formatCurrency(results.totalTax)}</p>
                              <p className="text-xs text-muted-foreground mt-1">Total tax for the year</p>
                                    </div>
                            <Calculator className="h-8 w-8 text-muted-foreground" />
                                  </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Tax Payable (Monthly)</p>
                              <p className="text-2xl font-semibold">{formatCurrency(results.totalTax / monthsWorkedValue)}</p>
                              <p className="text-xs text-muted-foreground mt-1">Monthly tax deduction</p>
                            </div>
                            <PieChart className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Take Home (Annual)</p>
                              <p className="text-2xl font-semibold text-primary">{formatCurrency(results.afterTaxAnnual)}</p>
                              <p className="text-xs text-muted-foreground mt-1">After all deductions</p>
                            </div>
                            <Target className="h-8 w-8 text-primary" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                                      <div>
                              <p className="text-sm font-medium text-muted-foreground">Take Home (Monthly)</p>
                              <p className="text-2xl font-semibold text-primary">{formatCurrency(results.afterTaxMonthly)}</p>
                              <p className="text-xs text-muted-foreground mt-1">Monthly salary</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-primary" />
                                      </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Effective Tax Rate</p>
                              <p className="text-2xl font-semibold">{formatPercentage(results.effectiveTaxRate)}</p>
                              <div className="mt-2">
                                <Progress value={Math.min(results.effectiveTaxRate, 40)} className="h-2" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {getTaxEfficiencyText(results.effectiveTaxRate)}
                              </p>
                                  </div>
                            <PieChart className="h-8 w-8 text-muted-foreground" />
                                </div>
                        </CardContent>
                              </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Tax Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Tax Breakdown</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { 
                            label: "Gross Income", 
                            value: results.effectiveIncome, 
                            isPositive: true, 
                            icon: DollarSign,
                            description: "Annual gross salary including all components"
                          },
                          { 
                            label: "Less: Standard Deduction", 
                            value: -results.standardDeduction, 
                            isDeduction: true, 
                            icon: DollarSign,
                            description: "Standard deduction allowed under the tax regime"
                          },
                          { 
                            label: "Taxable Income", 
                            value: results.taxableIncome, 
                            isPositive: true, 
                            icon: Calculator,
                            description: "Income liable for tax after deductions"
                          },
                          { 
                            label: "Basic Tax", 
                            value: results.basicTax, 
                            isPositive: true, 
                            icon: Calculator,
                            description: "Tax calculated as per income tax slabs"
                          },
                          ...(results.rebate > 0 ? [{ 
                            label: "Less: Rebate u/s 87A", 
                            value: -results.rebate, 
                            isDeduction: true, 
                            icon: DollarSign,
                            description: "Tax rebate for income up to ₹7 lakh"
                          }] : []),
                          { 
                            label: "Tax after Rebate", 
                            value: results.taxAfterRebate, 
                            isPositive: true, 
                            icon: Calculator,
                            description: "Tax liability after rebate deduction"
                          },
                          ...(results.surcharge > 0 ? [{ 
                            label: `Add: Surcharge (${results.surchargeRate}%)`, 
                            value: results.surcharge, 
                            isPositive: true, 
                            icon: PieChart,
                            description: "Additional surcharge for high income earners"
                          }] : []),
                          ...(results.marginalRelief > 0 ? [{ 
                            label: "Less: Marginal Relief", 
                            value: -results.marginalRelief, 
                            isDeduction: true, 
                            icon: DollarSign,
                            description: "Relief to limit total tax rate impact"
                          }] : []),
                          { 
                            label: "Add: Health & Education Cess (4%)", 
                            value: results.cess, 
                            isPositive: true, 
                            icon: PieChart,
                            description: "4% cess on income tax and surcharge"
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
                              <span className={`font-medium ${
                                item.isDeduction ? 'text-green-600' : 'text-foreground'
                              }`}>
                          {formatCurrency(Math.abs(item.value))}
                        </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          <span className="text-lg font-semibold">Total Tax Payable</span>
                        </div>
                        <span className="text-lg font-semibold text-primary">
                          {formatCurrency(results.totalTax)}
                        </span>
                      </div>
                    </div>

                    {/* Tax Slabs Breakdown */}
                    <div className="mt-8 pt-6 border-t">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold">Tax Slab Calculation Details</h4>
                        <p className="text-sm text-muted-foreground">How your tax is calculated across different income slabs</p>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Income Slab</TableHead>
                            <TableHead className="text-center">Tax Rate</TableHead>
                            <TableHead className="text-right">Tax Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                        {results.slabDetails.map((slab, index) => (
                            <TableRow
                            key={index}
                              className={slab.tax > 0 ? 'bg-muted/50' : ''}
                            >
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {slab.tax > 0 && (
                                    <div className="h-2 w-2 bg-primary rounded-full" />
                                  )}
                                  <span className={slab.tax > 0 ? 'font-medium' : 'text-muted-foreground'}>
                                    {slab.range.replace(' @ ', '')}
                                </span>
                              </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant={slab.tax > 0 ? "default" : "secondary"}>
                                  {slab.rate}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className={`font-medium ${
                                  slab.tax > 0 ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                {formatCurrency(slab.tax)}
                              </span>
                              </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Enhancements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Very subtle gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-5" style={{
          background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)'
        }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-3" style={{
          background: 'radial-gradient(circle, #10b981 0%, transparent 70%)'
        }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-2" style={{
          background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)'
        }} />
        
        {/* Subtle dot pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #e2e8f0 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Very light grid */}
        <div 
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>
      
      {/* Page Content */}
      <div className="relative z-10">
        {renderPageContent()}
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 flex items-center justify-center transition-all duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: showScrollTop ? 1 : 0, y: showScrollTop ? 0 : 100 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronUp className="w-6 h-6" />
      </motion.button>
    </div>
  );
} 