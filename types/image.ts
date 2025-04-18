export interface ImageFile {
  file: File;
  preview: string;
  converted?: Blob;
  isConverting?: boolean;
  originalAspectRatio?: number;
  originalWidth?: number;
  originalHeight?: number;
}

export type ConversionMode = 'format-only' | 'resize' | 'compress';

export interface ConversionSettings {
  mode: ConversionMode;
  format: string;
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  keepOriginalSize: boolean;
  scalePercentage?: number;
  originalWidth?: number;
  originalHeight?: number;
  // Expert mode settings
  quality: number;
  maxSizeMB: number;
  lossless: boolean;
} 