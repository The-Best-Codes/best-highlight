import { TokenPattern } from "../types";
import { commonPatterns } from "./common.patterns";

export const typescript: TokenPattern = {
  keyword: [
    /\b(?:const|let|var|function|return|if|else|for|while|do|break|continue|class|extends|new|this|interface|type|namespace|enum|implements|private|protected|public|static|readonly|as|keyof|typeof|instanceof)\b/,
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
  punctuation: [/[{}[\](),.;:]/],
  operator: [/[+\-*/%=<>!&|^~?]+/],
  identifier: [commonPatterns.identifier],
};
