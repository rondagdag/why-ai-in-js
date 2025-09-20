/**
 * Chunked summarization utilities for Chrome Summarizer API
 * Implements the "summary of summaries" technique for large texts
 */

import { TextSplitter } from "./text-splitter"
import { APP_CONSTANTS } from "../constants/app"
import type { Summarizer } from "../types/chrome-api"

export interface ChunkedSummaryResult {
  finalSummary: string
  chunkSummaries: string[]
  chunksProcessed: number
  totalChunks: number
  usedChunking: boolean
}

export interface ChunkedSummaryCallbacks {
  onChunkingStarted?: (totalChunks: number) => void
  onChunkProgress?: (
    current: number,
    total: number,
    chunkSummary: string
  ) => void
  onFinalSummaryStarted?: () => void
  onError?: (error: Error) => void
}

/**
 * Check if text exceeds the summarizer's input quota
 */
export async function checkInputQuota(
  summarizer: Summarizer,
  text: string
): Promise<{ exceedsQuota: boolean; inputUsage: number; totalQuota: number }> {
  try {
    const inputUsage = await summarizer.measureInputUsage(text)
    const totalQuota = summarizer.inputQuota

    return {
      exceedsQuota: inputUsage > totalQuota,
      inputUsage,
      totalQuota
    }
  } catch {
    // If measureInputUsage fails, fall back to simple heuristic
    const estimatedTokens = TextSplitter.estimateTokens(text)
    const needsChunking = TextSplitter.needsChunking(
      text,
      APP_CONSTANTS.CHUNKING_OPTIONS.MAX_TOKENS_ESTIMATE
    )

    return {
      exceedsQuota: needsChunking,
      inputUsage: estimatedTokens,
      totalQuota: APP_CONSTANTS.CHUNKING_OPTIONS.MAX_TOKENS_ESTIMATE
    }
  }
}

/**
 * Process text using chunked summarization if needed
 */
export async function processChunkedSummarization(
  summarizer: Summarizer,
  text: string,
  context: string,
  callbacks: ChunkedSummaryCallbacks = {}
): Promise<ChunkedSummaryResult> {
  const { onChunkingStarted, onChunkProgress, onFinalSummaryStarted, onError } =
    callbacks

  try {
    // First check if we need chunking
    const quotaCheck = await checkInputQuota(summarizer, text)

    if (!quotaCheck.exceedsQuota) {
      // Text is small enough, process normally
      const stream = await summarizer.summarize(text, { context })
      const summary = await streamToString(stream)
      return {
        finalSummary: summary,
        chunkSummaries: [],
        chunksProcessed: 0,
        totalChunks: 0,
        usedChunking: false
      }
    }

    // Text exceeds quota, use chunking
    const splitter = new TextSplitter({
      chunkSize: APP_CONSTANTS.CHUNKING_OPTIONS.CHUNK_SIZE,
      chunkOverlap: APP_CONSTANTS.CHUNKING_OPTIONS.CHUNK_OVERLAP,
      minChunkSize: APP_CONSTANTS.CHUNKING_OPTIONS.MIN_CHUNK_SIZE
    })

    const chunks = splitter.splitText(text)
    onChunkingStarted?.(chunks.length)

    // Summarize each chunk
    const chunkSummaries: string[] = []

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const chunkContext = `${context} (Part ${i + 1} of ${chunks.length})`

      try {
        const stream = await summarizer.summarize(chunk.text, {
          context: chunkContext
        })
        const chunkSummary = await streamToString(stream)

        chunkSummaries.push(chunkSummary)
        onChunkProgress?.(i + 1, chunks.length, chunkSummary)
      } catch (error) {
        const errorMessage = `Failed to summarize chunk ${i + 1}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
        onError?.(new Error(errorMessage))

        // Continue with remaining chunks, use a fallback summary
        chunkSummaries.push(`[Chunk ${i + 1} summary failed]`)
      }
    }

    // Combine summaries into one text (no additional summarization)
    onFinalSummaryStarted?.()

    const finalSummary = chunkSummaries
      .map((summary, index) => `**Part ${index + 1}:** ${summary}`)
      .join("\n\n")

    return {
      finalSummary,
      chunkSummaries,
      chunksProcessed: chunks.length,
      totalChunks: chunks.length,
      usedChunking: true
    }
  } catch (error) {
    const errorMessage = `Chunked summarization failed: ${
      error instanceof Error ? error.message : "Unknown error"
    }`
    onError?.(new Error(errorMessage))
    throw new Error(errorMessage)
  }
}

/**
 * Convert async iterable stream to string
 */
async function streamToString(stream: AsyncIterable<string>): Promise<string> {
  let result = ""
  for await (const chunk of stream) {
    result += chunk
  }
  return result
}

/**
 * Process stream with callback for each chunk (for UI updates)
 */
export async function processStreamWithCallback(
  stream: AsyncIterable<string>,
  onChunk: (chunk: string) => void
): Promise<string> {
  let result = ""
  for await (const chunk of stream) {
    result += chunk
    onChunk(chunk)
  }
  return result
}
