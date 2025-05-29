"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Calculator, DollarSign, PieChart, ArrowUp, CheckCircle, InfoIcon, Target, Sparkles } from "lucide-react";
import { calculateTax, type TaxResult } from "@/lib/taxCalculations";
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
import ReactCountryFlag from "react-country-flag";

export function TaxCalculator() {
  const [grossIncome, setGrossIncome] = useState<string>("75,00,000");
  const [monthsWorked, setMonthsWorked] = useState<number>(12);
  const [results, setResults] = useState<TaxResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [amountInWords, setAmountInWords] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Update amount in words when income changes
  useEffect(() => {
    const income = parseIndianNumber(grossIncome);
    if (income > 0) {
      setAmountInWords(convertToWords(income));
    } else {
      setAmountInWords("");
    }
  }, [grossIncome]);

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

  const handleIncomeChange = (value: string) => {
    const numValue = parseIndianNumber(value);
    if (!isNaN(numValue)) {
      setGrossIncome(formatIndianNumber(numValue));
    }
  };

  const handleCalculate = useCallback(async () => {
    const income = parseIndianNumber(grossIncome);
    const incomeValidation = validateIncome(income);
    const monthsValidation = validateMonths(monthsWorked);

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
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const taxResult = calculateTax(income, monthsWorked);
      setResults(taxResult);
      setShowResults(true);
      
      // Success feedback
      toast.success("✓ Tax calculation completed successfully!");
      
      // Enhanced celebration effect
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
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
  }, [grossIncome, monthsWorked]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getValidationMessage = (type: 'income' | 'months') => {
    if (type === 'income') {
      const income = parseIndianNumber(grossIncome);
      return validateIncome(income);
    } else {
      return validateMonths(monthsWorked);
    }
  };

  const getTaxEfficiencyColor = (rate: number) => {
    if (rate <= 10) return "from-green-500 to-emerald-500";
    if (rate <= 20) return "from-blue-500 to-cyan-500";
    if (rate <= 30) return "from-yellow-500 to-orange-500";
    return "from-orange-500 to-red-500";
  };

  const getTaxEfficiencyText = (rate: number) => {
    if (rate <= 10) return "Excellent tax efficiency";
    if (rate <= 20) return "Good tax efficiency";
    if (rate <= 30) return "Moderate tax efficiency";
    return "Consider tax planning";
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20 dark:from-blue-900/10 dark:via-transparent dark:to-indigo-900/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        
        {/* Header */}
        <motion.div 
          className="relative z-10 text-center py-8 sm:py-12 lg:py-16 px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 sm:mb-6"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-medium lg:font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 lg:mb-6 leading-tight flex items-center justify-center gap-3 sm:gap-4">
              <ReactCountryFlag 
                countryCode="IN" 
                svg 
                style={{
                  width: '1.8em',
                  height: '1.35em',
                }}
                className="shadow-lg rounded-sm"
              />
              Indian Income Tax Calculator
            </h1>
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-display font-normal md:font-medium text-gray-700 dark:text-gray-300 mb-2">
              Financial Year 2025-26
            </div>
          </motion.div>
          
          <motion.p 
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Calculate your income tax liability under Indian New Tax Regime
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Badge 
              variant="outline" 
              className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-base font-normal shadow-lg"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              New Tax Regime - FY 2025-26
            </Badge>
          </motion.div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 pb-12 sm:pb-16">
          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="mb-8 sm:mb-12 shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl ring-1 ring-gray-200/50 dark:ring-gray-700/50 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              
              <CardHeader className="pb-6 sm:pb-8">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-display font-medium lg:font-semibold text-gray-800 dark:text-gray-100">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
                    <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  Tax Calculator
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6 sm:space-y-8">
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Income Input */}
                  <motion.div 
                    className="space-y-3 sm:space-y-4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Label htmlFor="income" className="text-base sm:text-lg font-normal md:font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <span className="text-xl sm:text-2xl">💰</span>
                      Annual Income
                    </Label>
                    
                    <div className="relative group">
                      <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 font-normal md:font-medium text-base sm:text-lg z-10">
                        ₹
                      </span>
                      <Input
                        id="income"
                        type="text"
                        value={grossIncome}
                        onChange={(e) => handleIncomeChange(e.target.value)}
                        onFocus={() => setFocusedInput('income')}
                        onBlur={() => setFocusedInput(null)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
                        className={`pl-8 sm:pl-10 pr-4 sm:pr-6 py-6 sm:py-8 text-lg sm:text-xl font-normal md:font-medium border-2 transition-all duration-300 bg-white dark:bg-gray-800 ${
                          focusedInput === 'income' 
                            ? 'border-blue-500 shadow-lg ring-4 ring-blue-500/20 scale-[1.02]' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        placeholder="0"
                      />
                      
                      {focusedInput === 'income' && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        />
                      )}
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <InfoIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                        Your total annual income from all sources (salary, business, freelance, etc.)
                      </p>
                    </div>
                    
                    <AnimatePresence>
                      {getValidationMessage('income').message && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={`p-3 rounded-lg border-l-4 ${
                            getValidationMessage('income').type === 'success' 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-700 dark:text-green-300' :
                            getValidationMessage('income').type === 'warning' 
                              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-700 dark:text-yellow-300' :
                              'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-700 dark:text-red-300'
                          }`}>
                            <p className="text-sm font-medium">
                              {getValidationMessage('income').message}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <AnimatePresence>
                      {amountInWords && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -15, scale: 0.95 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl shadow-sm"
                        >
                          <p className="text-sm text-blue-800 dark:text-blue-300 font-normal leading-relaxed">{amountInWords}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Months Input */}
                  <motion.div 
                    className="space-y-3 sm:space-y-4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Label htmlFor="months" className="text-base sm:text-lg font-normal md:font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <span className="text-xl sm:text-2xl">📅</span>
                      Income Period (Months)
                    </Label>
                    
                    <div className="relative group">
                      <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 text-base sm:text-lg z-10">
                        📅
                      </span>
                      <Input
                        id="months"
                        type="number"
                        min="1"
                        max="12"
                        value={monthsWorked}
                        onChange={(e) => setMonthsWorked(parseInt(e.target.value) || 12)}
                        onFocus={() => setFocusedInput('months')}
                        onBlur={() => setFocusedInput(null)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
                        className={`pl-10 sm:pl-12 pr-4 sm:pr-6 py-6 sm:py-8 text-lg sm:text-xl font-normal md:font-medium border-2 transition-all duration-300 bg-white dark:bg-gray-800 ${
                          focusedInput === 'months' 
                            ? 'border-blue-500 shadow-lg ring-4 ring-blue-500/20 scale-[1.02]' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      />
                      
                      {focusedInput === 'months' && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        />
                      )}
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <InfoIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                        Number of months you earned income (useful for partial year calculations)
                      </p>
                    </div>
                    
                    <AnimatePresence>
                      {getValidationMessage('months').message && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={`p-3 rounded-lg border-l-4 ${
                            getValidationMessage('months').type === 'success' 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-700 dark:text-green-300' :
                            getValidationMessage('months').type === 'warning' 
                              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-700 dark:text-yellow-300' :
                              'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-700 dark:text-red-300'
                          }`}>
                            <p className="text-sm font-medium">
                              {getValidationMessage('months').message}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="pt-2 sm:pt-4"
                >
                  <Button 
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="w-full py-6 sm:py-8 text-lg sm:text-xl font-normal md:font-medium bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isCalculating ? (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Calculating your tax...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Calculate Tax</span>
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {showResults && results && (
              <motion.div
                id="results"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -60 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6 sm:space-y-8"
              >
                {/* Tax Summary */}
                <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ring-1 ring-gray-200/50 dark:ring-gray-700/50 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
                  
                  <CardHeader className="pb-4 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-display font-medium lg:font-semibold text-gray-800 dark:text-gray-100">
                      <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white shadow-lg">
                        <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      Tax Summary
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
                      {[
                        {
                          label: "Effective Income",
                          value: formatCurrency(results.effectiveIncome),
                          icon: "💰",
                          tooltip: "Income after standard deduction",
                          gradient: "from-blue-500 to-cyan-500"
                        },
                        {
                          label: "Tax Payable (Annual)",
                          value: formatCurrency(results.totalTax),
                          icon: "📊",
                          tooltip: "Total tax to be paid for the year",
                          gradient: "from-purple-500 to-pink-500"
                        },
                        {
                          label: "Tax Payable (Monthly)",
                          value: formatCurrency(results.totalTax / monthsWorked),
                          icon: "📅",
                          tooltip: "Monthly tax deduction from salary",
                          gradient: "from-indigo-500 to-purple-500"
                        },
                        {
                          label: "Take Home (Annual)",
                          value: formatCurrency(results.afterTaxAnnual),
                          icon: "💎",
                          tooltip: "Your income after all tax deductions",
                          gradient: "from-green-500 to-emerald-500"
                        },
                        {
                          label: "Take Home (Monthly)",
                          value: formatCurrency(results.afterTaxMonthly),
                          icon: "🏦",
                          tooltip: "Your monthly take-home salary",
                          gradient: "from-teal-500 to-green-500",
                          showSavings: results.effectiveTaxRate < 15
                        },
                        {
                          label: "Effective Tax Rate",
                          value: formatPercentage(results.effectiveTaxRate),
                          icon: "📈",
                          tooltip: "Percentage of income paid as tax",
                          gradient: getTaxEfficiencyColor(results.effectiveTaxRate),
                          progress: results.effectiveTaxRate,
                          efficiency: getTaxEfficiencyText(results.effectiveTaxRate)
                        }
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full"
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300 cursor-help border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 group relative overflow-hidden bg-white dark:bg-gray-800 h-full flex flex-col">
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                                
                                <div className="relative z-10 flex flex-col h-full">
                                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className={`p-1.5 sm:p-2 bg-gradient-to-br ${item.gradient} rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                                      <span className="text-base sm:text-lg font-normal">{item.icon}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-normal text-gray-600 dark:text-gray-400 uppercase tracking-wide line-clamp-2">{item.label}</p>
                                  </div>
                                  
                                  <p className="text-lg sm:text-xl lg:text-2xl font-display font-medium lg:font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:scale-105 transition-transform duration-300 flex-grow flex items-center">
                                    {item.value}
                                  </p>
                                  
                                  <div className="mt-auto space-y-2">
                                    {item.efficiency && (
                                      <p className={`text-xs sm:text-sm font-normal mb-2 ${
                                        results.effectiveTaxRate <= 10 ? 'text-green-600 dark:text-green-400' :
                                        results.effectiveTaxRate <= 20 ? 'text-blue-600 dark:text-blue-400' :
                                        results.effectiveTaxRate <= 30 ? 'text-yellow-600 dark:text-yellow-400' :
                                        'text-orange-600 dark:text-orange-400'
                                      }`}>
                                        {item.efficiency}
                                      </p>
                                    )}
                                    
                                    {item.progress !== undefined && (
                                      <div>
                                        <Progress 
                                          value={Math.min(item.progress, 40)} 
                                          className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700" 
                                        />
                                      </div>
                                    )}
                                    
                                    {item.showSavings && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 }}
                                      >
                                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600 font-normal text-xs sm:text-sm">
                                          <Target className="w-3 h-3 mr-1" />
                                          Excellent tax efficiency!
                                        </Badge>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 border-gray-700 dark:border-gray-300">
                              <p className="font-medium">{item.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tax Breakdown */}
                <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ring-1 ring-gray-200/50 dark:ring-gray-700/50 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
                  
                  <CardHeader className="pb-4 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-display font-medium lg:font-semibold text-gray-800 dark:text-gray-100">
                      <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white shadow-lg">
                        <PieChart className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      Detailed Tax Breakdown
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 sm:space-y-4">
                    {[
                      { label: "Gross Income", value: results.effectiveIncome, isPositive: true, icon: "💼" },
                      { label: "Less: Standard Deduction", value: -results.standardDeduction, isDeduction: true, icon: "💰" },
                      { label: "Taxable Income", value: results.taxableIncome, isPositive: true, icon: "📋" },
                      { label: "Basic Tax", value: results.basicTax, isPositive: true, icon: "🧮" },
                      ...(results.rebate > 0 ? [{ label: "Less: Rebate u/s 87A", value: -results.rebate, isDeduction: true, icon: "🎁" }] : []),
                      { label: "Tax after Rebate", value: results.taxAfterRebate, isPositive: true, icon: "📊" },
                      ...(results.surcharge > 0 ? [{ label: `Add: Surcharge (${results.surchargeRate}%)`, value: results.surcharge, isPositive: true, icon: "⚡" }] : []),
                      ...(results.marginalRelief > 0 ? [{ label: "Less: Marginal Relief", value: -results.marginalRelief, isDeduction: true, icon: "🛡️" }] : []),
                      { label: "Add: Health & Education Cess (4%)", value: results.cess, isPositive: true, icon: "🏥" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-base sm:text-lg group-hover:scale-110 transition-transform duration-200">
                            {item.icon}
                          </span>
                          <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-normal">{item.label}</span>
                        </div>
                        <span className={`font-normal md:font-medium text-base sm:text-lg lg:text-xl ${
                          item.isDeduction ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'
                        } group-hover:scale-105 transition-transform duration-200`}>
                          {formatCurrency(Math.abs(item.value))}
                        </span>
                      </motion.div>
                    ))}
                    
                    <Separator className="my-4 sm:my-6 dark:bg-gray-700" />
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="flex justify-between items-center py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl px-4 sm:px-6 border-2 border-blue-200 dark:border-blue-700 shadow-lg"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white">
                          <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span className="text-lg sm:text-xl font-display font-medium lg:font-semibold text-gray-900 dark:text-gray-100">Total Tax Payable</span>
                      </div>
                      <span className="text-xl sm:text-2xl font-display font-medium lg:font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(results.totalTax)}</span>
                    </motion.div>

                    {/* Tax Slabs Breakdown */}
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-lg sm:text-xl font-display font-normal md:font-medium mb-4 sm:mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <span className="text-lg sm:text-xl">🎯</span>
                        Tax Slab Calculation Details
                      </h4>
                      <div className="space-y-3 sm:space-y-4">
                        {results.slabDetails.map((slab, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className={`p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 relative overflow-hidden ${
                              slab.active 
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-600 shadow-lg hover:shadow-xl' 
                                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            {slab.active && (
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
                            )}
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2 sm:gap-3">
                                {slab.active && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                  >
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                                  </motion.div>
                                )}
                                <span className={`font-normal md:font-medium text-sm sm:text-base lg:text-lg ${slab.active ? 'text-green-800 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {slab.range} @ {slab.rate}
                                </span>
                              </div>
                              <span className={`font-normal md:font-medium text-base sm:text-lg lg:text-xl ${slab.active ? 'text-green-800 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                {formatCurrency(slab.tax)}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 z-50 group"
            >
              <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
} 