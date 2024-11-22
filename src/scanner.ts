import { Scanner } from "./types";

export class TextScanner implements Scanner {
  pos: number = 0;

  constructor(public input: string) {}

  peek(offset: number = 0): string {
    return this.input[this.pos + offset] || "";
  }

  consume(length: number = 1): string {
    const value = this.input.slice(this.pos, this.pos + length);
    this.pos += length;
    return value;
  }

  hasMore(): boolean {
    return this.pos < this.input.length;
  }

  match(pattern: RegExp): RegExpMatchArray | null {
    const slice = this.input.slice(this.pos);
    const match = slice.match(pattern);
    if (match && match.index === 0) {
      return match;
    }
    return null;
  }

  isWhitespace(): boolean {
    return /\s/.test(this.peek());
  }

  skipWhitespace(): void {
    while (this.hasMore() && this.isWhitespace()) {
      this.consume();
    }
  }
}
