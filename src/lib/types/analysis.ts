export type ToneVariant = "amber" | "blue" | "emerald" | "slate" | "purple" | "red";

export interface PowerDynamic {
  label: string;
  /** 0–100: 100 = sender has full control, 50 = balanced */
  senderScore: number;
  description: string;
}

export interface ToneTag {
  label: string;
  variant: ToneVariant;
}

export interface RedFlag {
  flag: string;
  detail: string;
}

export interface EvidenceSignal {
  /** Exact phrase or word(s) quoted from the original message */
  phrase: string;
  /** What that phrase reveals about intent, emotion, or strategy */
  meaning: string;
}

export interface AnalysisResult {
  surfaceMeaning: string;
  hiddenIntent: string;
  /** 0–100 */
  interestScore: number;
  powerDynamic: PowerDynamic;
  emotionalTone: ToneTag[];
  redFlags: RedFlag[];
  /** 3–5 linguistic evidence signals extracted from the message */
  evidence: EvidenceSignal[];
  recommendedReply: string;
  /** 0–100 */
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
