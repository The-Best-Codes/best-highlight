#!/usr/bin/env bun
export {};

const inputFile = Bun.argv[2];
if (!inputFile) {
  console.error("Please provide a CSS file to minify");
  process.exit(1);
}

const css = await Bun.file(inputFile).text();

// Simple CSS minification
const minified = css
  .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "") // Remove comments and whitespace
  .replace(/ {2,}/g, " ") // Remove multiple spaces
  .replace(/ ([{:}]) /g, "$1") // Remove spaces around brackets and colons
  .replace(/([{:}]) /g, "$1") // Remove spaces after brackets and colons
  .replace(/;}/g, "}") // Remove last semicolon in block
  .trim();

console.log(minified);
