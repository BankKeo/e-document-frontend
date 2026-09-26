export type CaptureStatus =
  | "Uploaded"
  | "Processing"
  | "Classified"
  | "Extracted"
  | "Verified"
  | "Failed";

export type CaptureStep = "Preprocess" | "OCR" | "Classify" | "Extract" | "Tag";

export interface ExtractedField {
  key: string;
  label: string;
  value: string;
  confidence: number;
  source: "OCR" | "AI" | "Manual";
}

export interface CaptureDocument {
  id: string;
  fileName: string;
  size: number;
  status: CaptureStatus;
  uploadedAt: string;
  uploadedBy: string;
  updatedBy?: string;
  step?: CaptureStep;
  progress: number;
  ocrConfidence: number;
  classification?: string;
  pageCount: number;
  text?: string;
  keywords?: string[];
  tags?: string[];
  fields?: ExtractedField[];
  error?: string;
}

export interface CaptureRun {
  id: string;
  name: string;
  description: string;
  lastRun: string;
  documents: number;
  success: number;
}
