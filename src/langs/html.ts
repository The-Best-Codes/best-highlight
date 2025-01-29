import { TokenPattern } from "../types";
import { commonPatterns } from "./common.patterns";

// HTML-specific patterns
const htmlPatterns = {
  openTagStart: new RegExp("<[a-zA-Z][\\w-]*"),
  closeTag: new RegExp("</[a-zA-Z][\\w-]*>"),
  tagEnd: new RegExp(">"),
  attribute: new RegExp("[^\\s/>\"'=]+(?=\\s*=)"),
  equals: new RegExp("="),
  whitespace: new RegExp("\\s+"),
};

export const html: TokenPattern = {
  tag: [htmlPatterns.openTagStart, htmlPatterns.closeTag, htmlPatterns.tagEnd],
  attribute: [htmlPatterns.attribute],
  string: [commonPatterns.stringDouble, commonPatterns.stringSingle].map(
    (p) => new RegExp(p.source, p.flags),
  ),
  comment: [/<!--(?:(?!-->)[\s\S])*-->/].map(
    (p) => new RegExp(p.source, p.flags),
  ),
  doctype: [new RegExp("<!DOCTYPE(?:\\s+[^>]+)?\\s*>", "i")],
  entity: [new RegExp("&(?:#x[a-f0-9]+|#[0-9]+|[a-z0-9]+);", "i")],
  identifier: [new RegExp("[a-zA-Z][\\w-]*")],
};
