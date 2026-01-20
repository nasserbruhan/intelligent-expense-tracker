
export interface ExpenseRecord {
  date: string;
  description: string;
  amount: number;
  category?: string;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisReport {
  categorizationSummary: ExpenseRecord[];
  topCategories: CategorySummary[];
  recurringExpenses: string[];
  spendingSpikes: string[];
  monthlyTrends: {
    month: string;
    change: string;
    trend: 'rising' | 'declining' | 'stable';
  }[];
  predictions: {
    nextMonthTotal: number;
    highRiskCategories: string[];
    stableCategories: string[];
  };
  keyInsights: string[];
  recommendations: string[];
  groundingSources: GroundingSource[];
}

export interface ChartData {
  name: string;
  value: number;
}
