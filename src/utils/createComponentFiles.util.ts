// import fs from 'fs';
// import { format } from 'prettier-standalone';
import componentRender from './componentRender.util';
import { format } from 'prettier/standalone.js';
import parserTypescript from 'prettier/parser-typescript.js';

const createComponentFiles = (
  components: any,
  path: string,
  appName: string,
  exportAppBool: boolean,
  zip: any
) => {

  components.forEach((component: any) => {
    zip.file(`src/components/${component.title}.tsx`, format(componentRender(component, components), {
      singleQuote: true,
      trailingComma: 'es5',
      bracketSpacing: true,
      jsxBracketSameLine: true,
      parser: 'typescript',
      plugins: [parserTypescript]
    }));
  });
  return path;
};

export default createComponentFiles;
