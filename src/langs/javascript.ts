import { Language, Token, Scanner } from "../types";

const keywords = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "break",
  "continue",
  "class",
  "extends",
  "new",
  "this",
  "import",
  "export",
  "default",
  "null",
  "undefined",
  "true",
  "false",
]);

export const javascript: Language = {
  name: "javascript",
  rules: [
    {
      type: "comment",
      match: (scanner: Scanner): Token | null => {
        if (scanner.peek() === "/" && scanner.peek(1) === "/") {
          let content = "";
          while (scanner.hasMore() && scanner.peek() !== "\n") {
            content += scanner.consume();
          }
          return { type: "comment", content };
        }
        if (scanner.peek() === "/" && scanner.peek(1) === "*") {
          let content = scanner.consume(2);
          while (
            scanner.hasMore() &&
            !(scanner.peek() === "*" && scanner.peek(1) === "/")
          ) {
            content += scanner.consume();
          }
          if (scanner.hasMore()) {
            content += scanner.consume(2);
          }
          return { type: "comment", content };
        }
        return null;
      },
    },
    {
      type: "string",
      match: (scanner: Scanner): Token | null => {
        const quote = scanner.peek();
        if (quote === '"' || quote === "'" || quote === "`") {
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
        }
        return null;
      },
    },
    {
      type: "number",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^\d*\.?\d+/);
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
        const match = scanner.match(/^[{}[\](),.;]/);
        if (match) {
          return { type: "punctuation", content: scanner.consume() };
        }
        return null;
      },
    },
    {
      type: "operator",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^[+\-*/%=<>!&|^~?:]+/);
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
