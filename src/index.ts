import { Token } from "./types";
import { languages } from "./langs";

// Compiled whitespace pattern
const whitespacePattern = /^\s+/;

export function tokenize(code: string, language: string): Token[] {
  const tokens: Token[] = [];
  const lang = languages[language];
  if (!lang) return [{ type: "text", content: code }];

  // Compile patterns for this language
  const compiledPatterns = new Map<string, RegExp[]>();
  for (const [type, patterns] of Object.entries(lang)) {
    compiledPatterns.set(
      type,
      patterns.map((p) => new RegExp(p.source, p.flags))
    );
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

    // Handle unmatched text
    if (!matched) {
      const match = whitespacePattern.exec(remaining);
      const content = match ? match[0] : remaining[0];
      tokens.push({ type: "text", content });
      remaining = remaining.slice(content.length);
      pos += content.length;
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
