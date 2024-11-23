import { TokenPattern } from "../types";

export const css: TokenPattern = {
  value: [/#[a-fA-F0-9]{3,6}\b/, /\b\d+\.?\d*[a-z%]*/],
  selector: [/[.#][a-zA-Z0-9_-]+/, /[a-zA-Z0-9_-]+(?=\s*{)/, /\[[^\]]+\]/],
  property: [/[a-zA-Z-]+(?=\s*:)/],
  string: [/"[^"]*"|'[^']*'/],
  punctuation: [/[{}()[\]:;,]/],
  comment: [/\/\*[\s\S]*?\*\//],
  identifier: [/[a-zA-Z0-9_-]+/],
};
