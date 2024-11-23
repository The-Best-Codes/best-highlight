import { TokenPattern } from "../types";

export const json: TokenPattern = {
  string: [/"(?:\\.|[^"\\])*"/],
  number: [/-?\b\d+\.?\d*\b/],
  keyword: [/\b(?:true|false|null)\b/],
  punctuation: [/[{}[\]:,]/],
  identifier: [/[a-zA-Z0-9_$]+/],
};
