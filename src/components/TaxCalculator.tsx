"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Calculator, Target, ChevronUp, BarChart3, Settings, ChevronDown } from "lucide-react";
import { calculateTax, calculateOldTaxRegime, type TaxResult, type OldTaxRegimeInputs } from "@/lib/taxCalculations";
import { 
  formatCurrency, 
  formatIndianNumber, 
  parseIndianNumber, 
  formatPercentage, 
  validateIncome, 
  validateMonths 
} from "@/lib/formatters";
import confetti from "canvas-confetti";
import { TaxRegimeSelector, type TaxRegime } from "@/components/TaxRegimeSelector";
import { SalaryComparison } from "@/components/SalaryComparison";
import { About } from "@/components/About";
import { Hero } from "@/components/Hero";
import { useNavigation } from "@/lib/navigation-context";
import { SmartDeductionsWizard } from "@/components/SmartDeductionsWizard";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { FAQPage } from "@/components/FAQPage";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  grossIncome: z.string().min(1, "Income is required"),
  monthsWorked: z.number().min(1, "Must work at least 1 month").max(12, "Cannot exceed 12 months"),
  // Simple job change fields
  hasJobChange: z.boolean().optional(),
  firstJobIncome: z.string().optional(),
  firstJobStartDate: z.date().optional(),
  firstJobEndDate: z.date().optional(),
  secondJobIncome: z.string().optional(),
  secondJobStartDate: z.date().optional(),
  secondJobEndDate: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function TaxCalculator() {
  const { currentPage } = useNavigation();
  const [selectedRegime, setSelectedRegime] = useState<TaxRegime>('new');
  const [hasJobChange, setHasJobChange] = useState(false);
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
  const [comparisonResults, setComparisonResults] = useState<{
    newRegime: TaxResult;
    oldRegime: TaxResult;
    recommendation: 'new' | 'old';
    savings: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossIncome: "75,00,000",
      monthsWorked: 12,
      hasJobChange: false,
      firstJobIncome: "7,20,000",
      firstJobStartDate: new Date("2025-04-01"),
      firstJobEndDate: new Date("2025-09-30"),
      secondJobIncome: "9,60,000",
      secondJobStartDate: new Date("2025-10-01"),
      secondJobEndDate: new Date("2026-03-31"),
    },
  });

  const grossIncomeValue = form.watch("grossIncome");

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
    }
  }, [currentPage]);

  const onSubmit = useCallback(async (data: FormData) => {
    let income: number;
    let months: number;
    
    if (data.hasJobChange && data.firstJobIncome && data.secondJobIncome && data.firstJobStartDate && data.firstJobEndDate && data.secondJobStartDate && data.secondJobEndDate) {
      // Calculate combined income from job change scenario
      const firstJobIncome = parseIndianNumber(data.firstJobIncome);
      const secondJobIncome = parseIndianNumber(data.secondJobIncome);
      
      // Calculate months worked for each job based on date ranges
      const firstStart = new Date(data.firstJobStartDate);
      const firstEnd = new Date(data.firstJobEndDate);
      const secondStart = new Date(data.secondJobStartDate);
      const secondEnd = new Date(data.secondJobEndDate);
      
      // Calculate months (simplified - counting full months between dates)
      const firstJobMonths = Math.max(1, Math.ceil((firstEnd.getTime() - firstStart.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      const secondJobMonths = Math.max(1, Math.ceil((secondEnd.getTime() - secondStart.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      
      // Pro-rate salaries based on months worked
      const proRatedFirstIncome = (firstJobIncome * firstJobMonths) / 12;
      const proRatedSecondIncome = (secondJobIncome * secondJobMonths) / 12;
      
      income = proRatedFirstIncome + proRatedSecondIncome;
      months = Math.min(12, firstJobMonths + secondJobMonths);
      
      if (months > 12) {
        toast.error("Total work period cannot exceed 12 months");
        return;
      }
    } else {
      // Simple single income scenario
      income = parseIndianNumber(data.grossIncome);
      months = data.monthsWorked;
    }
    
    const incomeValidation = validateIncome(income);
    const monthsValidation = validateMonths(months);

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

    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      let taxResult: TaxResult;
      
      if (selectedRegime === 'new') {
        taxResult = calculateTax(income, months);
      } else {
        const currentDeductions = oldRegimeDeductions;
        taxResult = calculateOldTaxRegime(income, months, currentDeductions);
      }
      
      setResults(taxResult);
      setShowResults(true);
      
      // Celebration effect
      const colors = ['hsl(var(--chart-2))', 'hsl(var(--chart-1))', 'hsl(var(--chart-4))', 'hsl(var(--destructive))', 'hsl(var(--chart-5))'];
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
        ticks: 200,
        gravity: 0.8,
        scalar: 1.0
      });

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
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      // Calculate both regimes
      const newRegimeResult = calculateTax(income, monthsWorked);
      const oldRegimeResult = calculateOldTaxRegime(income, monthsWorked, oldRegimeDeductions);
      
      // Determine recommendation
      const newRegimeTotalTax = newRegimeResult.totalTax;
      const oldRegimeTotalTax = oldRegimeResult.totalTax;
      const recommendation = newRegimeTotalTax <= oldRegimeTotalTax ? 'new' : 'old';
      const savings = Math.abs(newRegimeTotalTax - oldRegimeTotalTax);
      
      setComparisonResults({
        newRegime: newRegimeResult,
        oldRegime: oldRegimeResult,
        recommendation,
        savings
      });
      
      setShowComparison(true);
      
      // Show success message
      toast.success(`${recommendation === 'new' ? 'New' : 'Old'} regime saves ₹${formatIndianNumber(savings)} more!`);
      
    } catch (error) {
      toast.error("Error comparing tax regimes. Please try again.");
      console.error("Comparison error:", error);
    } finally {
      setIsCalculating(false);
    }
  }, [form, oldRegimeDeductions]);

  const handleDeductionsChange = useCallback((newDeductions: OldTaxRegimeInputs) => {
    setOldRegimeDeductions(newDeductions);
    setShowResults(false);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegimeChange = (regime: TaxRegime) => {
    if (regime === 'compare') {
      // Don't allow compare mode in multi-period for now
      return;
    }
    setSelectedRegime(regime);
    setShowResults(false);
  };

  const toggleJobChangeMode = () => {
    setHasJobChange(!hasJobChange);
    setShowResults(false);
    setResults(null);
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case "hero":
        return <Hero />;
        
      case "comparison":
        return <SalaryComparison />;
      
      case "regimes":
        return (
          <motion.div 
            key="regimes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <TaxRegimeSelector
              selectedRegime={selectedRegime}
              onRegimeChange={handleRegimeChange}
              income={parseIndianNumber(grossIncomeValue)}
              showComparison={true}
            />
          </motion.div>
        );
      
      case "guide":
        return (
          <motion.div 
            key="guide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
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
          </motion.div>
        );
      
      case "help":
        return (
          <motion.div 
            key="help"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <FAQPage />
          </motion.div>
        );
      
      case "about":
        return <About />;
      
      default: // calculator
        return (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container max-w-7xl mx-auto p-6 space-y-6"
          >
            {/* Main Calculator Section */}
            <div className="grid gap-6 lg:grid-cols-5">
              
              {/* Input Form - Left Side */}
              <div className="lg:col-span-2">
                <Card className="h-fit">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Calculator className="w-5 h-5 text-primary" />
                      Tax Calculator FY 2025-26
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Job Change Toggle */}
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold">
                          {hasJobChange ? "Job Change Mode" : "Single Job Mode"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {hasJobChange 
                            ? "Calculate tax for two different jobs in the same year"
                            : "Single job with one monthly salary"
                          }
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={toggleJobChangeMode}
                        className="shrink-0"
                      >
                        {hasJobChange ? "Switch to Single Job" : "Had Job Change?"}
                      </Button>
                    </div>
                    
                    {/* Form Content with Transitions */}
                    <AnimatePresence mode="wait">
                      {!hasJobChange && (
                        <motion.div
                          key="single-job"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                              
                              <div className="space-y-4">
                                {/* Income Input */}
                                <FormField
                                  control={form.control}
                                  name="grossIncome"
                                  render={({ field }) => (
                                    <FormItem className="space-y-2">
                                      <FormLabel>Annual Income</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</div>
                                          <Input
                                            {...field}
                                            placeholder="75,00,000"
                                            className="pl-8"
                                            onChange={(e) => {
                                              const numValue = parseIndianNumber(e.target.value);
                                              if (!isNaN(numValue)) {
                                                field.onChange(formatIndianNumber(numValue));
                                              }
                                            }}
                                          />
                                        </div>
                                      </FormControl>
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
                                          onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                      </FormControl>
                                      {field.value < 12 && field.value > 0 && (
                                        <FormDescription className="text-xs">
                                          Pro-rated for {field.value} months
                                        </FormDescription>
                                      )}
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              {/* Regime Selection */}
                              <div className="space-y-3">
                                <FormLabel className="text-base font-medium">Tax Regime</FormLabel>
                                <div className="grid grid-cols-2 gap-3">
                                  <Button
                                    type="button"
                                    variant={selectedRegime === 'new' ? 'default' : 'outline'}
                                    onClick={() => handleRegimeChange('new')}
                                    className="h-10"
                                  >
                                    New Regime
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={selectedRegime === 'old' ? 'default' : 'outline'}
                                    onClick={() => handleRegimeChange('old')}
                                    className="h-10"
                                  >
                                    Old Regime
                                  </Button>
                                </div>
                              </div>

                              {/* Calculate Button */}
                              <Button 
                                type="submit"
                                disabled={isCalculating}
                                className="w-full h-12 text-base font-medium"
                                size="lg"
                              >
                                {isCalculating ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                    Calculating...
                                  </>
                                ) : (
                                  <>
                                    <Calculator className="w-5 h-5 mr-2" />
                                    Calculate Tax
                                  </>
                                )}
                              </Button>
                            </form>
                          </Form>
                        </motion.div>
                      )}

                      {hasJobChange && (
                        <motion.div
                          key="job-change"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                              {/* Job Change Form */}
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <FormLabel className="text-base font-medium">Job Change Details</FormLabel>
                                  <p className="text-sm text-muted-foreground">Enter details for both jobs in the same financial year</p>
                                </div>
                                
                                {/* First Job Section */}
                                <div className="border border-border/50 rounded-lg p-4 space-y-4 bg-card/30">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-sm">1</div>
                                      <div>
                                        <h4 className="text-sm font-semibold">First Job</h4>
                                        <p className="text-xs text-muted-foreground">Previous position</p>
                                      </div>
                                    </div>
                                    {form.watch("firstJobStartDate") && form.watch("firstJobEndDate") && (
                                      <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                        {(() => {
                                          const startDate = form.watch("firstJobStartDate");
                                          const endDate = form.watch("firstJobEndDate");
                                          if (startDate && endDate) {
                                            return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
                                          }
                                          return 0;
                                        })()} months
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <FormField
                                      control={form.control}
                                      name="firstJobIncome"
                                      render={({ field }) => (
                                        <FormItem className="space-y-2">
                                          <FormLabel className="text-sm font-medium">Annual Salary</FormLabel>
                                          <FormControl>
                                            <div className="relative">
                                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">₹</div>
                                              <Input
                                                {...field}
                                                placeholder="7,20,000"
                                                className="pl-8 font-medium"
                                                onChange={(e) => {
                                                  const numValue = parseIndianNumber(e.target.value);
                                                  if (!isNaN(numValue)) {
                                                    field.onChange(formatIndianNumber(numValue));
                                                  }
                                                }}
                                              />
                                            </div>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <FormField
                                        control={form.control}
                                        name="firstJobStartDate"
                                        render={({ field }) => (
                                          <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium">Start Date</FormLabel>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <FormControl>
                                                  <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                      "w-full justify-start text-left font-normal",
                                                      !field.value && "text-muted-foreground"
                                                    )}
                                                  >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? (
                                                      format(field.value, "MMM dd, yyyy")
                                                    ) : (
                                                      <span>Select date</span>
                                                    )}
                                                  </Button>
                                                </FormControl>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                  mode="single"
                                                  selected={field.value}
                                                  onSelect={field.onChange}
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name="firstJobEndDate"
                                        render={({ field }) => (
                                          <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium">End Date</FormLabel>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <FormControl>
                                                  <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                      "w-full justify-start text-left font-normal",
                                                      !field.value && "text-muted-foreground"
                                                    )}
                                                  >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? (
                                                      format(field.value, "MMM dd, yyyy")
                                                    ) : (
                                                      <span>Select date</span>
                                                    )}
                                                  </Button>
                                                </FormControl>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                  mode="single"
                                                  selected={field.value}
                                                  onSelect={field.onChange}
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Second Job Section */}
                                <div className="border border-border/50 rounded-lg p-4 space-y-4 bg-card/30">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-7 h-7 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-sm">2</div>
                                      <div>
                                        <h4 className="text-sm font-semibold">Second Job</h4>
                                        <p className="text-xs text-muted-foreground">Current position</p>
                                      </div>
                                    </div>
                                    {form.watch("secondJobStartDate") && form.watch("secondJobEndDate") && (
                                      <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                        {(() => {
                                          const startDate = form.watch("secondJobStartDate");
                                          const endDate = form.watch("secondJobEndDate");
                                          if (startDate && endDate) {
                                            return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
                                          }
                                          return 0;
                                        })()} months
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <FormField
                                      control={form.control}
                                      name="secondJobIncome"
                                      render={({ field }) => (
                                        <FormItem className="space-y-2">
                                          <FormLabel className="text-sm font-medium">Annual Salary</FormLabel>
                                          <FormControl>
                                            <div className="relative">
                                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">₹</div>
                                              <Input
                                                {...field}
                                                placeholder="9,60,000"
                                                className="pl-8 font-medium"
                                                onChange={(e) => {
                                                  const numValue = parseIndianNumber(e.target.value);
                                                  if (!isNaN(numValue)) {
                                                    field.onChange(formatIndianNumber(numValue));
                                                  }
                                                }}
                                              />
                                            </div>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <FormField
                                        control={form.control}
                                        name="secondJobStartDate"
                                        render={({ field }) => (
                                          <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium">Start Date</FormLabel>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <FormControl>
                                                  <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                      "w-full justify-start text-left font-normal",
                                                      !field.value && "text-muted-foreground"
                                                    )}
                                                  >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? (
                                                      format(field.value, "MMM dd, yyyy")
                                                    ) : (
                                                      <span>Select date</span>
                                                    )}
                                                  </Button>
                                                </FormControl>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                  mode="single"
                                                  selected={field.value}
                                                  onSelect={field.onChange}
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name="secondJobEndDate"
                                        render={({ field }) => (
                                          <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium">End Date</FormLabel>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <FormControl>
                                                  <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                      "w-full justify-start text-left font-normal",
                                                      !field.value && "text-muted-foreground"
                                                    )}
                                                  >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? (
                                                      format(field.value, "MMM dd, yyyy")
                                                    ) : (
                                                      <span>Select date</span>
                                                    )}
                                                  </Button>
                                                </FormControl>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                  mode="single"
                                                  selected={field.value}
                                                  onSelect={field.onChange}
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Regime Selection */}
                              <div className="space-y-3">
                                <FormLabel className="text-base font-medium">Tax Regime</FormLabel>
                                <div className="grid grid-cols-2 gap-3">
                                  <Button
                                    type="button"
                                    variant={selectedRegime === 'new' ? 'default' : 'outline'}
                                    onClick={() => handleRegimeChange('new')}
                                    className="h-10"
                                  >
                                    New Regime
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={selectedRegime === 'old' ? 'default' : 'outline'}
                                    onClick={() => handleRegimeChange('old')}
                                    className="h-10"
                                  >
                                    Old Regime
                                  </Button>
                                </div>
                              </div>

                              {/* Calculate Button */}
                              <Button 
                                type="submit"
                                disabled={isCalculating}
                                className="w-full h-12 text-base font-medium"
                                size="lg"
                              >
                                {isCalculating ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                    Calculating Tax...
                                  </>
                                ) : (
                                  <>
                                    <Calculator className="w-5 h-5 mr-2" />
                                    Calculate Tax for Job Change
                                  </>
                                )}
                              </Button>
                            </form>
                          </Form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>

              {/* Results Section - Right Side */}
              <div className="lg:col-span-3">
                {/* Quick Results */}
                {showResults && results && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Main Results Card */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">Gross Income</p>
                            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                              {formatCurrency(results.effectiveIncome)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">Total Tax</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {formatCurrency(results.totalTax)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">Net Take Home</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(results.afterTaxAnnual)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">Effective Rate</p>
                            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                              {formatPercentage(results.effectiveTaxRate)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Progressive Disclosure Options */}
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Detailed Breakdown */}
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              Detailed breakdown
                            </div>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="mt-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span>Gross Income:</span>
                                  <span className="font-medium">{formatCurrency(results.effectiveIncome)}</span>
                                </div>
                                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                  <span>Less: Standard Deduction:</span>
                                  <span className="font-medium">-{formatCurrency(results.standardDeduction)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                  <span>Taxable Income:</span>
                                  <span className="font-medium">{formatCurrency(results.taxableIncome)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Basic Tax:</span>
                                  <span className="font-medium">{formatCurrency(results.basicTax)}</span>
                                </div>
                                {results.rebate > 0 && (
                                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                    <span>Less: Rebate u/s 87A:</span>
                                    <span className="font-medium">-{formatCurrency(results.rebate)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>Health & Education Cess (4%):</span>
                                  <span className="font-medium">{formatCurrency(results.cess)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 font-semibold">
                                  <span>Total Tax:</span>
                                  <span className="text-orange-600 dark:text-orange-400">{formatCurrency(results.totalTax)}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Compare Regimes */}
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Compare regimes
                            </div>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="mt-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <Button 
                                  onClick={handleCompareRegimes}
                                  disabled={isCalculating}
                                  className="w-full"
                                >
                                  Generate Comparison
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Results will show as a notification
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>

                    {/* Optimize Deductions - Only for Old Regime */}
                    {selectedRegime === 'old' && (
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              Optimize deductions
                            </div>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="mt-4">
                          <TooltipProvider>
                            <SmartDeductionsWizard
                              deductions={oldRegimeDeductions}
                              onDeductionsChange={handleDeductionsChange}
                              grossIncome={parseIndianNumber(grossIncomeValue)}
                            />
                          </TooltipProvider>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </motion.div>
                )}

                {/* Comprehensive Comparison Results */}
                {showComparison && comparisonResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Target className="w-5 h-5 text-primary" />
                          Tax Regime Comparison
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Recommendation Banner */}
                        <div className={`p-4 rounded-lg border-2 ${
                          comparisonResults.recommendation === 'new' 
                            ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800' 
                            : 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className={`font-semibold ${
                                comparisonResults.recommendation === 'new' 
                                  ? 'text-emerald-800 dark:text-emerald-200' 
                                  : 'text-blue-800 dark:text-blue-200'
                              }`}>
                                {comparisonResults.recommendation === 'new' ? 'New Tax Regime' : 'Old Tax Regime'} is Better
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                You save ₹{formatIndianNumber(comparisonResults.savings)} annually
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              comparisonResults.recommendation === 'new' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              Recommended
                            </div>
                          </div>
                        </div>

                        {/* Side-by-Side Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* New Regime */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                              <h4 className="font-semibold">New Tax Regime</h4>
                            </div>
                            <div className="space-y-3 p-4 bg-card rounded-lg border">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Taxable Income:</span>
                                <span className="text-sm font-medium">{formatCurrency(comparisonResults.newRegime.taxableIncome)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Basic Tax:</span>
                                <span className="text-sm font-medium">{formatCurrency(comparisonResults.newRegime.basicTax)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Cess (4%):</span>
                                <span className="text-sm font-medium">{formatCurrency(comparisonResults.newRegime.cess)}</span>
                              </div>
                              <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Total Tax:</span>
                                <span className="text-orange-600 dark:text-orange-400">{formatCurrency(comparisonResults.newRegime.totalTax)}</span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span>Net Take Home:</span>
                                <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(comparisonResults.newRegime.afterTaxAnnual)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Old Regime */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <h4 className="font-semibold">Old Tax Regime</h4>
                            </div>
                            <div className="space-y-3 p-4 bg-card rounded-lg border">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Taxable Income:</span>
                                <span className="text-sm font-medium">{formatCurrency(comparisonResults.oldRegime.taxableIncome)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Basic Tax:</span>
                                <span className="text-sm font-medium">{formatCurrency(comparisonResults.oldRegime.basicTax)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Cess (4%):</span>
                                <span className="text-sm font-medium">{formatCurrency(comparisonResults.oldRegime.cess)}</span>
                              </div>
                              <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Total Tax:</span>
                                <span className="text-orange-600 dark:text-orange-400">{formatCurrency(comparisonResults.oldRegime.totalTax)}</span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span>Net Take Home:</span>
                                <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(comparisonResults.oldRegime.afterTaxAnnual)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Empty State */}
                {!showResults && (
                  <Card className="border-dashed border-2 h-96 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Enter your income details</p>
                      <p className="text-sm">Results will appear here after calculation</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden">
      {/* Background Effects - Similar to Hero Page */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-10 blur-3xl bg-gradient-to-r from-violet-500 to-purple-500" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-10 blur-3xl bg-gradient-to-r from-blue-500 to-indigo-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl bg-gradient-to-r from-pink-500 to-rose-500" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(100, 100, 100, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 100, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {renderPageContent()}
        </AnimatePresence>
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