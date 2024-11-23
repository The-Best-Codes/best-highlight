// Shared patterns that can be reused across language files
export const commonPatterns = {
  stringDouble: /"(?:\\[\s\S]|[^"\\])*"/,
  stringSingle: /'(?:\\[\s\S]|[^'\\])*'/,
  stringBacktick: /`(?:\\[\s\S]|[^`\\])*`/,
  number: /(?:\b\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?\b/,
  lineComment: /\/\/[^\n]*/,
  blockComment: /\/\*[\s\S]*?\*\//,
  identifier: /[a-zA-Z_$][\w$]*/,
};
