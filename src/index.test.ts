import { beforeAll, describe, expect, test } from "bun:test";
import { JSDOM } from "jsdom";
import {
  highlight,
  highlightElement,
  highlightElements,
  highlightLarge,
  highlightStream,
  tokenize,
  tokenizeStream,
} from "./index";

// Setup DOM environment
let dom: JSDOM;
let document: Document;

beforeAll(() => {
  dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
  document = dom.window.document;
  global.document = document;
  // @ts-expect-error - global.window is not typed
  global.window = dom.window;
});

describe("tokenize", () => {
  test("should tokenize JavaScript code correctly", () => {
    const code = "const x = 42; // comment";
    const tokens = tokenize(code, "javascript");

    expect(tokens).toEqual([
      { type: "keyword", content: "const" },
      { type: "text", content: " x " },
      { type: "operator", content: "=" },
      { type: "text", content: " " },
      { type: "number", content: "42" },
      { type: "punctuation", content: ";" },
      { type: "text", content: " " },
      { type: "comment", content: "// comment" },
    ]);
  });

  test("should tokenize Python code correctly", () => {
    const code = "def hello(): # function";
    const tokens = tokenize(code, "python");

    expect(tokens).toEqual([
      { type: "keyword", content: "def" },
      { type: "text", content: " hello" },
      { type: "punctuation", content: "():" },
      { type: "text", content: " " },
      { type: "comment", content: "# function" },
    ]);
  });

  test("should handle unknown languages", () => {
    const code = "some code";
    const tokens = tokenize(code, "unknown");
    expect(tokens).toEqual([{ type: "text", content: "some code" }]);
  });

  test("should tokenize TypeScript code correctly", () => {
    const code = "interface User { name: string; }";
    const tokens = tokenize(code, "typescript");

    expect(tokens).toEqual([
      { type: "keyword", content: "interface" },
      { type: "text", content: " " },
      { type: "identifier", content: "User" },
      { type: "text", content: " " },
      { type: "punctuation", content: "{" },
      { type: "text", content: " " },
      { type: "identifier", content: "name" },
      { type: "punctuation", content: ":" },
      { type: "text", content: " " },
      { type: "identifier", content: "string" },
      { type: "punctuation", content: ";" },
      { type: "text", content: " " },
      { type: "punctuation", content: "}" },
    ]);
  });

  test("should tokenize HTML code correctly", () => {
    const code = '<div class="container">Hello</div>';
    const tokens = tokenize(code, "html");

    expect(tokens).toEqual([
      { type: "tag", content: "<div" },
      { type: "text", content: " " },
      { type: "attribute", content: "class" },
      { type: "text", content: "=" },
      { type: "string", content: '"container"' },
      { type: "tag", content: ">" },
      { type: "text", content: "Hello" },
      { type: "tag", content: "</div>" },
    ]);
  });

  test("should tokenize CSS code correctly", () => {
    const code = ".container { color: #ff0000; }";
    const tokens = tokenize(code, "css");

    expect(tokens).toEqual([
      { type: "selector", content: ".container" },
      { type: "text", content: " " },
      { type: "punctuation", content: "{" },
      { type: "text", content: " " },
      { type: "property", content: "color" },
      { type: "punctuation", content: ":" },
      { type: "text", content: " " },
      { type: "value", content: "#ff0000" },
      { type: "punctuation", content: ";" },
      { type: "text", content: " " },
      { type: "punctuation", content: "}" },
    ]);
  });

  test("should tokenize JSON code correctly", () => {
    const code = '{"name": "John", "age": 30}';
    const tokens = tokenize(code, "json");

    expect(tokens).toEqual([
      { type: "punctuation", content: "{" },
      { type: "string", content: '"name"' },
      { type: "punctuation", content: ":" },
      { type: "text", content: " " },
      { type: "string", content: '"John"' },
      { type: "punctuation", content: "," },
      { type: "text", content: " " },
      { type: "string", content: '"age"' },
      { type: "punctuation", content: ":" },
      { type: "text", content: " " },
      { type: "number", content: "30" },
      { type: "punctuation", content: "}" },
    ]);
  });

  test("should tokenize Markdown code correctly", () => {
    const code = "# Title\n**bold** *italic*";
    const tokens = tokenize(code, "markdown");

    expect(tokens).toEqual([
      { type: "heading", content: "# Title" },
      { type: "text", content: "\n" },
      { type: "emphasis", content: "**bold**" },
      { type: "text", content: " " },
      { type: "emphasis", content: "*italic*" },
    ]);
  });
});

describe("highlight", () => {
  test("should generate HTML with correct classes", () => {
    const code = "const x = 42;";
    const html = highlight(code, "javascript");

    expect(html).toContain('class="bh-npm-token bh-npm-keyword"');
    expect(html).toContain('class="bh-npm-token bh-npm-number"');
    expect(html).toContain('class="bh-npm-token bh-npm-punctuation"');
  });

  test("should escape HTML special characters", () => {
    const code = 'const html = "<div>";';
    const html = highlight(code, "javascript");

    expect(html).toContain("&lt;div&gt;");
    expect(html).not.toContain("<div>");
  });

  test("should escape all HTML special characters", () => {
    const code = "const html = \"<div class='test'>&\";";
    const html = highlight(code, "javascript");

    expect(html).toContain("&lt;div");
    expect(html).toContain("class=&#039;test&#039;");
    expect(html).toContain("&amp;");
    expect(html).not.toContain("<div");
  });
});

describe("highlightElement", () => {
  test("should highlight DOM element content", () => {
    const element = document.createElement("pre");
    element.textContent = "const x = 42;";
    element.setAttribute("data-language", "javascript");

    highlightElement(element);

    expect(element.innerHTML).toContain('class="bh-npm-token bh-npm-keyword"');
    expect(element.classList.contains("bh-npm-highlight")).toBe(true);
  });

  test("should handle missing language attribute", () => {
    const element = document.createElement("pre");
    element.textContent = "some text";

    highlightElement(element);

    expect(element.innerHTML).toContain('class="bh-npm-token bh-npm-text"');
  });

  test("should handle empty text content", () => {
    const element = document.createElement("pre");
    element.textContent = "";

    highlightElement(element);

    expect(element.innerHTML).toBe(
      '<span class="bh-npm-token bh-npm-text"></span>',
    );
    expect(element.classList.contains("bh-npm-highlight")).toBe(true);
  });
});

describe("tokenizeStream", () => {
  test("should stream tokenize small code in single chunk", () => {
    const code = "const x = 42;";
    const chunks = Array.from(tokenizeStream(code, "javascript"));

    expect(chunks).toHaveLength(1);
    expect(chunks[0].length).toBeGreaterThan(0);
    expect(chunks[0].some((token) => token.type === "keyword")).toBe(true);
    expect(chunks[0].some((token) => token.type === "number")).toBe(true);
  });

  test("should stream tokenize large code in multiple chunks", () => {
    const code = Array.from(
      { length: 100 },
      (_, i) => `const var${i} = ${i};`,
    ).join("\n");
    const chunks = Array.from(tokenizeStream(code, "javascript", 100));

    expect(chunks.length).toBeGreaterThan(1);

    // Verify all tokens are present when flattened
    const allTokens = chunks.flat();
    expect(allTokens.length).toBeGreaterThan(0);
    expect(allTokens.some((token) => token.type === "keyword")).toBe(true);
    expect(allTokens.some((token) => token.type === "number")).toBe(true);
  });

  test("should handle empty code in stream", () => {
    const chunks = Array.from(tokenizeStream("", "javascript"));
    expect(chunks).toHaveLength(0);
  });

  test("should find safe break points in streaming", () => {
    const code = "function test() {\n  return 42;\n}";
    const chunks = Array.from(tokenizeStream(code, "javascript", 10));

    expect(chunks.length).toBeGreaterThan(1);
    // Should break at whitespace/newlines when possible
    const allTokens = chunks.flat();
    expect(allTokens.some((token) => token.content.includes("function"))).toBe(
      true,
    );
  });

  test("should process remaining buffer in streaming", () => {
    // Create code that will have a remaining buffer after chunking
    const code = "const a = 1; const b = 2; const c = 3;";
    const chunks = Array.from(tokenizeStream(code, "javascript", 15));

    expect(chunks.length).toBeGreaterThan(1);

    // Verify all content is processed (including remaining buffer)
    const allTokens = chunks.flat();
    const allContent = allTokens.map((t) => t.content).join("");
    expect(allContent).toBe(code);
  });

  test("should handle buffer remainder without safe break point", () => {
    // Create a scenario where the buffer remainder can't find a safe break point
    // This should force the remaining buffer to be processed (line 189)
    const code = "abcdefghijklmnopqrstuvwxyz"; // No whitespace for safe breaks
    const chunks = Array.from(tokenizeStream(code, "javascript", 10));

    expect(chunks.length).toBeGreaterThan(1);

    // Verify the last chunk contains the remainder
    const allTokens = chunks.flat();
    const allContent = allTokens.map((t) => t.content).join("");
    expect(allContent).toBe(code);

    // The last chunk should contain the final characters
    const lastChunk = chunks[chunks.length - 1];
    expect(lastChunk.length).toBeGreaterThan(0);
  });
});

describe("highlightStream", () => {
  test("should stream highlight small code", () => {
    const code = "const x = 42;";
    const htmlChunks = Array.from(highlightStream(code, "javascript"));

    expect(htmlChunks).toHaveLength(1);
    expect(htmlChunks[0]).toContain('class="bh-npm-token bh-npm-keyword"');
    expect(htmlChunks[0]).toContain('class="bh-npm-token bh-npm-number"');
  });

  test("should stream highlight large code in chunks", () => {
    const code = Array.from(
      { length: 50 },
      (_, i) => `const var${i} = ${i};`,
    ).join("\n");
    const htmlChunks = Array.from(highlightStream(code, "javascript", 50));

    expect(htmlChunks.length).toBeGreaterThan(1);

    // Verify HTML structure in chunks
    const fullHtml = htmlChunks.join("");
    expect(fullHtml).toContain('class="bh-npm-token bh-npm-keyword"');
    expect(fullHtml).toContain('class="bh-npm-token bh-npm-number"');
  });

  test("should handle custom chunk sizes", () => {
    const code = "function test() { return 42; }";
    const smallChunks = Array.from(highlightStream(code, "javascript", 5));
    const largeChunks = Array.from(highlightStream(code, "javascript", 100));

    expect(smallChunks.length).toBeGreaterThanOrEqual(largeChunks.length);

    // Both should contain the same keywords and structure
    const smallHtml = smallChunks.join("");
    const largeHtml = largeChunks.join("");

    expect(smallHtml).toContain("bh-npm-keyword");
    expect(largeHtml).toContain("bh-npm-keyword");
    expect(smallHtml).toContain("bh-npm-number");
    expect(largeHtml).toContain("bh-npm-number");
  });
});

describe("highlightLarge", () => {
  test("should handle small code efficiently", () => {
    const code = "const x = 42;";
    const html = highlightLarge(code, "javascript");

    expect(html).toContain('class="bh-npm-token bh-npm-keyword"');
    expect(html).toContain('class="bh-npm-token bh-npm-number"');
  });

  test("should handle large code with chunking", () => {
    const code = Array.from(
      { length: 1000 },
      (_, i) => `const var${i} = ${i};`,
    ).join("\n");
    const html = highlightLarge(code, "javascript");

    expect(html).toContain('class="bh-npm-token bh-npm-keyword"');
    expect(html).toContain('class="bh-npm-token bh-npm-number"');
    expect(html.length).toBeGreaterThan(code.length);
  });

  test("should produce same output as regular highlight for small code", () => {
    const code = "function test() { return 42; }";
    const regularHtml = highlight(code, "javascript");
    const largeHtml = highlightLarge(code, "javascript");

    expect(regularHtml).toBe(largeHtml);
  });
});

describe("highlightElements", () => {
  test("should highlight multiple elements", (done) => {
    const elements = [
      document.createElement("pre"),
      document.createElement("pre"),
      document.createElement("pre"),
    ];

    elements[0].textContent = "const x = 1;";
    elements[0].setAttribute("data-language", "javascript");

    elements[1].textContent = "def hello(): pass";
    elements[1].setAttribute("data-language", "python");

    elements[2].textContent = '{ "key": "value" }';
    elements[2].setAttribute("data-language", "json");

    highlightElements(elements);

    // Use setTimeout to allow async processing to complete
    setTimeout(() => {
      elements.forEach((element) => {
        expect(element.innerHTML).toContain('class="bh-npm-token');
        expect(element.classList.contains("bh-npm-highlight")).toBe(true);
      });
      done();
    }, 100);
  });

  test("should handle empty elements array", () => {
    expect(() => highlightElements([])).not.toThrow();
  });

  test("should handle elements without data-language", (done) => {
    const element = document.createElement("pre");
    element.textContent = "some text";

    highlightElements([element]);

    setTimeout(() => {
      expect(element.innerHTML).toContain('class="bh-npm-token bh-npm-text"');
      expect(element.classList.contains("bh-npm-highlight")).toBe(true);
      done();
    }, 50);
  });

  test("should process large batches efficiently", (done) => {
    const elements = Array.from({ length: 25 }, () => {
      const element = document.createElement("pre");
      element.textContent = "const x = 42;";
      element.setAttribute("data-language", "javascript");
      return element;
    });

    highlightElements(elements);

    setTimeout(() => {
      elements.forEach((element) => {
        expect(element.innerHTML).toContain(
          'class="bh-npm-token bh-npm-keyword"',
        );
        expect(element.classList.contains("bh-npm-highlight")).toBe(true);
      });
      done();
    }, 200);
  });
});
