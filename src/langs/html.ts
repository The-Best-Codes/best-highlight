import { Language, Token, Scanner } from "../types";

export const html: Language = {
  name: "html",
  rules: [
    {
      type: "comment",
      match: (scanner: Scanner): Token | null => {
        if (
          scanner.peek() === "<" &&
          scanner.peek(1) === "!" &&
          scanner.peek(2) === "-" &&
          scanner.peek(3) === "-"
        ) {
          let content = scanner.consume(4);
          while (
            scanner.hasMore() &&
            !(
              scanner.peek() === "-" &&
              scanner.peek(1) === "-" &&
              scanner.peek(2) === ">"
            )
          ) {
            content += scanner.consume();
          }
          if (scanner.hasMore()) {
            content += scanner.consume(3);
          }
          return { type: "comment", content };
        }
        return null;
      },
    },
    {
      type: "tag",
      match: (scanner: Scanner): Token | null => {
        if (scanner.peek() === "<") {
          const match = scanner.match(/^<\/?[a-zA-Z][a-zA-Z0-9-]*|^>/);
          if (match) {
            return { type: "tag", content: scanner.consume(match[0].length) };
          }
        }
        return null;
      },
    },
    {
      type: "attribute",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^[a-zA-Z][a-zA-Z0-9-]*(?=\s*=\s*["'])/);
        if (match) {
          return {
            type: "attribute",
            content: scanner.consume(match[0].length),
          };
        }
        return null;
      },
    },
    {
      type: "string",
      match: (scanner: Scanner): Token | null => {
        const quote = scanner.peek();
        if (quote === '"' || quote === "'") {
          let content = scanner.consume();
          while (scanner.hasMore()) {
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
      type: "entity",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^&[a-zA-Z0-9#]+;/);
        if (match) {
          return { type: "entity", content: scanner.consume(match[0].length) };
        }
        return null;
      },
    },
    {
      type: "doctype",
      match: (scanner: Scanner): Token | null => {
        if (scanner.peek() === "<" && scanner.peek(1) === "!") {
          const match = scanner.match(/^<!DOCTYPE[^>]+>/i);
          if (match) {
            return {
              type: "doctype",
              content: scanner.consume(match[0].length),
            };
          }
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

    // Handle equals sign in attributes
    if (scanner.peek() === "=") {
      return { type: "punctuation", content: scanner.consume() };
    }

    // Handle any other character as text
    return { type: "text", content: scanner.consume() };
  },
};
