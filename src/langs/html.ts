import { TokenPattern } from "../types";
import { commonPatterns } from "./common.patterns";

// HTML-specific patterns
const htmlPatterns = {
  openTagStart: /<[a-zA-Z][\w-]*/,
  closeTag: /<\/[a-zA-Z][\w-]*>/,
  tagEnd: />/,
  attribute: /[^\s/>"'=]+(?=\s*=)/,
  equals: /=/,
  whitespace: /\s+/,
};

export const html: TokenPattern = {
  tag: [
    htmlPatterns.openTagStart,
    htmlPatterns.closeTag,
    htmlPatterns.tagEnd,
  ],
  attribute: [htmlPatterns.attribute],
  string: [
    commonPatterns.stringDouble,
    commonPatterns.stringSingle,
  ],
  comment: [/<!--(?:(?!-->)[\s\S])*-->/],
  doctype: [/<!DOCTYPE(?:\s+[^>]+)?\s*>/i],
  entity: [/&(?:#x[a-f0-9]+|#[0-9]+|[a-z0-9]+);/i],
  identifier: [/[a-zA-Z][\w-]*/],
};
