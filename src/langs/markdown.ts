import { TokenPattern } from "../types";

// Markdown-specific patterns
const markdownPatterns = {
  heading: new RegExp("^#{1,6}\\s+.*$", "m"),
  boldAsterisk: new RegExp("\\*\\*(?:[^*]|\\*(?!\\*))+\\*\\*"),
  boldUnderscore: new RegExp("__(?:[^_]|_(?!_))+__"),
  italicAsterisk: new RegExp("\\*(?:[^*]|\\*\\*)+?\\*"),
  italicUnderscore: new RegExp("_(?:[^_]|__)+?_"),
  link: new RegExp(
    '\\[([^\\[\\]]|\\[[^\\[\\]]*])*\\]\\([^()\\s]+(?:\\s+"[^"]*")?\\)',
  ),
  image: new RegExp(
    '!\\[([^\\[\\]]|\\[[^\\[\\]]*])*\\]\\([^()\\s]+(?:\\s+"[^"]*")?\\)',
  ),
  inlineCode: new RegExp("`[^`]+`"),
  codeBlock: new RegExp("```[\\s\\S]+?```"),
  unorderedList: new RegExp("^\\s*[-*+]\\s+.+$", "m"),
  orderedList: new RegExp("^\\s*\\d+\\.\\s+.+$", "m"),
  blockquote: new RegExp("^>\\s+.+$", "m"),
  horizontalRule: new RegExp("^(?:[-*_]){3,}$", "m"),
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
  code: [markdownPatterns.inlineCode, markdownPatterns.codeBlock],
  list: [markdownPatterns.unorderedList, markdownPatterns.orderedList],
  blockquote: [markdownPatterns.blockquote],
  horizontalRule: [markdownPatterns.horizontalRule],
  identifier: [new RegExp("[a-zA-Z][\\w-]*")],
};
