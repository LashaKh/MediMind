export interface AudioConfig {
  encoding: 'LINEAR16';
  sampleRateHertz: number;
  languageCode: string;
}

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
}

export interface SpeechServiceError extends Error {
  code?: string;
  details?: string;
}