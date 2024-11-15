import { describe, it, expect } from 'vitest';
import { tokenize, highlight, highlightElement } from './index';

describe('tokenize', () => {
  it('should tokenize JavaScript code correctly', () => {
    const code = 'const x = 42; // comment';
    const tokens = tokenize(code, 'javascript');
    
    expect(tokens).toEqual([
      { type: 'keyword', content: 'const' },
      { type: 'text', content: ' ' },
      { type: 'text', content: 'x' },
      { type: 'text', content: ' ' },
      { type: 'operator', content: '=' },
      { type: 'text', content: ' ' },
      { type: 'number', content: '42' },
      { type: 'punctuation', content: ';' },
      { type: 'text', content: ' ' },
      { type: 'comment', content: '// comment' },
    ]);
  });

  it('should tokenize Python code correctly', () => {
    const code = 'def hello(): # function';
    const tokens = tokenize(code, 'python');
    
    expect(tokens).toEqual([
      { type: 'keyword', content: 'def' },
      { type: 'text', content: ' ' },
      { type: 'text', content: 'hello' },
      { type: 'punctuation', content: '(' },
      { type: 'punctuation', content: ')' },
      { type: 'punctuation', content: ':' },
      { type: 'text', content: ' ' },
      { type: 'comment', content: '# function' },
    ]);
  });

  it('should handle unknown languages', () => {
    const code = 'some code';
    const tokens = tokenize(code, 'unknown');
    expect(tokens).toEqual([{ type: 'text', content: 'some code' }]);
  });

  it('should tokenize TypeScript code correctly', () => {
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
      { type: 'identifier', content: 'string' },
      { type: 'punctuation', content: ';' },
      { type: 'text', content: ' ' },
      { type: 'punctuation', content: '}' }
    ]);
  });

  it('should tokenize HTML code correctly', () => {
    const code = '<div class="container">Hello</div>';
    const tokens = tokenize(code, 'html');
    
    expect(tokens).toEqual([
      { type: 'tag', content: '<div' },
      { type: 'text', content: ' ' },
      { type: 'attribute', content: 'class' },
      { type: 'text', content: '=' },
      { type: 'string', content: '"container"' },
      { type: 'tag', content: '>' },
      { type: 'text', content: 'Hello' },
      { type: 'tag', content: '</div>' }
    ]);
  });

  it('should tokenize CSS code correctly', () => {
    const code = '.container { color: #ff0000; }';
    const tokens = tokenize(code, 'css');
    
    expect(tokens).toEqual([
      { type: 'selector', content: '.container' },
      { type: 'text', content: ' ' },
      { type: 'punctuation', content: '{' },
      { type: 'text', content: ' ' },
      { type: 'property', content: 'color' },
      { type: 'punctuation', content: ':' },
      { type: 'text', content: ' ' },
      { type: 'value', content: '#ff0000' },
      { type: 'punctuation', content: ';' },
      { type: 'text', content: ' ' },
      { type: 'punctuation', content: '}' }
    ]);
  });

  it('should tokenize JSON code correctly', () => {
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

  it('should tokenize Markdown code correctly', () => {
    const code = '# Title\n**bold** *italic*';
    const tokens = tokenize(code, 'markdown');
    
    expect(tokens).toEqual([
      { type: 'heading', content: '# Title' },
      { type: 'text', content: '\n' },
      { type: 'emphasis', content: '**bold**' },
      { type: 'text', content: ' ' },
      { type: 'emphasis', content: '*italic*' }
    ]);
  });
});

describe('highlight', () => {
  it('should generate HTML with correct classes', () => {
    const code = 'const x = 42;';
    const html = highlight(code, 'javascript');
    
    expect(html).toContain('class="bh-npm-token bh-npm-keyword"');
    expect(html).toContain('class="bh-npm-token bh-npm-number"');
    expect(html).toContain('class="bh-npm-token bh-npm-punctuation"');
  });

  it('should escape HTML special characters', () => {
    const code = 'const html = "<div>";';
    const html = highlight(code, 'javascript');
    
    expect(html).toContain('&lt;div&gt;');
    expect(html).not.toContain('<div>');
  });

  it('should escape all HTML special characters', () => {
    const code = 'const html = "<div class=\'test\'>&";';
    const html = highlight(code, 'javascript');
    
    expect(html).toContain('&lt;div');
    expect(html).toContain('class=&#039;test&#039;');
    expect(html).toContain('&amp;');
    expect(html).not.toContain('<div');
  });
});

describe('highlightElement', () => {
  it('should highlight DOM element content', () => {
    // Create a mock element
    const element = document.createElement('pre');
    element.textContent = 'const x = 42;';
    element.setAttribute('data-language', 'javascript');

    highlightElement(element);

    expect(element.innerHTML).toContain('class="bh-npm-token bh-npm-keyword"');
    expect(element.classList.contains('bh-npm-highlight')).toBe(true);
  });

  it('should handle missing language attribute', () => {
    const element = document.createElement('pre');
    element.textContent = 'some text';

    highlightElement(element);

    expect(element.innerHTML).toContain('class="bh-npm-token bh-npm-text"');
  });

  it('should handle empty text content', () => {
    const element = document.createElement('pre');
    element.textContent = '';
    
    highlightElement(element);
    
    expect(element.innerHTML).toBe('<span class="bh-npm-token bh-npm-text"></span>');
    expect(element.classList.contains('bh-npm-highlight')).toBe(true);
  });
});
