import { TokenPattern } from "../types";
import { commonPatterns } from "./common.patterns";

// CSS-specific patterns
const cssPatterns = {
  hexColor: /#(?:[a-fA-F0-9]{3}|[a-fA-F0-9]{6})\b/,
  unit: /\b\d+(?:\.\d+)?(?:px|em|rem|vh|vw|%|s|ms|deg|rad|turn|fr)?\b/,
  selector:
    /[.#][a-zA-Z][\w-]*|[a-zA-Z][\w-]*(?=\s*{)|@[\w-]+|:[a-z-]+(?:\([^)]+\))?|\[[^\]]+\]/,
  property: /[-a-z]+(?=\s*:)/,
};

export const css: TokenPattern = {
  value: [cssPatterns.hexColor, cssPatterns.unit],
  selector: [cssPatterns.selector],
  property: [cssPatterns.property],
  string: [commonPatterns.stringDouble, commonPatterns.stringSingle],
  punctuation: [/[{}()[\]:;,]/],
  comment: [commonPatterns.blockComment],
  identifier: [/[-a-zA-Z0-9]+/],
};
