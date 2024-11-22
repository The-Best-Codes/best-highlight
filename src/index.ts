import { Token } from "./types";
import { languages } from "./langs";
import { TextScanner } from "./scanner";

export function tokenize(code: string, language: string): Token[] {
  const tokens: Token[] = [];
  const lang = languages[language];
  if (!lang) return [{ type: "text", content: code }];

  const scanner = new TextScanner(code);

  while (scanner.hasMore()) {
    let token: Token | null = null;

    // Try each rule in order
    for (const rule of lang.rules) {
      token = rule.match(scanner);
      if (token) break;
    }

    // If no rule matched, use fallback
    if (!token) {
      token = lang.fallback
        ? lang.fallback(scanner)
        : { type: "text", content: scanner.consume() };
    }

    tokens.push(token as Token);
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
