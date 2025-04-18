export interface ImageFile {
  file: File;
  preview: string;
  converted?: Blob;
  isConverting?: boolean;
  originalAspectRatio?: number;
  originalWidth?: number;
  originalHeight?: number;
}

export interface ConversionSettings {
  format: string;
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  scalePercentage?: number;
  originalWidth?: number;
  originalHeight?: number;
  // Expert mode settings
  quality: number;
  maxSizeMB: number;
  lossless: boolean;
} 