import { TokenPattern } from '../types';

export const html: TokenPattern = {
  tag: [/<[a-zA-Z0-9-]+/, /<\/[a-zA-Z0-9-]+>/, />/],
  attribute: [/[a-zA-Z0-9-]+(?=\s*=)/],
  string: [/"[^"]*"|'[^']*'/],
  comment: [/<!--[\s\S]*?-->/],
  doctype: [/<!DOCTYPE[^>]+>/i],
  entity: [/&[a-zA-Z0-9]+;|&#[0-9]+;|&#x[a-f0-9]+;/i],
  identifier: [/[a-zA-Z0-9-]+/],
};
