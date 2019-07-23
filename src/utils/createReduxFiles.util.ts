import { formatter } from './formatter.util';
import { StoreConfigInterface } from './InterfaceDefinitions';

const createSharedInterfaces = (
  path: string,
  appName: string,
  storeConfig: StoreConfigInterface,
  zip: any,
): any => {
  const filePath: string = 'src/Interfaces.ts';
  const interfaceObj = storeConfig.interfaces;
  const interfaceObjKeys = Object.keys(interfaceObj);
  if (interfaceObjKeys.length === 0) return;
  let data = '';
  interfaceObjKeys.forEach((interfaceName) => {
    let curInterface = `export interface ${interfaceName} {\n`;
    Object.keys(interfaceObj[interfaceName]).forEach((property) => {
      const curType = interfaceObj[interfaceName][property];
      curInterface += `${property}: ${curType};\n`;
    });
    curInterface += '}\n\n';
    data += curInterface;
  });

  zip.file(filePath, formatter(data));
};

function createActionFiles(path, appName, storeConfig, reducerName, zip) {
  // CREATE ACTION TYPES STUFF //////////////
  const reducerObj = storeConfig.reducers[reducerName];
  const actionTypesFile: string = `src/actions/${reducerName}ActionTypes.ts`;
  const actions = Object.keys(reducerObj.actions); // action names in a list

  let actionInterfacesText = '';
  let actionCreatorsText = '';
  const actionInterfaceNames = [];
  if (actions.length === 0) return;
  actions.forEach((actionName, i) => {
    // loop through all actions and generate all text in actionTypes
    // and actions that depends on it.
    const curActionObj = reducerObj.actions[actionName];
    const actionInterfaceName = `${actionName}ActionInterface`;
    actionInterfaceNames.push(actionInterfaceName);

    // add an action interface
    const bracketsIfPayloadIsAnArray = curActionObj.payload.array ? '[]' : '';
    const payloadType = curActionObj.payload.type;
    const curActionInterface = `export interface ${actionInterfaceName}{\n
      type: ${reducerName}ActionTypes.${actionName};
      payload?: ${payloadType}${bracketsIfPayloadIsAnArray};
    }\n\n`;
    actionInterfacesText += curActionInterface;

    // add boilerplate for this action creator function
    let curActionCreatorText;
    const bracketsIfParamIsAnArray = curActionObj.parameter.array ? '[]' : '';
    const paramWithColonIfParamExists = curActionObj.parameter.name
      ? `${curActionObj.parameter.name} : `
      : '';
    if (curActionObj.async) {
      curActionCreatorText = `export const ${actionName} = (${paramWithColonIfParamExists}${curActionObj.parameter.type}${bracketsIfParamIsAnArray}) => {
        return async (dispatch: Dispatch) => {
          // your code here ! add your own payload to the dispatched action.
          dispatch<${actionInterfaceName}>({
            type: ${reducerName}ActionTypes.${actionName}
          });
        };
      };`;
    } else {
      curActionCreatorText = `export const ${actionName} =
      (${paramWithColonIfParamExists}${curActionObj.parameter.type}${bracketsIfParamIsAnArray}) :
      ${actionInterfaceName} => {
          // your code here ! add your own payload to the dispatched action.
          return {
            type: ${reducerName}ActionTypes.${actionName}
          };
      };`;
    }

    actionCreatorsText += curActionCreatorText;
  });

  // import all shared interfaces
  const interfaceNameArray = Object.keys(storeConfig.interfaces);
  const interfacesImportText = interfaceNameArray.length
    ? `import {${interfaceNameArray.toString()}} from '../Interfaces';\n\n`
    : '';
  // exoirt an enum with all actions
  const actionTypesEnumText = `export enum ${reducerName}ActionTypes{${actions.toString()}};\n\n`;
  const typeGuardText = `export type ${reducerName}ActionInterfaceUnion = ${actionInterfaceNames.join(
    '|',
  )};\n\n`;

  const firstFormat = formatter(interfacesImportText + actionInterfacesText);

  const secondFormat = formatter(typeGuardText);

  zip.file(actionTypesFile, firstFormat + actionTypesEnumText + secondFormat);

  //   // ///// ACTIONS STUFF /////////////////////////////

  const actionsFile: string = `src/actions/${reducerName}Actions.ts`;
  // import dispatch, import the action types enum, and import ALL action interfaces
  const actionsImportText = `import {Dispatch} from 'redux';
  import {${reducerName}ActionTypes, ${actionInterfaceNames.join(',')}} 
  from './${reducerName}ActionTypes'\n`;
  zip.file(actionsFile, formatter(actionsImportText + interfacesImportText + actionCreatorsText));
}

function createReducerFiles(path, appName, storeConfig, reducerName, zip) {
  const reducerFile: string = `src/reducers/${reducerName}Reducer.ts`;
  const currentReducerStoreSlice = storeConfig.reducers[reducerName].store;
  const currentReducerStoreSliceKeys = Object.keys(currentReducerStoreSlice);
  const numberOfActions = Object.keys(storeConfig.reducers[reducerName].actions).length;
  let importText = numberOfActions
    ? `import {${reducerName}ActionInterfaceUnion, ${reducerName}ActionTypes} from '../actions/${reducerName}ActionTypes'\n`
    : '';
  const interfaceNameArray = Object.keys(storeConfig.interfaces);
  importText += interfaceNameArray.length
    ? `import {${interfaceNameArray.toString()}} from '../Interfaces';\n\n`
    : '';

  let storeSliceInterfaceText = `export interface ${reducerName}StoreSliceInterface {`;
  const initialState = {};
  currentReducerStoreSliceKeys.forEach((storeSlicePropertyName) => {
    // build out interfaces for this reducer's store slices first!
    const storeSlicePropObj = currentReducerStoreSlice[storeSlicePropertyName];
    const bracketsIfPropIsAnArray = storeSlicePropObj.array ? '[]' : '';
    storeSliceInterfaceText += `${storeSlicePropertyName}: ${storeSlicePropObj.type}${bracketsIfPropIsAnArray};\n`;
    try {
      const replacedStr = storeSlicePropObj.initialValue
        .replace(/(\w+) ?(:)/g, (wholeMatch, groupOne, groupTwo) => `"${groupOne}"${groupTwo}`)
        .replace(/'/g, '"');
      initialState[storeSlicePropertyName] = JSON.parse(replacedStr);
    } catch (e) {
      initialState[storeSlicePropertyName] = storeSlicePropObj.initialValue;
    }
  });
  storeSliceInterfaceText += '};\n\n';
  const initialStateText = `const initialState: ${reducerName}StoreSliceInterface = ${JSON.stringify(
    initialState,
  )}\n\n`;

  let reducerText = `export const ${reducerName}Reducer =
  (state: ${reducerName}StoreSliceInterface = initialState, action: ${
  numberOfActions ? `${reducerName}ActionInterfaceUnion` : 'any'
}) => {
    switch(action.type){\n`;

  Object.keys(storeConfig.reducers[reducerName].actions).forEach((actionTypeName) => {
    reducerText += `case ${reducerName}ActionTypes.${actionTypeName}:
    // your logic here!
    return state;\n`;
  });
  reducerText += `default:
      return state;
    }
  };`;

  zip.file(
    reducerFile,
    formatter(importText + storeSliceInterfaceText + initialStateText + reducerText),
  );
}

const createActionsAndStoresForEachReducer = (
  // creates an Interfaces.tsx that all other redux files will import from.
  path: string,
  appName: string,
  storeConfig: StoreConfigInterface,
  zip,
): void => {
  const rootReducerFile: string = 'src/reducers/index.ts';
  let rootReducerImportsText = "import {combineReducers} from 'redux';\n";
  let storeInterfaceText = 'export interface StoreInterface {\n';
  let combineReducersText = 'export const reducers = combineReducers<StoreInterface>({\n';

  const reducerNamesArray = Object.keys(storeConfig.reducers);
  if (reducerNamesArray.length === 0) return;
  reducerNamesArray.forEach((reducerName) => {
    rootReducerImportsText += `import {${reducerName}Reducer, ${reducerName}StoreSliceInterface } from './${reducerName}Reducer';\n`;
    storeInterfaceText += `${reducerName}: ${reducerName}StoreSliceInterface;\n`;
    combineReducersText += `${reducerName}: ${reducerName}Reducer,\n`;

    createActionFiles(path, appName, storeConfig, reducerName, zip);
    createReducerFiles(path, appName, storeConfig, reducerName, zip);
  });
  rootReducerImportsText += '\n';
  storeInterfaceText += '}\n\n';
  combineReducersText += '});\n';

  zip.file(
    rootReducerFile,
    formatter(rootReducerImportsText + storeInterfaceText + combineReducersText),
  );
};

export const createReduxFiles = async (
  // CALL THIS FUNCTION FROM OUTSIDE AND IT WILL DO THE WHOLE REDUX SETUP.
  // creates an Interfaces.tsx that all other redux files will import from.
  path: string,
  appName: string,
  storeConfig: StoreConfigInterface,
  zip: any,
): Promise<string> => {
  createSharedInterfaces(path, appName, storeConfig, zip);
  createActionsAndStoresForEachReducer(path, appName, storeConfig, zip);
  return null;
};
