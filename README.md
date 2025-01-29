# best-highlight

<img alt="Best Highlight Logo" src="https://github.com/user-attachments/assets/b6d7abd3-e893-41dc-b46e-45c147c9a026" for="cover" width="300" />

[npm Library](https://npmjs.com/package/best-highlight)

A lightweight, efficient syntax highlighting library with zero runtime dependencies. Supports both CommonJS and ES Modules, perfect for both browser and Node.js environments.

## Features

- 🚀 Zero runtime dependencies
- 📦 Tiny bundle size
- 🎨 Multiple themes (Light, Dark, Nord, GitHub)
- 🔧 First-class TypeScript support
- 🌐 Universal compatibility (Browser, Node.js)
- ⚡ Fast and reliable tokenization using optimized scanner
- 🎯 Support for 7 popular languages with comprehensive test coverage

## Installation

```bash
npm install best-highlight
```

## Browser Usage

To use the library in a browser environment:

1. Include the library in your HTML file:

```html
<script src="https://cdn.jsdelivr.net/npm/best-highlight@latest/dist/browser/index.global.js"></script>
```

2. Use the global `bestHighlight` function to highlight code:

```javascript
bestHighlight.highlight(
  'function hello() {\n  console.log("Hello, World!");\n}',
  "javascript",
);
```

3. Write your own styles or use the provided themes:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/best-highlight@latest/dist/themes/light.css"
/>
```

Example:

```html
<html>
  <head>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/best-highlight@latest/dist/themes/light.css"
    />
    <script src="https://cdn.jsdelivr.net/npm/best-highlight@latest/dist/browser/index.global.js"></script>
  </head>
  <body>
    <pre data-language="javascript" id="code">
      function hello() {
        console.log("Hello, World!");
      }
    </pre>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        bestHighlight.highlightElement(document.getElementById("code"));
      });
    </script>
  </body>
</html>
```

## Usage

### Basic Usage

```javascript
import { highlight } from "best-highlight";

const code = `function hello() {
  console.log("Hello, World!");
}`;

const html = highlight(code, "javascript");
```

### DOM Element Highlighting

```javascript
import { highlightElement } from "best-highlight";

// Highlight a pre element
const element = document.querySelector("pre");
element.setAttribute("data-language", "javascript");
highlightElement(element);
```

### Supported Languages

The library provides robust support for 7 programming languages:

- JavaScript (keywords, operators, strings, comments)
- TypeScript (with identifier preservation)
- Python (keywords, functions, strings, comments)
- HTML (tags, attributes, strings, comments, doctypes, entities)
- CSS (selectors, properties, values, punctuation)
- JSON (strings, numbers, punctuation)
- Markdown (headings, emphasis)

## Themes

Four built-in themes are available:

- Light (default)
- Dark
- Nord
- GitHub

Each theme is available as a separate CSS file in the themes directory:

```css
/* Choose one of: */
import 'best-highlight/themes/light.css'
import 'best-highlight/themes/dark.css'
import 'best-highlight/themes/nord.css'
import 'best-highlight/themes/github.css'
```

## API Reference

### highlight(code: string, language: string): string

Highlights code and returns HTML string with appropriate class names. Each token is wrapped in a `span` with classes `bh-npm-token` and `bh-npm-{type}`.

### highlightElement(element: HTMLElement): void

Highlights code within a DOM element. The element should have a `data-language` attribute specifying the language. Adds the `bh-npm-highlight` class to the element.

### tokenize(code: string, language: string): Token[]

Low-level API that returns an array of tokens for custom processing. Each token has:

- `type`: string (e.g., 'keyword', 'string', 'comment')
- `content`: string (the actual token content)

## Testing

The library includes comprehensive test coverage for all supported languages and features:

- Language-specific tokenization tests
- HTML generation and escaping
- DOM element highlighting
- Theme application
- Edge cases (empty content, unknown languages)

Run tests with:

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test
```

## License

MIT
