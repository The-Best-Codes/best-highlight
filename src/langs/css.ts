import { Language, Token, Scanner } from "../types";

const units = new Set([
  "px",
  "em",
  "rem",
  "vh",
  "vw",
  "vmin",
  "vmax",
  "%",
  "ch",
  "ex",
  "cm",
  "mm",
  "in",
  "pt",
  "pc",
  "fr",
  "deg",
  "rad",
  "grad",
  "turn",
  "s",
  "ms",
  "Hz",
  "kHz",
]);

export const css: Language = {
  name: "css",
  rules: [
    {
      type: "comment",
      match: (scanner: Scanner): Token | null => {
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
        }
        return null;
      },
    },
    {
      type: "selector",
      match: (scanner: Scanner): Token | null => {
        // Match class, id, or element selectors
        const match = scanner.match(/^([.#]?[a-zA-Z0-9_-]+|\*)/);
        if (match && !scanner.match(/^[:{]/)) {
          return {
            type: "selector",
            content: scanner.consume(match[0].length),
          };
        }
        return null;
      },
    },
    {
      type: "property",
      match: (scanner: Scanner): Token | null => {
        // Only match properties when inside a rule block (after '{')
        const match = scanner.match(/^[a-zA-Z-]+(?=\s*:)/);
        if (match) {
          return {
            type: "property",
            content: scanner.consume(match[0].length),
          };
        }
        return null;
      },
    },
    {
      type: "value",
      match: (scanner: Scanner): Token | null => {
        // Match color values
        let match = scanner.match(/^#[0-9a-fA-F]{3,8}/);
        if (match) {
          return { type: "value", content: scanner.consume(match[0].length) };
        }

        // Match numeric values with units
        match = scanner.match(/^-?\d*\.?\d+([a-zA-Z%]+)?/);
        if (match) {
          const fullMatch = match[0];
          const unit = match[1];
          // If there's a unit, validate it
          if (!unit || units.has(unit)) {
            return {
              type: "value",
              content: scanner.consume(fullMatch.length),
            };
          }
          // If unit is invalid, only consume the number part
          const numMatch = fullMatch.match(/^-?\d*\.?\d+/);
          if (numMatch) {
            return {
              type: "value",
              content: scanner.consume(numMatch[0].length),
            };
          }
        }

        // Match other values like 'auto', 'inherit', etc.
        match = scanner.match(/^[a-zA-Z-]+(?=[;}\s])/);
        if (match) {
          return { type: "value", content: scanner.consume(match[0].length) };
        }

        return null;
      },
    },
    {
      type: "punctuation",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^[{};:,()]/);
        if (match) {
          return { type: "punctuation", content: scanner.consume() };
        }
        return null;
      },
    },
    {
      type: "pseudo",
      match: (scanner: Scanner): Token | null => {
        const match = scanner.match(/^:+[a-zA-Z-]+/);
        if (match) {
          return { type: "pseudo", content: scanner.consume(match[0].length) };
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
