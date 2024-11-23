import { Token } from "./types";
import { languages } from "./langs";

export function tokenize(code: string, language: string): Token[] {
  const tokens: Token[] = [];
  const lang = languages[language];
  if (!lang) return [{ type: "text", content: code }];

  let remaining = code;
  while (remaining) {
    let matched = false;
    const tokenTypes = Object.keys(lang);

    // Try to match any token type
    for (const type of tokenTypes) {
      const patterns = lang[type];
      for (const pattern of patterns) {
        const match = remaining.match(pattern);
        if (match && match.index === 0) {
          // Convert identifiers to text tokens except for TypeScript
          const tokenType =
            type === "identifier" && language !== "typescript" ? "text" : type;
          tokens.push({ type: tokenType, content: match[0] });
          remaining = remaining.slice(match[0].length);
          matched = true;
          break;
        }
      }
      if (matched) break;
    }

    // If no token type matched, handle whitespace and unknown characters
    if (!matched) {
      const whitespaceMatch = remaining.match(/^\s+/);
      if (whitespaceMatch) {
        tokens.push({ type: "text", content: whitespaceMatch[0] });
        remaining = remaining.slice(whitespaceMatch[0].length);
      } else {
        // Take one character as text if no other match
        tokens.push({ type: "text", content: remaining[0] });
        remaining = remaining.slice(1);
      }
    }
  }

  // Remove token merging logic and return tokens directly
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
