import { TokenPattern } from "../types";
import { commonPatterns } from "./common.patterns";

// Python-specific patterns
const pythonPatterns = {
  stringTripleDouble: /"""(?:\\[\s\S]|[^\\])*?"""/,
  stringTripleSingle: /'''(?:\\[\s\S]|[^\\])*?'''/,
  lineComment: /#[^\n]*/,
};

export const python: TokenPattern = {
  keyword: [
    /\b(?:def|class|if|else|elif|for|while|break|continue|return|import|from|as|try|except|finally|raise|with|lambda)\b/,
  ],
  string: [
    pythonPatterns.stringTripleDouble,
    pythonPatterns.stringTripleSingle,
    commonPatterns.stringDouble,
    commonPatterns.stringSingle,
  ],
  number: [commonPatterns.number],
  comment: [pythonPatterns.lineComment],
  punctuation: [/[{}[\](),.;:]/],
  operator: [/[+\-*/%=<>!&|^~@]+/],
  identifier: [commonPatterns.identifier],
};
