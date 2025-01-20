import resolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js', // Entry point
  output: [
    {
      file: 'dist/index.cjs.js', // CommonJS output
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js', // ES Module output
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: ['react', 'react-dom', 'jotai'], // Peer dependencies

  plugins: [
    resolve({
      extensions: ['.js', '.jsx'], // Add .jsx to extensions
    }),
    json(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules',
      extensions: ['.js', '.jsx'],
      presets: [
        ["@babel/preset-react", { runtime: "automatic" }]
      ]
    }),
    postcss({
      extract: true, // Extracts CSS into a separate file
      minimize: true, // Minifies the CSS
      sourceMap: true, // Generates source maps
    }),
    terser(),
  ],
};
