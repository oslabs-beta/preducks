import fs from 'fs';
import { format } from 'prettier';
import componentRender from './componentRender.util';

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
      parser: 'typescript'
    }));
  });
  return path;
};

export default createComponentFiles;
