import { languages } from "./langs";
import { Token } from "./types";

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
      patterns.map((p) => new RegExp(p.source, p.flags)),
    );
  }

  let remaining = code;
  let pos = 0;
  let currentContent = "";
  let currentType: string | null = null;
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

          if (tokenType === currentType) {
            currentContent += content;
          } else {
            flushToken();
            currentType = tokenType;
            currentContent = content;
          }

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

      if (currentType === "text") {
        currentContent += content;
      } else {
        flushToken();
        currentType = "text";
        currentContent = content;
      }

      remaining = remaining.slice(content.length);
      pos += content.length;
    }
  }

  flushToken(); // Flush any remaining token
  return tokens;
}

export function highlight(code: string, language: string): string {
  const tokens = tokenize(code, language);
  return tokens
    .map(
      (token) =>
        `<span class="bh-npm-token bh-npm-${token.type}">${escapeHtml(
          token.content,
        )}</span>`,
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
