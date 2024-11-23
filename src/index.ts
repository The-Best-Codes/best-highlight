import { Token } from "./types";
import { languages } from "./langs";

// Cache for compiled patterns
const patternCache = new Map<string, Map<string, RegExp[]>>();

// Compiled whitespace pattern
const whitespacePattern = /^\s+/;

export function tokenize(code: string, language: string): Token[] {
  const tokens: Token[] = [];
  const lang = languages[language];
  if (!lang) return [{ type: "text", content: code }];

  // Get or compile patterns for this language
  let compiledPatterns = patternCache.get(language);
  if (!compiledPatterns) {
    compiledPatterns = new Map();
    for (const [type, patterns] of Object.entries(lang)) {
      compiledPatterns.set(
        type,
        patterns.map((p) => new RegExp(p.source, p.flags))
      );
    }
    patternCache.set(language, compiledPatterns);
  }

  let remaining = code;
  let pos = 0;
  const length = code.length;

  while (pos < length) {
    let matched = false;

    // Try each token type
    for (const [type, patterns] of compiledPatterns.entries()) {
      for (const pattern of patterns) {
        pattern.lastIndex = 0; // Reset regex state
        const match = pattern.exec(remaining);
        if (match && match.index === 0) {
          const content = match[0];
          // Convert identifiers to text tokens except for TypeScript
          const tokenType =
            type === "identifier" && language !== "typescript" ? "text" : type;
          tokens.push({ type: tokenType, content });
          remaining = remaining.slice(content.length);
          pos += content.length;
          matched = true;
          break;
        }
      }
      if (matched) break;
    }

    // Handle whitespace and unknown characters more efficiently
    if (!matched) {
      const whitespaceMatch = whitespacePattern.exec(remaining);
      if (whitespaceMatch) {
        const content = whitespaceMatch[0];
        tokens.push({ type: "text", content });
        remaining = remaining.slice(content.length);
        pos += content.length;
      } else {
        // Take one character as text if no other match
        tokens.push({ type: "text", content: remaining[0] });
        remaining = remaining.slice(1);
        pos++;
      }
    }
  }

  return tokens;
}

export function highlight(code: string, language: string): string {
  const tokens = tokenize(code, language);
  return tokens
    .map(
      (token) =>
        `<span class="bh-npm-token bh-npm-${token.type}">${escapeHtml(
          token.content
        )}</span>`
    )
    .join("");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function highlightElement(element: HTMLElement): void {
  const code = element.textContent || "";
  const language = element.getAttribute("data-language") || "text";
  const highlighted = highlight(code, language);
  element.innerHTML = highlighted;
  element.classList.add("bh-npm-highlight");
}
