# best-highlight

A lightweight, efficient syntax highlighting library with zero runtime dependencies. Supports both CommonJS and ES Modules, perfect for both browser and Node.js environments.

## Features

- 🚀 Zero runtime dependencies
- 📦 Tiny bundle size (~10KB minified)
- 🎨 Multiple themes (Light, Dark, Nord)
- 🔧 First-class TypeScript support
- 🌐 Universal compatibility (Browser, Node.js, Vite, React, etc.)
- ⚡ Fast tokenization using optimized RegExp patterns
- 🎯 Support for 7+ popular languages

## Installation

```bash
npm install best-highlight
```

## Usage

### Basic Usage

```javascript
import { highlight } from 'best-highlight';
import 'best-highlight/themes/base.css';

const code = `
function hello() {
  console.log("Hello, World!");
}
`;

const html = highlight(code, 'javascript');
```

### DOM Element Highlighting

```javascript
import { highlightElement } from 'best-highlight';
import 'best-highlight/themes.css';

// Highlight a pre element
const element = document.querySelector('pre');
element.setAttribute('data-language', 'javascript');
highlightElement(element);

// Change theme
element.setAttribute('data-theme', 'dark'); // or 'nord'
```

### Supported Languages

- JavaScript/TypeScript
- Python
- HTML
- CSS
- JSON
- Markdown
- More coming soon!

## Themes

Three built-in themes are available:
- Light (default)
- Dark
- Nord

To use a theme, add the `data-theme` attribute to your highlight container:
```html
<pre data-theme="dark">
  <!-- Your code here -->
</pre>
```

## API Reference

### highlight(code: string, language: string): string
Highlights code and returns HTML string with appropriate class names.

### highlightElement(element: HTMLElement): void
Highlights code within a DOM element. The element should have a `data-language` attribute.

### tokenize(code: string, language: string): Token[]
Low-level API that returns an array of tokens for custom processing.

## Browser Support

Works in all modern browsers:
- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

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

# Build the library
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## License

MIT 
