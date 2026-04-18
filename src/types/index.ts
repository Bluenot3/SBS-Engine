export type BusinessScale = "solopreneur" | "startup" | "small" | "mid-sized" | "multi-location" | "enterprise" | "franchise" | "nonprofit" | "government";
export type OperatingModel = "centralized" | "decentralized" | "hybrid" | "field-based";
export type PrioritizationCategory = 'Can do now' | 'Should do next' | 'Requires infrastructure first' | 'Not worth doing yet';

export interface BusinessContext {
  name: string;
  industry: string;
  scale: BusinessScale;
  locationCount: number;
  operatingModel: OperatingModel;
  currentStack: string;
  painPoints: string;
  goals: string;
  budgetSensitivity: "low" | "medium" | "high";
}

export interface Diagnosis {
  currentPainPoints: string[];
  structuralInefficiencies: string[];
  scalingRisks: string[];
  executiveSummary: string;
}

export interface ScoringCriteria {
  revenueImpact: number;
  costReduction: number;
  timeSavings: number;
  cxImprovement: number;
  strategicLeverage: number;
  complexity: number;
  implementationEase: number;
  maintenanceBurden: number;
  risk: number;
}

export interface GranularMetrics {
  hour: number;
  day: number;
  week: number;
  month: number;
  year: number;
  decade: number;
}

export interface MetricSavings {
  laborHoursPerWeek: number;
  dollarsPerYear: number;
  emailsAutomatedPerWeek: number;
  errorRateReduction: number;
  savingsPerPerson: {
    hours: GranularMetrics;
    dollars: GranularMetrics;
  };
  savingsPerTeam: {
    hours: GranularMetrics;
    dollars: GranularMetrics;
  };
  enterpriseTotal: {
    yearOne: number;
    yearFive: number;
    yearTen: number;
  };
}

export interface ObstacleMitigation {
  roadblock: string;
  probability: "low" | "medium" | "high";
  riskImpact: "low" | "medium" | "high" | "critical";
  alternativeRoute: string;
  rectificationSteps: string[];
}

export interface FinancialForecast {
  initialImplementationCost: number;
  monthlyOperationalCost: number;
  breakEvenMonth: number;
  tenYearCumulativeSavings: number;
  ROI: number;
}

export interface ArchitectureItem {
  title: string;
  description: string;
  impacts: string;
  problemSolved: string;
  triggers: string[];
  inputs: string[];
  outputs: string[];
  integrations: string[];
  humanInLoop: string;
  expectedValue: string;
  metrics: MetricSavings;
  forecast: FinancialForecast;
  obstacles: ObstacleMitigation[];
  implementationSteps: string[];
  platforms: string[];
  scores: ScoringCriteria;
  valueScore: number;
  frictionScore: number;
  category: PrioritizationCategory;
  complexity: number; 
  impact: number; 
}

export interface AgentDesign {
  role: string;
  scope: string;
  boundaries: string[];
  tools: string[];
  actions: string[];
  escalationLogic: string;
}

export interface RoadmapItem {
  task: string;
  startDateOffsetDays: number;
  durationDays: number;
  dependencies: string[];
  assignedTeam: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  items: string[];
  detailedItems: RoadmapItem[];
  timeframe: string;
}

export interface PrioritizationMatrixItem {
  title: string;
  valueScore: number;
  frictionScore: number;
  category: PrioritizationCategory;
}

export interface Playbook {
  diagnosis: Diagnosis;
  automations: ArchitectureItem[];
  agents: AgentDesign[];
  roadmap: RoadmapPhase[];
  prioritizationMatrix: PrioritizationMatrixItem[];
}
