import { TokenPattern } from "../types";
import { commonPatterns } from "./common.patterns";

export const javascript: TokenPattern = {
  keyword: [
    /\b(?:const|let|var|function|return|if|else|for|while|do|break|continue|class|extends|new|this)\b/,
  ],
  string: [
    commonPatterns.stringDouble,
    commonPatterns.stringSingle,
    commonPatterns.stringBacktick
  ],
  number: [commonPatterns.number],
  comment: [
    commonPatterns.lineComment,
    commonPatterns.blockComment
  ],
  punctuation: [/[{}[\](),.;]/],
  operator: [/[+\-*/%=<>!&|^~?:]+/],
  identifier: [commonPatterns.identifier],
};
