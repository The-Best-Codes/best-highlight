import { TokenPattern } from "../types";

// Markdown-specific patterns
const markdownPatterns = {
  heading: /^#{1,6}\s+.*$/m,
  boldAsterisk: /\*\*(?:[^*]|\*(?!\*))+\*\*/,
  boldUnderscore: /__(?:[^_]|_(?!_))+__/,
  italicAsterisk: /\*(?:[^*]|\*\*)+?\*/,
  italicUnderscore: /_(?:[^_]|__)+?_/,
  link: /\[([^[\]]|\[[^[\]]*])*]\([^()\s]+(?:\s+"[^"]*")?\)/,
  image: /!\[([^[\]]|\[[^[\]]*])*]\([^()\s]+(?:\s+"[^"]*")?\)/,
  inlineCode: /`[^`]+`/,
  codeBlock: /```[\s\S]+?```/,
  unorderedList: /^\s*[-*+]\s+.+$/m,
  orderedList: /^\s*\d+\.\s+.+$/m,
  blockquote: /^>\s+.+$/m,
  horizontalRule: /^(?:[-*_]){3,}$/m,
};

export const markdown: TokenPattern = {
  heading: [markdownPatterns.heading],
  emphasis: [
    markdownPatterns.boldAsterisk,
    markdownPatterns.boldUnderscore,
    markdownPatterns.italicAsterisk,
    markdownPatterns.italicUnderscore,
  ],
  link: [markdownPatterns.link],
  image: [markdownPatterns.image],
  code: [
    markdownPatterns.inlineCode,
    markdownPatterns.codeBlock,
  ],
  list: [
    markdownPatterns.unorderedList,
    markdownPatterns.orderedList,
  ],
  blockquote: [markdownPatterns.blockquote],
  horizontalRule: [markdownPatterns.horizontalRule],
  identifier: [/[a-zA-Z][\w-]*/],
};
