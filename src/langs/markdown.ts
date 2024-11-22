import { Language, Token, Scanner } from "../types";

export const markdown: Language = {
  name: "markdown",
  rules: [
    {
      type: "heading",
      match: (scanner: Scanner): Token | null => {
        if (scanner.peek() === "#") {
          const match = scanner.match(/^#{1,6}(?=\s)/);
          if (match) {
            return {
              type: "heading",
              content: scanner.consume(match[0].length),
            };
          }
        }
        return null;
      },
    },
    {
      type: "code",
      match: (scanner: Scanner): Token | null => {
        // Backtick code blocks
        if (scanner.peek() === "`") {
          // Triple backtick code blocks
          if (scanner.peek(1) === "`" && scanner.peek(2) === "`") {
            let content = scanner.consume(3);
            while (scanner.hasMore()) {
              if (
                scanner.peek() === "`" &&
                scanner.peek(1) === "`" &&
                scanner.peek(2) === "`"
              ) {
                content += scanner.consume(3);
                return { type: "code", content };
              }
              content += scanner.consume();
            }
            return { type: "code", content };
          }
          // Single backtick inline code
          let content = scanner.consume();
          while (scanner.hasMore()) {
            if (scanner.peek() === "`") {
              content += scanner.consume();
              return { type: "code", content };
            }
            content += scanner.consume();
          }
          return { type: "code", content };
        }
        return null;
      },
    },
    {
      type: "link",
      match: (scanner: Scanner): Token | null => {
        if (scanner.peek() === "[") {
          let content = scanner.consume();
          let bracketDepth = 1;
          let foundClosing = false;

          // Match link text
          while (scanner.hasMore() && !foundClosing) {
            if (scanner.peek() === "[") bracketDepth++;
            if (scanner.peek() === "]") {
              bracketDepth--;
              if (bracketDepth === 0) foundClosing = true;
            }
            content += scanner.consume();
          }

          // Match URL
          if (scanner.peek() === "(") {
            content += scanner.consume();
            while (scanner.hasMore() && scanner.peek() !== ")") {
              content += scanner.consume();
            }
            if (scanner.hasMore()) {
              content += scanner.consume(); // consume closing )
              return { type: "link", content };
            }
          }

          return { type: "link", content };
        }
        return null;
      },
    },
    {
      type: "emphasis",
      match: (scanner: Scanner): Token | null => {
        // Bold
        if (
          (scanner.peek() === "*" && scanner.peek(1) === "*") ||
          (scanner.peek() === "_" && scanner.peek(1) === "_")
        ) {
          const marker = scanner.peek();
          let content = scanner.consume(2);
          while (scanner.hasMore()) {
            if (scanner.peek() === marker && scanner.peek(1) === marker) {
              content += scanner.consume(2);
              return { type: "emphasis", content };
            }
            content += scanner.consume();
          }
          return { type: "emphasis", content };
        }
        // Italic
        if (scanner.peek() === "*" || scanner.peek() === "_") {
          const marker = scanner.peek();
          let content = scanner.consume();
          while (scanner.hasMore()) {
            if (scanner.peek() === marker) {
              content += scanner.consume();
              return { type: "emphasis", content };
            }
            content += scanner.consume();
          }
          return { type: "emphasis", content };
        }
        return null;
      },
    },
    {
      type: "blockquote",
      match: (scanner: Scanner): Token | null => {
        if (scanner.peek() === ">") {
          let content = scanner.consume();
          // Optional space after >
          if (scanner.peek() === " ") {
            content += scanner.consume();
          }
          return { type: "blockquote", content };
        }
        return null;
      },
    },
    {
      type: "list",
      match: (scanner: Scanner): Token | null => {
        // Unordered list
        if (
          (scanner.peek() === "*" ||
            scanner.peek() === "-" ||
            scanner.peek() === "+") &&
          (scanner.peek(1) === " " || scanner.peek(1) === "\t")
        ) {
          return { type: "list", content: scanner.consume(2) };
        }
        // Ordered list
        const match = scanner.match(/^\d+\.\s/);
        if (match) {
          return { type: "list", content: scanner.consume(match[0].length) };
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
