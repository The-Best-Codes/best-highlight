import { TokenPattern } from "../types";
import { commonPatterns } from "./common.patterns";

// Python-specific patterns
const pythonPatterns = {
  stringTripleDouble: new RegExp('"""(?:\\\\[\\s\\S]|[^\\\\])*?"""'),
  stringTripleSingle: new RegExp("'''(?:\\\\[\\s\\S]|[^\\\\])*?'''"),
  lineComment: [/#[^\n]*/].map((p) => new RegExp(p.source, p.flags)),
};

export const python: TokenPattern = {
  keyword: [
    new RegExp(
      "\\b(?:def|class|if|else|elif|for|while|break|continue|return|import|from|as|try|except|finally|raise|with|lambda)\\b",
    ),
  ],
  string: [
    pythonPatterns.stringTripleDouble,
    pythonPatterns.stringTripleSingle,
    commonPatterns.stringDouble,
    commonPatterns.stringSingle,
  ].map((p) => new RegExp(p.source, p.flags)),
  number: [commonPatterns.number].map((p) => new RegExp(p.source, p.flags)),
  comment: pythonPatterns.lineComment, // Corrected: Removed array wrapping, it should be RegExp[] from pythonPatterns
  punctuation: [new RegExp("[{}()\\[\\],.;:]")],
  operator: [new RegExp("[+\\-*/%=<>!&|^~@]+")],
  identifier: [commonPatterns.identifier].map(
    (p) => new RegExp(p.source, p.flags),
  ),
};
