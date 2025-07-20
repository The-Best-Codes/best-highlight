import { languages } from "./langs";
import { Token } from "./types";

// Pre-compiled HTML escape lookup table for maximum performance
const HTML_ESCAPE_MAP = new Map([
  [38, "&amp;"], // &
  [60, "&lt;"], // <
  [62, "&gt;"], // >
  [34, "&quot;"], // "
  [39, "&#039;"], // '
]);

// Pre-compile whitespace pattern for better performance
const whitespacePattern = /^\s+/;

// Ultra-fast HTML escaping using character codes
function escapeHtml(text: string): string {
  let result = "";
  let lastIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const escaped = HTML_ESCAPE_MAP.get(charCode);

    if (escaped) {
      if (lastIndex < i) {
        result += text.slice(lastIndex, i);
      }
      result += escaped;
      lastIndex = i + 1;
    }
  }

  if (lastIndex < text.length) {
    result += text.slice(lastIndex);
  }

  return result;
}

// Optimized tokenize function with performance improvements
export function tokenize(code: string, language: string): Token[] {
  const tokens: Token[] = [];
  const lang = languages[language];
  if (!lang) return [{ type: "text", content: code }];

  let pos = 0;
  let currentType: string | null = null;
  let currentContent = "";
  const length = code.length;

  const flushToken = () => {
    if (currentContent && currentType) {
      tokens.push({ type: currentType, content: currentContent });
      currentContent = "";
      currentType = null;
    }
  };

  while (pos < length) {
    let matched = false;
    const remaining = code.slice(pos);

    // Optimized pattern matching with early exit
    for (const [type, patterns] of Object.entries(lang)) {
      if (Array.isArray(patterns)) {
        for (const pattern of patterns) {
          pattern.lastIndex = 0; // Reset regex state
          const match = pattern.exec(remaining);
          if (match && match.index === 0) {
            const content = match[0];
            const tokenType =
              type === "identifier" && language !== "typescript"
                ? "text"
                : type;

            if (tokenType === currentType) {
              currentContent += content;
            } else {
              flushToken();
              currentType = tokenType;
              currentContent = content;
            }

            pos += content.length;
            matched = true;
            break;
          }
        }
      }
      if (matched) break;
    }

    if (!matched) {
      const match = whitespacePattern.exec(remaining);
      const content = match ? match[0] : remaining[0];

      if (currentType === "text") {
        currentContent += content;
      } else {
        flushToken();
        currentType = "text";
        currentContent = content;
      }

      pos += content.length;
    }
  }

  flushToken();
  return tokens;
}

// High-performance highlight function with minimal allocations
export function highlight(code: string, language: string): string {
  const tokens = tokenize(code, language);

  // Pre-allocate array with estimated size to reduce reallocations
  const parts: string[] = new Array(tokens.length);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const escapedContent = escapeHtml(token.content);
    parts[i] =
      `<span class="bh-npm-token bh-npm-${token.type}">${escapedContent}</span>`;
  }

  return parts.join("");
}

export function highlightElement(element: HTMLElement): void {
  const code = element.textContent || "";
  const language = element.getAttribute("data-language") || "text";
  const highlighted = highlight(code, language);
  element.innerHTML = highlighted;
  element.classList.add("bh-npm-highlight");
}

// Streaming-friendly tokenizer for AI applications
export function* tokenizeStream(
  code: string,
  language: string,
  chunkSize: number = 1000,
): Generator<Token[], void, unknown> {
  if (!code || code.length <= chunkSize) {
    const tokens = tokenize(code, language);
    if (tokens.length > 0) {
      yield tokens;
    }
    return;
  }

  let pos = 0;
  let buffer = "";

  while (pos < code.length) {
    const chunk = code.slice(pos, pos + chunkSize);
    buffer += chunk;

    // Find a safe break point (end of line or whitespace)
    let breakPoint = buffer.length;
    if (pos + chunkSize < code.length) {
      for (
        let i = buffer.length - 1;
        i >= Math.max(0, buffer.length - 100);
        i--
      ) {
        const char = buffer.charCodeAt(i);
        if (char === 10 || char === 32 || char === 9) {
          // \n, space, tab
          breakPoint = i + 1;
          break;
        }
      }
    }

    const processChunk = buffer.slice(0, breakPoint);
    buffer = buffer.slice(breakPoint);

    if (processChunk) {
      yield tokenize(processChunk, language);
    }

    pos += chunkSize;
  }

  // Process remaining buffer
  if (buffer) {
    yield tokenize(buffer, language);
  }
}

// Streaming highlight function for large code chunks
export function* highlightStream(
  code: string,
  language: string,
  chunkSize: number = 1000,
): Generator<string, void, unknown> {
  for (const tokens of tokenizeStream(code, language, chunkSize)) {
    const parts: string[] = new Array(tokens.length);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const escapedContent = escapeHtml(token.content);
      parts[i] =
        `<span class="bh-npm-token bh-npm-${token.type}">${escapedContent}</span>`;
    }

    yield parts.join("");
  }
}

// Memory-efficient highlighting for very large code
export function highlightLarge(code: string, language: string): string {
  const CHUNK_SIZE = 10000; // Process in 10KB chunks

  if (code.length <= CHUNK_SIZE) {
    return highlight(code, language);
  }

  const results: string[] = [];

  for (const htmlChunk of highlightStream(code, language, CHUNK_SIZE)) {
    results.push(htmlChunk);
  }

  return results.join("");
}

// Batch processing for multiple code blocks
export function highlightElements(elements: HTMLElement[]): void {
  // Process in batches to avoid blocking the main thread
  const batchSize = 10;
  let index = 0;

  function processBatch() {
    const endIndex = Math.min(index + batchSize, elements.length);

    for (let i = index; i < endIndex; i++) {
      highlightElement(elements[i]);
    }

    index = endIndex;

    if (index < elements.length) {
      // Use requestAnimationFrame for non-blocking processing
      if (typeof requestAnimationFrame !== "undefined") {
        requestAnimationFrame(processBatch);
      } else {
        // Fallback for Node.js environments
        setTimeout(processBatch, 0);
      }
    }
  }

  processBatch();
}
