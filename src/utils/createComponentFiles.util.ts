import { formatter } from './formatter.util';
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
      formatter(componentRender(component, components)),
    );
  });
  return path;
};

export default createComponentFiles;
