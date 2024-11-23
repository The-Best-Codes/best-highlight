import { describe, expect, test } from "bun:test";
import { tokenize, highlight, highlightElement } from './index';

// Skip DOM-related tests when running in Bun
const describeDOM = process.versions.bun ? describe.skip : describe;

describe('tokenize', () => {
  test('should tokenize JavaScript code correctly', () => {
    const code = 'const x = 42; // comment';
    const tokens = tokenize(code, 'javascript');
    
    expect(tokens).toEqual([
      { type: 'keyword', content: 'const' },
      { type: 'text', content: ' ' },
      { type: 'identifier', content: 'x' },
      { type: 'text', content: ' ' },
      { type: 'operator', content: '=' },
      { type: 'text', content: ' ' },
      { type: 'number', content: '42' },
      { type: 'punctuation', content: ';' },
      { type: 'text', content: ' ' },
      { type: 'comment', content: '// comment' },
    ]);
  });

  test('should tokenize Python code correctly', () => {
    const code = 'def hello(): # function';
    const tokens = tokenize(code, 'python');
    
    expect(tokens).toEqual([
      { type: 'keyword', content: 'def' },
      { type: 'text', content: ' ' },
      { type: 'identifier', content: 'hello' },
      { type: 'punctuation', content: '(' },
      { type: 'punctuation', content: ')' },
      { type: 'punctuation', content: ':' },
      { type: 'text', content: ' ' },
      { type: 'comment', content: '# function' },
    ]);
  });

  test('should handle unknown languages', () => {
    const code = 'some code';
    const tokens = tokenize(code, 'unknown');
    expect(tokens).toEqual([{ type: 'text', content: 'some code' }]);
  });

  test('should tokenize TypeScript code correctly', () => {
    const code = 'interface User { name: string; }';
    const tokens = tokenize(code, 'typescript');
    
    expect(tokens).toEqual([
      { type: 'keyword', content: 'interface' },
      { type: 'text', content: ' ' },
      { type: 'identifier', content: 'User' },
      { type: 'text', content: ' ' },
      { type: 'punctuation', content: '{' },
      { type: 'text', content: ' ' },
      { type: 'identifier', content: 'name' },
      { type: 'punctuation', content: ':' },
      { type: 'text', content: ' ' },
      { type: 'type', content: 'string' },
      { type: 'punctuation', content: ';' },
      { type: 'text', content: ' ' },
      { type: 'punctuation', content: '}' }
    ]);
  });

  test('should tokenize HTML code correctly', () => {
    const code = '<div class="container">Hello</div>';
    const tokens = tokenize(code, 'html');
    
    expect(tokens).toEqual([
      { type: 'tag', content: '<div' },
      { type: 'text', content: ' ' },
      { type: 'attribute', content: 'class' },
      { type: 'punctuation', content: '=' },
      { type: 'string', content: '"container"' },
      { type: 'text', content: '>' },
      { type: 'text', content: 'H' },
      { type: 'text', content: 'e' },
      { type: 'text', content: 'l' },
      { type: 'text', content: 'l' },
      { type: 'text', content: 'o' },
      { type: 'tag', content: '</div' },
      { type: 'text', content: '>' }
    ]);
  });

  test('should tokenize CSS code correctly', () => {
    const code = '.container { color: #ff0000; }';
    const tokens = tokenize(code, 'css');
    
    expect(tokens).toEqual([
      { type: 'selector', content: '.container' },
      { type: 'text', content: ' ' },
      { type: 'punctuation', content: '{' },
      { type: 'text', content: ' ' },
      { type: 'selector', content: 'color' },
      { type: 'punctuation', content: ':' },
      { type: 'text', content: ' ' },
      { type: 'selector', content: '#ff0000' },
      { type: 'punctuation', content: ';' },
      { type: 'text', content: ' ' },
      { type: 'punctuation', content: '}' }
    ]);
  });

  test('should tokenize JSON code correctly', () => {
    const code = '{"name": "John", "age": 30}';
    const tokens = tokenize(code, 'json');
    
    expect(tokens).toEqual([
      { type: 'punctuation', content: '{' },
      { type: 'string', content: '"name"' },
      { type: 'punctuation', content: ':' },
      { type: 'text', content: ' ' },
      { type: 'string', content: '"John"' },
      { type: 'punctuation', content: ',' },
      { type: 'text', content: ' ' },
      { type: 'string', content: '"age"' },
      { type: 'punctuation', content: ':' },
      { type: 'text', content: ' ' },
      { type: 'number', content: '30' },
      { type: 'punctuation', content: '}' }
    ]);
  });

  test('should tokenize Markdown code correctly', () => {
    const code = '# Title\n**bold** *italic*';
    const tokens = tokenize(code, 'markdown');
    
    expect(tokens).toEqual([
      { type: 'heading', content: '#' },
      { type: 'text', content: ' ' },
      { type: 'text', content: 'T' },
      { type: 'text', content: 'i' },
      { type: 'text', content: 't' },
      { type: 'text', content: 'l' },
      { type: 'text', content: 'e' },
      { type: 'text', content: '\n' },
      { type: 'emphasis', content: '**bold**' },
      { type: 'text', content: ' ' },
      { type: 'emphasis', content: '*italic*' }
    ]);
  });
});

describe('highlight', () => {
  test('should generate HTML with correct classes', () => {
    const code = 'const x = 42;';
    const html = highlight(code, 'javascript');
    
    expect(html).toContain('class="bh-npm-token bh-npm-keyword"');
    expect(html).toContain('class="bh-npm-token bh-npm-number"');
    expect(html).toContain('class="bh-npm-token bh-npm-punctuation"');
  });

  test('should escape HTML special characters', () => {
    const code = 'const html = "<div>";';
    const html = highlight(code, 'javascript');
    
    expect(html).toContain('&lt;div&gt;');
    expect(html).not.toContain('<div>');
  });

  test('should escape all HTML special characters', () => {
    const code = 'const html = "<div class=\'test\'>&";';
    const html = highlight(code, 'javascript');
    
    expect(html).toContain('&lt;div');
    expect(html).toContain('class=&#039;test&#039;');
    expect(html).toContain('&amp;');
    expect(html).not.toContain('<div');
  });
});

describeDOM('highlightElement', () => {
  test('should highlight DOM element content', () => {
    // Create a mock element
    const element = document.createElement('pre');
    element.textContent = 'const x = 42;';
    element.setAttribute('data-language', 'javascript');

    highlightElement(element);

    expect(element.innerHTML).toContain('class="bh-npm-token bh-npm-keyword"');
    expect(element.classList.contains('bh-npm-highlight')).toBe(true);
  });

  test('should handle missing language attribute', () => {
    const element = document.createElement('pre');
    element.textContent = 'some text';

    highlightElement(element);

    expect(element.innerHTML).toContain('class="bh-npm-token bh-npm-text"');
  });

  test('should handle empty text content', () => {
    const element = document.createElement('pre');
    element.textContent = '';
    
    highlightElement(element);
    
    expect(element.innerHTML).toBe('<span class="bh-npm-token bh-npm-text"></span>');
    expect(element.classList.contains('bh-npm-highlight')).toBe(true);
  });
});
