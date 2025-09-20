/**
 * Text splitting utility for Chrome Summarizer API
 * Implements intelligent text chunking for "summary of summaries" technique
 *
 * Based on Chrome's recommendations:
 * - ~3000 characters per chunk (~750 tokens)
 * - Split at paragraph/sentence boundaries, not mid-word/sentence
 * - Use overlap to maintain context between chunks
 */

export interface TextChunk {
  text: string
  index: number
  startPosition: number
  endPosition: number
}

export interface TextSplitterOptions {
  /** Maximum characters per chunk (default: 3000) */
  chunkSize?: number
  /** Characters to overlap between chunks (default: 200) */
  chunkOverlap?: number
  /** Minimum chunk size to avoid tiny fragments (default: 100) */
  minChunkSize?: number
}

export class TextSplitter {
  private readonly chunkSize: number
  private readonly chunkOverlap: number
  private readonly minChunkSize: number

  constructor(options: TextSplitterOptions = {}) {
    this.chunkSize = options.chunkSize ?? 3000
    this.chunkOverlap = options.chunkOverlap ?? 200
    this.minChunkSize = options.minChunkSize ?? 100
  }

  /**
   * Split text into chunks using intelligent boundary detection
   */
  splitText(text: string): TextChunk[] {
    if (!text || text.length <= this.chunkSize) {
      return [
        {
          text,
          index: 0,
          startPosition: 0,
          endPosition: text.length
        }
      ]
    }

    const chunks: TextChunk[] = []
    let position = 0
    let chunkIndex = 0

    while (position < text.length) {
      const remainingText = text.length - position

      // If remaining text is small, include it in the current chunk
      if (remainingText <= this.chunkSize) {
        chunks.push({
          text: text.slice(position),
          index: chunkIndex,
          startPosition: position,
          endPosition: text.length
        })
        break
      }

      // Find the best split point within the chunk size limit
      const chunkEnd = position + this.chunkSize
      const splitPoint = this.findBestSplitPoint(text, position, chunkEnd)

      const chunkText = text.slice(position, splitPoint)

      // Only add chunk if it's above minimum size
      if (chunkText.length >= this.minChunkSize) {
        chunks.push({
          text: chunkText,
          index: chunkIndex,
          startPosition: position,
          endPosition: splitPoint
        })
        chunkIndex++
      }

      // Move position forward, accounting for overlap
      position = splitPoint - this.chunkOverlap

      // Ensure we don't go backwards
      if (position <= chunks[chunks.length - 1]?.startPosition) {
        position = splitPoint
      }
    }

    return chunks
  }

  /**
   * Find the best place to split text, preferring natural boundaries
   */
  private findBestSplitPoint(
    text: string,
    start: number,
    maxEnd: number
  ): number {
    // If we're at the end of the text, use it
    if (maxEnd >= text.length) {
      return text.length
    }

    const searchWindow = text.slice(start, maxEnd)

    // Priority order for split points:
    // 1. Double newlines (paragraph breaks)
    // 2. Single newlines
    // 3. Sentence endings (. ! ?)
    // 4. Other punctuation (, ; :)
    // 5. Spaces
    // 6. Fallback to character limit

    const splitPatterns = [
      /\n\s*\n/g, // Paragraph breaks
      /\n/g, // Line breaks
      /[.!?]\s+/g, // Sentence endings
      /[,;:]\s+/g, // Other punctuation
      /\s+/g // Spaces
    ]

    for (const pattern of splitPatterns) {
      const matches = Array.from(searchWindow.matchAll(pattern))
      if (matches.length > 0) {
        // Find the last match within our chunk size
        const lastMatch = matches[matches.length - 1]
        if (lastMatch.index !== undefined) {
          const splitPoint = start + lastMatch.index + lastMatch[0].length
          // Ensure we're not splitting too close to the start
          if (splitPoint - start >= this.minChunkSize) {
            return splitPoint
          }
        }
      }
    }

    // Fallback: split at character limit, but try to avoid mid-word
    let fallbackSplit = maxEnd

    // Look backwards for a space to avoid splitting words
    for (let i = maxEnd - 1; i > start + this.minChunkSize; i--) {
      if (text[i] === " ") {
        fallbackSplit = i + 1
        break
      }
    }

    return fallbackSplit
  }

  /**
   * Estimate the number of tokens in text (rough approximation: 1 token ≈ 4 characters)
   */
  static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
  }

  /**
   * Check if text might exceed typical context windows
   */
  static needsChunking(text: string, maxTokens: number = 750): boolean {
    return this.estimateTokens(text) > maxTokens
  }
}
