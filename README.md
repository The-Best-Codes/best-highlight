# best-highlight

A lightweight, efficient syntax highlighting library with zero runtime dependencies. Supports both CommonJS and ES Modules.

## Features

- 🚀 Zero runtime dependencies
- 📦 Tiny bundle size
- 🎨 Multiple themes (Light, Dark, Nord)
- 🔧 TypeScript support
- 🌐 Works everywhere (Browser, Node.js, Vite, React, etc.)
- ⚡ Fast tokenization using RegExp

## Installation

```bash
npm install best-highlight
```

## Usage

### Basic Usage

```javascript
import { highlight } from 'best-highlight';
import 'best-highlight/themes.css'; // Optional: import default themes

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

- JavaScript
- Python
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

## Browser Support

Works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

MIT
