import { TokenPattern } from '../types';

export const markdown: TokenPattern = {
  heading: [/^#{1,6}\s+.*$/m],
  emphasis: [/\*\*[^*]+\*\*/, /\*[^*]+\*/, /__[^_]+__/, /_[^_]+_/],
  link: [/\[([^\]]+)\]\(([^)]+)\)/],
  image: [/!\[([^\]]+)\]\(([^)]+)\)/],
  code: [/`[^`]+`/, /```[\s\S]+?```/],
  list: [/^\s*[-*+]\s+.*$/m, /^\s*\d+\.\s+.*$/m],
  blockquote: [/^>\s+.*$/m],
  horizontalRule: [/^[-*_]{3,}$/m],
  identifier: [/[a-zA-Z0-9_]+/],
};
