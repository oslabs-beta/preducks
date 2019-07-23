import { format } from 'prettier/standalone.js';
import parserTypescript from 'prettier/parser-typescript';

export const formatter = text => format(
  text,
  {
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    jsxBracketSameLine: true,
    parser: 'typescript',
    plugins: [parserTypescript],
  },
  (err) => {
    if (err) {
      console.log('error formatting code !', err.message);
    }
  },
);
