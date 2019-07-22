// import fs from 'fs';
// import { format } from 'prettier-standalone';
import { format } from 'prettier/standalone.js';
import parserBabylon from 'prettier/parser-babylon.js';
import componentRender from './componentRender.util';

const createComponentFiles = (
  components: any,
  path: string,
  appName: string,
  exportAppBool: boolean,
  zip: any,
) => {
  components.forEach((component: any) => {
    zip.file(
      `src/components/${component.title}.tsx`,
      format(componentRender(component, components), {
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        jsxBracketSameLine: true,
        parser: 'babel',
        plugins: [parserBabylon],
      }),
    );
  });
  return path;
};

export default createComponentFiles;
