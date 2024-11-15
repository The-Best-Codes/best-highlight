import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist/rollup',
    format: 'esm',
    entryFileNames: 'index.js',
    assetFileNames: 'assets/[name][extname]'
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.rollup.json'
    }),
    postcss({
      extract: true,
      modules: false,
      minimize: true,
      sourceMap: true,
    }),
    terser()
  ]
};
