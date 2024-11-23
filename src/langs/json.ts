import { TokenPattern } from "../types";
import { commonPatterns } from "./common.patterns";

// JSON-specific patterns
const jsonPatterns = {
  number: /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?\b/,
  keyword: /\b(?:true|false|null)\b/,
};

export const json: TokenPattern = {
  string: [commonPatterns.stringDouble],
  number: [jsonPatterns.number],
  keyword: [jsonPatterns.keyword],
  punctuation: [/[{}[\]:,]/],
  identifier: [/[a-zA-Z_][\w$]*/],
};
