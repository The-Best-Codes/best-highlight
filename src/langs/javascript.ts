import { TokenPattern } from "../types";

export const javascript: TokenPattern = {
  keyword: [
    /\b(const|let|var|function|return|if|else|for|while|do|break|continue|class|extends|new|this)\b/,
  ],
  string: [/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/],
  number: [/\b\d+\.?\d*\b/],
  comment: [/\/\/.*$/m, /\/\*[\s\S]*?\*\//],
  punctuation: [/[{}[\](),.;]/],
  operator: [/[+\-*/%=<>!&|^~?:]/],
  identifier: [/[a-zA-Z_]\w*/],
};
