export type DoubtVariant = "amber" | "blue" | "emerald" | "slate" | "purple" | "red";

export interface MoatRisk {
  label: string;
  /** 0–100: 100 = extreme moat risk, 0 = strong defensible moat */
  riskScore: number;
  description: string;
}

export interface DoubtTag {
  label: string;
  variant: DoubtVariant;
}

export interface InvestorRedFlag {
  flag: string;
  detail: string;
}

export interface WeakPhrase {
  /** Exact phrase quoted from the original pitch */
  phrase: string;
  /** What that phrase signals to investors or customers */
  meaning: string;
}

export interface AnalysisResult {
  likelyInvestorQuestion: string;
  biggestWeakness: string;
  /** 0–100: how skeptical investors will be */
  skepticismScore: number;
  /** 0–100: how clear and compelling the pitch is */
  clarityScore: number;
  moatRisk: MoatRisk;
  customerDoubt: DoubtTag[];
  investorRedFlags: InvestorRedFlag[];
  weakPhrases: WeakPhrase[];
  strongerRewrite: string;
  /** 0–100: AI confidence in this assessment */
  confidenceScore: number;
}

export interface AnalyzeRequest {
  message: string;
  context: string;
  goal: string;
}

export interface AnalyzeResponse {
  result: AnalysisResult;
}

export interface AnalyzeErrorResponse {
  error: string;
}
