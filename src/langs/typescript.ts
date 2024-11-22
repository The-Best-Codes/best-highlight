import { Language, Token, Scanner } from "../types";

const keywords = new Set([
  "abstract",
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "declare",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "get",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "set",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "type",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
]);

const types = new Set([
  "any",
  "boolean",
  "never",
  "null",
  "number",
  "object",
  "string",
  "symbol",
  "undefined",
  "unknown",
  "void",
]);

export const typescript: Language = {
  name: "typescript",
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
      type: "type",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^[a-zA-Z_]\w*/);
        if (match && types.has(match[0])) {
          return { type: "type", content: scanner.consume(match[0].length) };
        }
        return null;
      },
    },
    {
      type: "punctuation",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^[{}[\](),.;:<>]/);
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
