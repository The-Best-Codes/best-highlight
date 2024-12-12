import { createMinifier } from "dts-minify";
import { writeFileSync } from "fs";
import dts from "rollup-plugin-dts";
import ts from "typescript";

const minifier = createMinifier(ts);

const minifyPlugin = {
  name: "minify-dts",
  writeBundle(options, bundle) {
    for (const fileName in bundle) {
      const file = bundle[fileName];
      if (fileName.endsWith(".d.ts")) {
        const minified = minifier.minify(file.code, {
          keepJsDocs: false,
        });
        writeFileSync(options.file, minified);
      }
    }
  },
};

export default {
  input: "./src/index.ts",
  output: {
    file: "dist/index.d.ts",
    format: "es",
  },
  plugins: [dts(), minifyPlugin],
};
