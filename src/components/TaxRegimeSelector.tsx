"use client";

import { Card, CardContent } from "@/components/ui/card";

export type TaxRegime = 'new' | 'old' | 'compare';

interface TaxRegimeSelectorProps {
  selectedRegime: TaxRegime;
  onRegimeChange: (regime: TaxRegime) => void;
  income?: number;
  showComparison?: boolean;
}

export function TaxRegimeSelector({ 
  selectedRegime, 
  onRegimeChange
}: TaxRegimeSelectorProps) {
  const handleCardClick = (regime: TaxRegime) => {
    onRegimeChange(regime);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold">
          Select the tax regime that best fits your needs
        </h3>
      </div>

      {/* Regime Selector Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* New Tax Regime */}
        <Card 
          className={`cursor-pointer transition-all duration-200 h-full ${
            selectedRegime === 'new'
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-muted-foreground'
          }`}
          onClick={() => handleCardClick('new')}
        >
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-start space-x-3">
              {/* Radio Button Indicator */}
              <div className="flex items-center mt-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedRegime === 'new'
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                }`}>
                  {selectedRegime === 'new' && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-2">
                <h4 className="text-lg font-semibold">
                  New Tax Regime
                </h4>
                <p className="text-sm text-muted-foreground">
                  Perfect for salaried employees with minimal investments.
                </p>
                <p className="text-sm text-muted-foreground">
                  Lower tax rates with simplified filing process.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Old Tax Regime */}
        <Card 
          className={`cursor-pointer transition-all duration-200 h-full ${
            selectedRegime === 'old'
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-muted-foreground'
          }`}
          onClick={() => handleCardClick('old')}
        >
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-start space-x-3">
              {/* Radio Button Indicator */}
              <div className="flex items-center mt-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedRegime === 'old'
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                }`}>
                  {selectedRegime === 'old' && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-2">
                <h4 className="text-lg font-semibold">
                  Old Tax Regime
                </h4>
                <p className="text-sm text-muted-foreground">
                  More deductions and investment options.
                </p>
                <p className="text-sm text-muted-foreground">
                  Better for those with significant investments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compare Both */}
        <Card 
          className={`cursor-pointer transition-all duration-200 h-full ${
            selectedRegime === 'compare'
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-muted-foreground'
          }`}
          onClick={() => handleCardClick('compare')}
        >
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-start space-x-3">
              {/* Radio Button Indicator */}
              <div className="flex items-center mt-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedRegime === 'compare'
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                }`}>
                  {selectedRegime === 'compare' && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-2">
                <h4 className="text-lg font-semibold">
                  Compare Both
                </h4>
                <p className="text-sm text-muted-foreground">
                  See detailed comparison between both regimes.
                </p>
                <p className="text-sm text-muted-foreground">
                  Find the best option for your specific situation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 