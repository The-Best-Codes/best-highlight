import { TokenPattern } from "../types";
import { commonPatterns } from "./common.patterns";

// CSS-specific patterns
const cssPatterns = {
  hexColor: new RegExp("#(?:[a-fA-F0-9]{3}|[a-fA-F0-9]{6})\\b"),
  unit: new RegExp(
    "\\b\\d+(?:\\.\\d+)?(?:px|em|rem|vh|vw|%|s|ms|deg|rad|turn|fr)?\\b",
  ),
  selector: new RegExp(
    "[.#][a-zA-Z][\\w-]*|[a-zA-Z][\\w-]*(?=\\s*{)|@[\\w-]+|:[a-z-]+(?:\\([^)]+\\))?|\\[[^\\]]+\\]",
  ),
  property: new RegExp("[-a-z]+(?=\\s*:)"),
};

export const css: TokenPattern = {
  value: [cssPatterns.hexColor, cssPatterns.unit],
  selector: [cssPatterns.selector],
  property: [cssPatterns.property],
  string: [commonPatterns.stringDouble, commonPatterns.stringSingle].map(
    (p) => new RegExp(p.source, p.flags),
  ),
  punctuation: [new RegExp("[{}()\\[\\]:;,]")],
  comment: [commonPatterns.blockComment].map(
    (p) => new RegExp(p.source, p.flags),
  ),
  identifier: [new RegExp("[-a-zA-Z0-9]+")],
};
