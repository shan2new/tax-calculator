"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Plus, 
  Trash2, 
  DollarSign, 
  Target
} from "lucide-react";
import { calculateTax, calculateOldTaxRegime, type TaxResult, type OldTaxRegimeInputs } from "@/lib/taxCalculations";
import { formatIndianNumber, parseIndianNumber, formatPercentage } from "@/lib/formatters";

interface SalaryOption {
  id: string;
  label: string;
  amount: number;
  colorClass: string;
}

interface ComparisonData {
  salary: number;
  newRegime: TaxResult;
  oldRegime: TaxResult;
  recommendation: 'new' | 'old';
}

export function SalaryComparison() {
  const [salaryOptions, setSalaryOptions] = useState<SalaryOption[]>([
    { id: '1', label: 'Current Salary', amount: 1200000, colorClass: 'bg-primary' },
    { id: '2', label: 'Offer 1', amount: 1500000, colorClass: 'bg-chart-1' },
    { id: '3', label: 'Offer 2', amount: 1800000, colorClass: 'bg-chart-5' }
  ]);
  
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedView, setSelectedView] = useState<'both' | 'new' | 'old'>('both');

  // Default deductions for old regime calculations
  const defaultDeductions: OldTaxRegimeInputs = {
    section80C: 150000,
    section80D: 25000,
    hraReceived: 0,
    rentPaid: 0,
    isMetroCity: true,
    homeLoanInterest: 100000,
    section80E: 0,
    section80G: 10000,
    section80EE: 0,
    section80EEA: 0,
    section80TTA: 10000
  };

  useEffect(() => {
    calculateComparisons();
  }, [salaryOptions]);

  const calculateComparisons = async () => {
    setIsCalculating(true);
    
    const comparisons: ComparisonData[] = [];
    
    for (const salary of salaryOptions) {
      const newRegimeResult = calculateTax(salary.amount, 12);
      const oldRegimeResult = calculateOldTaxRegime(salary.amount, 12, defaultDeductions);
      
      const recommendation = newRegimeResult.totalTax <= oldRegimeResult.totalTax ? 'new' : 'old';
      
      comparisons.push({
        salary: salary.amount,
        newRegime: newRegimeResult,
        oldRegime: oldRegimeResult,
        recommendation
      });
    }
    
    setComparisonData(comparisons);
    setIsCalculating(false);
  };

  const addSalaryOption = () => {
    const colors = ['bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-destructive', 'bg-secondary'];
    const newOption: SalaryOption = {
      id: Date.now().toString(),
      label: `Option ${salaryOptions.length + 1}`,
      amount: 1000000,
      colorClass: colors[salaryOptions.length % colors.length]
    };
    setSalaryOptions([...salaryOptions, newOption]);
  };

  const removeSalaryOption = (id: string) => {
    if (salaryOptions.length > 1) {
      setSalaryOptions(salaryOptions.filter(option => option.id !== id));
    }
  };

  const updateSalaryOption = (id: string, updates: Partial<SalaryOption>) => {
    setSalaryOptions(salaryOptions.map(option => 
      option.id === id ? { ...option, ...updates } : option
    ));
  };

  const getBestOption = () => {
    if (comparisonData.length === 0) return null;
    
    return comparisonData.reduce((best, current) => {
      const bestTakeHome = selectedView === 'new' ? best.newRegime.afterTaxAnnual :
                          selectedView === 'old' ? best.oldRegime.afterTaxAnnual :
                          Math.max(best.newRegime.afterTaxAnnual, best.oldRegime.afterTaxAnnual);
      
      const currentTakeHome = selectedView === 'new' ? current.newRegime.afterTaxAnnual :
                             selectedView === 'old' ? current.oldRegime.afterTaxAnnual :
                             Math.max(current.newRegime.afterTaxAnnual, current.oldRegime.afterTaxAnnual);
      
      return currentTakeHome > bestTakeHome ? current : best;
    });
  };

  const ComparisonCard = ({ data, option }: { data: ComparisonData; option: SalaryOption }) => {
    const isNewBetter = data.newRegime.afterTaxAnnual > data.oldRegime.afterTaxAnnual;
    const bestOption = getBestOption();
    const isBestOverall = bestOption?.salary === data.salary;

    return (
      <Card className={`transition-all duration-300 ${
        isBestOverall 
          ? 'border-chart-1 ring-1 ring-chart-1/20' 
          : ''
      }`}>
        {isBestOverall && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-chart-1 text-primary-foreground">
              <Target className="w-3 h-3 mr-1" />
              Best Choice
            </Badge>
          </div>
        )}

        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${option.colorClass}`} />
              <CardTitle className="text-lg">
                {option.label}
              </CardTitle>
            </div>
            {salaryOptions.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSalaryOption(option.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-2xl font-semibold text-foreground">
            ₹{formatIndianNumber(data.salary)}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {(selectedView === 'both' || selectedView === 'new') && (
              <div className={`p-3 rounded-lg ${
                selectedView === 'both' && isNewBetter 
                  ? 'border border-chart-1 bg-chart-1/5' 
                  : 'border bg-muted/50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-muted-foreground">New Regime</span>
                  {selectedView === 'both' && isNewBetter && <Badge variant="outline" className="text-xs">Better</Badge>}
                </div>
                <p className="text-lg font-semibold text-foreground">
                  ₹{formatIndianNumber(data.newRegime.afterTaxAnnual)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tax: ₹{formatIndianNumber(data.newRegime.totalTax)} ({formatPercentage(data.newRegime.effectiveTaxRate)})
                </p>
              </div>
            )}

            {(selectedView === 'both' || selectedView === 'old') && (
              <div className={`p-3 rounded-lg ${
                selectedView === 'both' && !isNewBetter 
                  ? 'border border-chart-2 bg-chart-2/5' 
                  : 'border bg-muted/50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-muted-foreground">Old Regime</span>
                  {selectedView === 'both' && !isNewBetter && <Badge variant="outline" className="text-xs">Better</Badge>}
                </div>
                <p className="text-lg font-semibold text-foreground">
                  ₹{formatIndianNumber(data.oldRegime.afterTaxAnnual)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tax: ₹{formatIndianNumber(data.oldRegime.totalTax)} ({formatPercentage(data.oldRegime.effectiveTaxRate)})
                </p>
              </div>
            )}
          </div>

          {/* Monthly Breakdown */}
          <div className="pt-3 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-2">Monthly Take-Home</p>
            <div className="space-y-1">
              {(selectedView === 'both' || selectedView === 'new') && (
                <div className="flex justify-between">
                  <span className="text-sm">New Regime:</span>
                  <span className="font-medium">₹{formatIndianNumber(data.newRegime.afterTaxMonthly)}</span>
                </div>
              )}
              {(selectedView === 'both' || selectedView === 'old') && (
                <div className="flex justify-between">
                  <span className="text-sm">Old Regime:</span>
                  <span className="font-medium">₹{formatIndianNumber(data.oldRegime.afterTaxMonthly)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            Salary Comparison Tool
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare different salary options to make informed career decisions. See how various income levels 
            affect your take-home pay under both tax regimes.
          </p>
        </div>
      </div>

      {/* Salary Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl text-primary-foreground">
              <DollarSign className="w-5 h-5" />
            </div>
            Salary Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salaryOptions.map((option) => (
              <div key={option.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${option.colorClass}`} />
                  <Input
                    value={option.label}
                    onChange={(e) => updateSalaryOption(option.id, { label: e.target.value })}
                    className="text-sm font-medium"
                    placeholder="Option name"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">₹</div>
                  <Input
                    type="text"
                    value={formatIndianNumber(option.amount)}
                    onChange={(e) => {
                      const value = parseIndianNumber(e.target.value);
                      if (!isNaN(value)) {
                        updateSalaryOption(option.id, { amount: value });
                      }
                    }}
                    className="pl-8 text-lg font-medium"
                    placeholder="12,00,000"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={addSalaryOption}
              className="flex items-center gap-2"
              disabled={salaryOptions.length >= 6}
            >
              <Plus className="w-4 h-4" />
              Add Option
            </Button>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {(['both', 'new', 'old'] as const).map((view) => (
                <Button
                  key={view}
                  variant={selectedView === view ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedView(view)}
                  className="text-xs"
                >
                  {view === 'both' ? 'Compare' : view === 'new' ? 'New Regime' : 'Old Regime'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {isCalculating ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Calculating comparisons...</span>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparisonData.map((data, index) => (
            <ComparisonCard
              key={salaryOptions[index].id}
              data={data}
              option={salaryOptions[index]}
            />
          ))}
        </div>
      )}

      {/* Summary Insights */}
      {comparisonData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-chart-4 rounded-xl text-primary-foreground">
                <TrendingUp className="w-5 h-5" />
              </div>
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getBestOption() && (
                <div className="p-4 bg-chart-1/10 rounded-lg border border-chart-1/20">
                  <h4 className="font-semibold text-chart-1 mb-2">Best Overall Choice</h4>
                  <p className="text-sm text-muted-foreground">
                    {salaryOptions.find(opt => opt.amount === getBestOption()?.salary)?.label} 
                    {' '}at ₹{formatIndianNumber(getBestOption()!.salary)} offers the highest take-home pay.
                  </p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-chart-2/10 rounded-lg border border-chart-2/20">
                  <h4 className="font-semibold text-chart-2 mb-2">Tax Efficiency</h4>
                  <p className="text-sm text-muted-foreground">
                    Higher salaries may push you into higher tax brackets. Consider the marginal tax rate impact.
                  </p>
                </div>

                <div className="p-4 bg-chart-5/10 rounded-lg border border-chart-5/20">
                  <h4 className="font-semibold text-chart-5 mb-2">Regime Choice</h4>
                  <p className="text-sm text-muted-foreground">
                    The optimal tax regime may change with different salary levels. Plan accordingly.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 