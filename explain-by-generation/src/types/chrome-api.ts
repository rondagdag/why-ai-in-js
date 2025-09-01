// TypeScript declarations for Chrome Summarizer API
// This eliminates the need for @ts-expect-error suppressions

export interface SummarizerOptions {
  sharedContext?: string
  type?: 'key-points' | 'tl;dr' | 'teaser' | 'headline' | 'tldr'
  format?: 'plain-text' | 'markdown'
  length?: 'short' | 'medium' | 'long'
}

export interface SummarizeOptions {
  context?: string
}

export interface DownloadProgressEvent extends Event {
  loaded: number
  total: number
}

export interface Summarizer {
  ready: Promise<void>
  summarize(input: string, options?: SummarizeOptions): Promise<AsyncIterable<string>>
  addEventListener(
    type: 'downloadprogress',
    listener: (event: DownloadProgressEvent) => void,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener(
    type: 'downloadprogress',
    listener: (event: DownloadProgressEvent) => void,
    options?: boolean | EventListenerOptions
  ): void
}

export interface ChromeSummarizerAPI {
  availability(): Promise<'available' | 'unavailable' | 'loading'>
  create(options?: SummarizerOptions): Promise<Summarizer>
}

// Chrome runtime message types for better type safety
export interface BaseMessage {
  type: string
}

export interface StreamResponseMessage extends BaseMessage {
  type: 'STREAM_RESPONSE'
  chunk?: string
  level?: number
  isFirst?: boolean
  selectedText?: string
}

export interface ErrorMessage extends BaseMessage {
  type: 'ERROR'
  error?: string
}

export interface AIInitiateMessage extends BaseMessage {
  type: 'AI_INITIATE'
  total?: number
  loaded?: number
}

export interface StreamCompleteMessage extends BaseMessage {
  type: 'STREAM_COMPLETE'
  level?: number
}

export interface TextSelectedMessage extends BaseMessage {
  type: 'TEXT_SELECTED'
  text?: string
}

export interface RerunCompleteMessage extends BaseMessage {
  type: 'RERUN_COMPLETE'
}

export interface SetLevelMessage extends BaseMessage {
  type: 'SET_LEVEL'
  level: any // Generation type
}

export interface RerunSummarizationMessage extends BaseMessage {
  type: 'RERUN_SUMMARIZATION'
  text: string
  level: any // Generation type
}

export type ChromeMessage = 
  | StreamResponseMessage
  | ErrorMessage
  | AIInitiateMessage
  | StreamCompleteMessage
  | TextSelectedMessage
  | RerunCompleteMessage
  | SetLevelMessage
  | RerunSummarizationMessage

// Extend global Window interface
declare global {
  interface Window {
    Summarizer?: ChromeSummarizerAPI
  }
  
  // For service worker context
  const Summarizer: ChromeSummarizerAPI | undefined
}

export {}