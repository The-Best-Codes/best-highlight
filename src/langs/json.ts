import { Language, Token, Scanner } from "../types";

export const json: Language = {
  name: "json",
  rules: [
    {
      type: "string",
      match: (scanner: Scanner): Token | null => {
        if (scanner.peek() === '"') {
          let content = scanner.consume();
          while (scanner.hasMore()) {
            if (scanner.peek() === "\\") {
              content += scanner.consume(2);
              continue;
            }
            if (scanner.peek() === '"') {
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
        const match = scanner.match(/^-?\d+\.?\d*([eE][+-]?\d+)?/);
        if (match) {
          return { type: "number", content: scanner.consume(match[0].length) };
        }
        return null;
      },
    },
    {
      type: "keyword",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^(true|false|null)\b/);
        if (match) {
          return { type: "keyword", content: scanner.consume(match[0].length) };
        }
        return null;
      },
    },
    {
      type: "punctuation",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^[{}[\],:]/);
        if (match) {
          return { type: "punctuation", content: scanner.consume() };
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

    // Handle any other character
    return { type: "text", content: scanner.consume() };
  },
};
