export interface Token {
  type: string;
  content: string;
}

export interface TokenRule {
  type: string;
  match: (scanner: Scanner) => Token | null;
}

export interface Scanner {
  pos: number;
  input: string;
  peek(offset?: number): string;
  consume(length?: number): string;
  hasMore(): boolean;
  match(pattern: RegExp): RegExpMatchArray | null;
  isWhitespace(): boolean;
  skipWhitespace(): void;
}

export interface Language {
  name: string;
  rules: TokenRule[];
  fallback?: (scanner: Scanner) => Token | null;
}
