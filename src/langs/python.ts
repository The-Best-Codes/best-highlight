import { Language, Token, Scanner } from "../types";

const keywords = new Set([
  "def",
  "class",
  "if",
  "else",
  "elif",
  "for",
  "while",
  "try",
  "except",
  "finally",
  "with",
  "as",
  "import",
  "from",
  "return",
  "yield",
  "break",
  "continue",
  "pass",
  "raise",
  "True",
  "False",
  "None",
  "and",
  "or",
  "not",
  "is",
  "in",
  "lambda",
  "nonlocal",
  "global",
  "del",
  "assert",
]);

export const python: Language = {
  name: "python",
  rules: [
    {
      type: "comment",
      match: (scanner: Scanner): Token | null => {
        if (scanner.peek() === "#") {
          let content = "";
          while (scanner.hasMore() && scanner.peek() !== "\n") {
            content += scanner.consume();
          }
          return { type: "comment", content };
        }
        return null;
      },
    },
    {
      type: "string",
      match: (scanner: Scanner): Token | null => {
        // Triple quoted strings
        if (
          (scanner.peek() === '"' &&
            scanner.peek(1) === '"' &&
            scanner.peek(2) === '"') ||
          (scanner.peek() === "'" &&
            scanner.peek(1) === "'" &&
            scanner.peek(2) === "'")
        ) {
          const quote = scanner.peek();
          let content = scanner.consume(3);
          while (scanner.hasMore()) {
            if (
              scanner.peek() === quote &&
              scanner.peek(1) === quote &&
              scanner.peek(2) === quote
            ) {
              content += scanner.consume(3);
              return { type: "string", content };
            }
            if (scanner.peek() === "\\") {
              content += scanner.consume(2);
              continue;
            }
            content += scanner.consume();
          }
          return { type: "string", content };
        }

        // Single quoted strings
        const quote = scanner.peek();
        if (quote === '"' || quote === "'") {
          let content = scanner.consume();
          while (scanner.hasMore()) {
            if (scanner.peek() === "\\") {
              content += scanner.consume(2);
              continue;
            }
            if (scanner.peek() === quote) {
              content += scanner.consume();
              return { type: "string", content };
            }
            content += scanner.consume();
          }
          return { type: "string", content };
        }
        return null;
      },
    },
    {
      type: "number",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^\d*\.?\d+([eE][+-]?\d+)?/);
        if (match) {
          return { type: "number", content: scanner.consume(match[0].length) };
        }
        return null;
      },
    },
    {
      type: "keyword",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^[a-zA-Z_]\w*/);
        if (match && keywords.has(match[0])) {
          return { type: "keyword", content: scanner.consume(match[0].length) };
        }
        return null;
      },
    },
    {
      type: "punctuation",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^[[\]{}(),.;:]/);
        if (match) {
          return { type: "punctuation", content: scanner.consume() };
        }
        return null;
      },
    },
    {
      type: "operator",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^[+\-*/%@<>=!&|^~]+/);
        if (match) {
          return {
            type: "operator",
            content: scanner.consume(match[0].length),
          };
        }
        return null;
      },
    },
  ],
  fallback: (scanner: Scanner): Token => {
    if (scanner.isWhitespace()) {
      let content = "";
      while (scanner.hasMore() && scanner.isWhitespace()) {
        content += scanner.consume();
      }
      return { type: "text", content };
    }

    // Handle identifiers
    const match = scanner.match(/^[a-zA-Z_]\w*/);
    if (match) {
      return { type: "identifier", content: scanner.consume(match[0].length) };
    }

    // Handle any other character
    return { type: "text", content: scanner.consume() };
  },
};
