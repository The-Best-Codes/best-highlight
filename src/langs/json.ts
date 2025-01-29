import { TokenPattern } from "../types";
import { commonPatterns } from "./common.patterns";

// JSON-specific patterns
const jsonPatterns = {
  number: new RegExp("-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\b"),
  keyword: new RegExp("\\b(?:true|false|null)\\b"),
};

export const json: TokenPattern = {
  string: [commonPatterns.stringDouble].map(
    (p) => new RegExp(p.source, p.flags),
  ),
  number: [jsonPatterns.number],
  keyword: [jsonPatterns.keyword],
  punctuation: [new RegExp("[{}()\\[\\],:]")],
  identifier: [new RegExp("[a-zA-Z_][\\w$]*")],
};
