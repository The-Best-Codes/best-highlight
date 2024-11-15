import { TokenPattern } from '../types';

export const python: TokenPattern = {
  keyword: [
    /\b(def|class|if|else|elif|for|while|break|continue|return|import|from|as|try|except|finally|raise|with|lambda)\b/,
  ],
  string: [/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|"""[\s\S]*?"""|'''[\s\S]*?'''/],
  number: [/\b\d+\.?\d*\b/],
  comment: [/#.*$/m],
  punctuation: [/[{}[\](),.;:]/],
  operator: [/[+\-*/%=<>!&|^~@]/],
  identifier: [/[a-zA-Z_]\w*/],
};
