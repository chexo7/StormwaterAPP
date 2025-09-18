export type ExportLogLevel = 'info' | 'warn' | 'error';

export interface ExportLogEntry {
  message: string;
  level: ExportLogLevel;
}

export interface ExportResult {
  filename: string;
  blob: Blob;
  logs: ExportLogEntry[];
}

export class ExportError extends Error {
  level: ExportLogLevel;

  constructor(message: string, level: ExportLogLevel = 'error') {
    super(message);
    this.name = 'ExportError';
    this.level = level;
  }
}

export const isExportError = (error: unknown): error is ExportError =>
  error instanceof ExportError;
