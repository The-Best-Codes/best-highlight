import { TokenPattern } from '../types';

export const typescript: TokenPattern = {
  keyword: [
    /\b(const|let|var|function|return|if|else|for|while|do|break|continue|class|extends|new|this|interface|type|namespace|enum|implements|private|protected|public|static|readonly|as|keyof|typeof|instanceof)\b/,
  ],
  string: [/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/],
  number: [/\b\d+\.?\d*\b/],
  comment: [/\/\/.*$/m, /\/\*[\s\S]*?\*\//],
  punctuation: [/[{}[\](),.;:]/],
  operator: [/[+\-*/%=<>!&|^~?]/],
  identifier: [/[a-zA-Z_$][a-zA-Z0-9_$]*/],
};
