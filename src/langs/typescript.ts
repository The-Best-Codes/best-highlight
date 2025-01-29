import { TokenPattern } from "../types";
import { commonPatterns } from "./common.patterns";

export const typescript: TokenPattern = {
  keyword: [
    new RegExp(
      "\\b(?:const|let|var|function|return|if|else|for|while|do|break|continue|class|extends|new|this|interface|type|namespace|enum|implements|private|protected|public|static|readonly|as|keyof|typeof|instanceof)\\b",
    ),
  ],
  string: [
    commonPatterns.stringDouble,
    commonPatterns.stringSingle,
    commonPatterns.stringBacktick,
  ].map((p) => new RegExp(p.source, p.flags)),
  number: [commonPatterns.number].map((p) => new RegExp(p.source, p.flags)),
  comment: [commonPatterns.lineComment, commonPatterns.blockComment].map(
    (p) => new RegExp(p.source, p.flags),
  ),
  punctuation: [new RegExp("[{}()\\[\\],.;:]")],
  operator: [new RegExp("[+\\-*/%=<>!&|^~?]+")],
  identifier: [commonPatterns.identifier].map(
    (p) => new RegExp(p.source, p.flags),
  ),
};
