import {
  ComponentInt,
  ComponentsInt,
  ChildInt,
  ChildrenInt,
  PropInt,
  ComponentStateInterface,
} from './Interfaces';
import cloneDeep from './cloneDeep';
import store from '../store';
import preducksDefaultDisplay from './preducksDefaultDisplay';

// testing stuff
// import { format } from 'prettier'; // also for testing
// import { dummyComponent, dummyAllComponents } from './dummyData';

const componentRender = (component: ComponentInt, components: ComponentsInt) => {
  const {
    childrenArray,
    title,
    props,
    selectors,
    actions,
    componentState,
  }: {
  childrenArray: ChildrenInt;
  title: string;
  props: PropInt[];
  selectors: string[];
  actions: string[];
  componentState: ComponentStateInterface[];
  } = component;
  function typeSwitcher(type: string) {
    switch (type) {
      case 'string':
        return 'string';
      case 'number':
        return 'number';
      case 'object':
        return 'object';
      case 'array':
        return 'any[]';
      case 'boolean':
        return 'boolean';
      case 'function':
        return '() => any';
      case 'node':
        return 'string';
      case 'element':
        return 'string';
      case 'tuple':
        return '[any]';
      case 'enum':
        return '{}';
      case 'any':
        return 'any';
      default:
        return 'any';
    }
  }

  function propDrillTextGenerator(child: ChildInt) {
    // probably don't need this
    if (child.childType === 'COMP') {
      return components
        .find((c: any) => c.id === child.childComponentId)
        .props.map((prop: PropInt) => `${prop.key}={${prop.value}}`)
        .join(' ');
    }
    if (child.childType === 'HTML') {
      const keys: string[] = Object.keys(child.HTMLInfo);
      return keys.map(key => `${key}={${htmlAttrSanitizer(child.HTMLInfo[key])}}`).join(' ');
    }
    return '';
  }

  function htmlAttrSanitizer(element: string) {
    // TODO: debug localForage unhappiness to renable image imports
    // this shouldn't be needed, but some characters make localForage unhappy
    return `'${element}'`;
    // return element
    //   .replace(/[a-z]+/gi, word => word[0].toUpperCase() + word.slice(1))
    //   .replace(/[-_\s0-9\W]+/gi, '');
  }
  function componentNameGenerator(child: ChildInt) {
    if (child.childType === 'HTML') {
      switch (child.componentName) {
        case 'Image':
          return 'img';
        case 'Form':
          return 'form';
        case 'Button':
          return 'button';
        case 'Link':
          return 'a';
        case 'List':
          return 'ul';
        case 'Paragraph':
          return 'p';
        default:
          return 'div';
      }
    } else {
      return child.componentName;
    }
  }

  const toImport = [];
  if (selectors.length) {
    toImport.push('useSelector');
  }
  if (actions.length) {
    toImport.push('useDispatch');
  }

  const importFromReactReduxText = toImport.length
    ? `import {${toImport.join(',')}} from 'react-redux'`
    : '';

  const actionsToImport = {};
  actions.forEach((action) => {
    const [reducer, actionName] = action.split('.');
    if (!actionsToImport[reducer]) {
      actionsToImport[reducer] = [actionName];
    } else {
      actionsToImport[reducer].push(actionName);
    }
  });

  const actionsText = Object.keys(actionsToImport).map(
    reducer => `import {${actionsToImport[reducer].join(',')}} from '../actions/${reducer}Actions';`,
  );

  const reservedTypeScriptTypes = [
    'string',
    'boolean',
    'number',
    'any',
    'string[]',
    'boolean[]',
    'number[]',
    'any[]',
  ];

  const listOfInterfaces = componentState.reduce((interfaces, current) => {
    if (!reservedTypeScriptTypes.includes(current.type) && !interfaces.includes(current.type)) {
      interfaces.push(current.type);
    }
    return interfaces;
  }, []);

  const state = store.getState().workspace.storeConfig.reducers;
  const useSelectorCalls = selectors.length
    ? selectors
      .map((selector) => {
        const selectorStrings = selector.split('.');
        const variableName = selectorStrings[0] + selectorStrings[1][0].toUpperCase() + selectorStrings[1].slice(1);
        const properties = selector.split('.');
        let returnType;
        if (properties.length === 2) {
          returnType = state[properties[0]].store[properties[1]].type;
          if (state[properties[0]].store[properties[1]].array) {
            returnType += '[]';
          }
        } else {
          returnType = 'any';
        }
        if (
          !reservedTypeScriptTypes.includes(returnType)
            && !listOfInterfaces.includes(returnType)
        ) {
          listOfInterfaces.push(
            returnType.indexOf('[') !== -1
              ? returnType.slice(0, returnType.length - 2)
              : returnType,
          );
        }
        return `const ${variableName} = useSelector<StoreInterface, ${returnType}>(state => state.${selector});`;
      })
      .join('\n')
    : '';

  const interfacesToImport = listOfInterfaces.length
    ? `import {${listOfInterfaces.join(', ')}} from '../Interfaces'`
    : '';

  const importsText = `${
    componentState.length ? "import React, {useState} from 'react'" : "import React from 'react'"
  };
  ${[
    ...new Set(
      childrenArray
        .filter(child => child.childType !== 'HTML')
        .map(child => `import ${child.componentName} from './${child.componentName}';`),
    ),
  ].join('\n')}
  ${importFromReactReduxText}
  ${interfacesToImport}
  ${toImport.includes('useSelector') ? "import {StoreInterface} from '../reducers/index'" : ''}
  ${actions.length ? actionsText.join('\n') : ''}
  \n\n`;

  // const propsText = `type Props = {
  //   ${props.map(prop => `${prop.key}: ${typeSwitcher(prop.type)}`).join('\n')}
  // }\n\n`;

  const childrenToRender = `<div id='${title}'>
    ${cloneDeep<any>(childrenArray)
    .sort((a: ChildInt, b: ChildInt) => a.childSort - b.childSort)
    .map(
      (child: ChildInt) => `<${componentNameGenerator(child)} ${propDrillTextGenerator(child)}/>`,
    )
    .join('\n')}`
    + `${title === 'App' ? preducksDefaultDisplay : ''}`
    + '</div>';

  const useStateCalls = componentState.length
    ? componentState
      .map((pieceOfState: ComponentStateInterface) => {
        const initialValue = pieceOfState.type === 'string'
          ? `'${pieceOfState.initialValue}'`
          : pieceOfState.initialValue;
        return `const [${
          pieceOfState.name
        }, set${pieceOfState.name[0].toUpperCase()}${pieceOfState.name.slice(1)}] = useState<${
          pieceOfState.type
        }>(${initialValue});`;
      })
      .join('\n')
    : '';

  const propDestructuringText = `const {${props.map(el => el.key).join(',\n')}} = props`;
  const functionalComponentBody = `
  const ${title}:React.FC = (props: any):JSX.Element => {
    ${useStateCalls}
    ${useSelectorCalls}
    ${actions.length ? 'const dispatch = useDispatch();' : ''}
    return (${childrenToRender});
  }
  export default ${title};`;
  return importsText + functionalComponentBody;
};

export default componentRender;
