import getSelectable from './getSelectable.util';
import getColor from './colors.util';
import cloneDeep from './cloneDeep';
import {
  ComponentInt,
  ApplicationStateInt,
  ChildrenInt,
  ChildInt,
  ComponentsInt,
  PropInt,
  ReducersInterface,
  InterfacesInterface,
  ComponentStateInterface,
} from './InterfaceDefinitions';

const initialComponentState: ComponentInt = {
  id: 0,
  stateful: false,
  componentState: [],
  title: '',
  color: getColor(1),
  props: [],
  nextPropId: 1,
  childrenArray: [],
  nextChildId: 1,
  focusChildId: 0,
  selectors: [],
  actions: [],
};

export const addComponent = (state: ApplicationStateInt, { title }: { title: string }) => {
  // remove whitespace and digits, capitalize first char
  const strippedTitle = title
    .replace(/[a-z]+/gi, word => word[0].toUpperCase() + word.slice(1))
    .replace(/[^a-zA-Z]+/gi, '');
  // duplicate component names not allowed
  if (state.components.find((comp: ComponentInt) => comp.title === strippedTitle)) {
    window.alert(
      `A component with the name: "${strippedTitle}" already exists.\n Please think of another name.`,
    );
    return {
      ...state,
    };
  }

  // empty component name not allowed
  if (strippedTitle === '') {
    return {
      ...state,
    };
  }

  const componentColor = getColor(1);
  const componentId = state.nextId;

  const newComponent: ComponentInt = {
    ...initialComponentState,
    title: strippedTitle,
    id: componentId,
    color: componentColor,
    childrenArray: [],
  };

  const components = [...state.components, newComponent];

  const totalComponents = state.totalComponents + 1;
  const nextId = state.nextId + 1;

  const selectableChildren = state.components
    .map(comp => comp.id)
    .filter(id => id !== newComponent.id);

  const ancestors: Array<number> = [];

  // reset focused child
  const newFocusChild = cloneDeep(state.initialApplicationFocusChild);
  return {
    ...state,
    totalComponents,
    nextId,
    components,
    focusComponent: newComponent,
    focusChild: newFocusChild,
    ancestors,
    selectableChildren, // new component so everyone except yourself is available
  };
};

export const addChild = (
  state: ApplicationStateInt,
  { title, childType = '', HTMLInfo = {} }: { title: string; childType: string; HTMLInfo: object },
) => {
  const strippedTitle = title;

  if (!childType) {
    window.alert('addChild Error! no type specified');
  }

  const htmlElement = childType !== 'COMP' ? childType : null;
  if (childType !== 'COMP') {
    childType = 'HTML';
  }

  // view represents the curretn FOCUSED COMPONENT - this is the component where the child is being added to
  // we only add childrent (or do any action) to the focused omconent
  const view: ComponentInt = state.components.find(
    comp => comp.title === state.focusComponent.title,
  );

  // parentComponent is the component this child is generated from (ex. instance of Box has comp of Box)
  let parentComponent;

  // conditional if adding an HTML component
  if (childType === 'COMP') {
    parentComponent = state.components.find(comp => comp.title === title);
  }

  const newChild: any = {
    childId: view.nextChildId,
    childSort: view.nextChildId,
    childType,
    childComponentId: childType === 'COMP' ? parentComponent.id : null, // only relevant fot children of type COMPONENT
    componentName: strippedTitle,
    color: null, // parentComponent.color, // only relevant fot children of type COMPONENT
    htmlElement, // only relevant fot children of type HTML
    HTMLInfo,
  };

  const compsChildrenArr = [...view.childrenArray, newChild];

  const component = {
    ...view,
    childrenArray: compsChildrenArr,
    focusChildId: newChild.childId,
    nextChildId: view.nextChildId + 1,
  };

  const components = [
    ...state.components.filter((comp) => {
      if (comp.title !== view.title) return comp;
    }),
    component,
  ];

  return {
    ...state,
    components,
    focusChild: newChild,
    focusComponent: component, // refresh the focus component so we have the new child
  };
};

export const deleteChild = (
  state: ApplicationStateInt,
  opts: number | { parentId: number; childId: number; calledFromDeleteComponent: boolean },
) => {
  let childId;
  let parentId;
  let calledFromDeleteComponent;
  if (typeof opts === 'number') {
    childId = opts;
    parentId = state.focusComponent.id;
    calledFromDeleteComponent = false;
  } else {
    parentId = opts.parentId;
    childId = opts.childId;
    calledFromDeleteComponent = opts.calledFromDeleteComponent;
  }
  // console.log('parent id, state focusChild', parentId, state.focusChild );
  /** ************************************************
  if no parameters are provided we default to delete the FOCUSED CHILD of the FOCUSED COMPONENTS
  however when deleting  component we wnt to delete ALL the places where it's used, so we call this function
  Also when calling from DELETE components , we do not touch focusComponent.
 ************************************************************************************ */
  if (!parentId) {
    window.alert('Cannot delete root child of a component');
    return state;
  }
  if (!childId) {
    window.alert('No child selected');
    return state;
  }
  if (!calledFromDeleteComponent && childId === -1) {
    window.alert('Cannot delete root child of a component');
    return state;
  }
  // make a DEEP copy of the parent component (the one thats about to loose a child)
  const parentComponentCopy: any = cloneDeep(state.components.find(c => c.id === parentId));

  // delete the  CHILD from the copied array
  const indexToDelete = parentComponentCopy.childrenArray.findIndex(
    (elem: ChildInt) => elem.childId === childId || elem.childComponentId === childId,
  );
  // first condition is for HTML children
  // second condition is to find any child with component id equal to what was sent in.
  // this is because we have no way to access the child id of a
  // react component when we click on the button (the button is attached to the info of just
  // the component)
  if (indexToDelete < 0) {
    window.alert('No such child component found');
    return state;
  }
  parentComponentCopy.childrenArray.splice(indexToDelete, 1);

  // if deleted child is selected, reset it
  if (parentComponentCopy.focusChildId === childId) {
    parentComponentCopy.focusChildId = 0;
  }

  const modifiedComponentArray = [
    ...state.components.filter(c => c.id !== parentId), // all elements besides the one just changed
    parentComponentCopy,
  ];

  return {
    ...state,
    components: modifiedComponentArray,
    focusComponent: parentComponentCopy, // when called from delete component we dont need want to touch the focus
    focusChild: calledFromDeleteComponent
      ? cloneDeep(state.initialApplicationFocusChild)
      : parentComponentCopy.childrenArray[parentComponentCopy.childrenArray.length - 1]
        || cloneDeep(state.initialApplicationFocusChild), // guard in case final child is deleted
  };
};

export const handleTransform = (
  state: ApplicationStateInt,
  {
    componentId,
    childId,
  }: {
  componentId: number;
  childId: number;
  },
) => {
  if (childId === -1) {
    // the pseudochild has been transformed, its position is stored in the component
    const component = state.components.find(comp => comp.id === componentId);
    const transformedComponent = {
      ...component,
    };

    const components = [
      ...state.components.filter((comp) => {
        if (comp.id !== componentId) return comp;
      }),
      transformedComponent,
    ];
    return { ...state, components };
  }

  // else, a normal child has been transformed, its position lives in the children array
  const child = state.components
    .find(comp => comp.id === componentId)
    .childrenArray.find(child => child.childId === childId);

  const transformedChild = {
    ...child,
  };

  const children = [
    ...state.components
      .find(comp => comp.id === componentId)
      .childrenArray.filter((child) => {
        if (child.childId !== childId) return child;
      }),
    transformedChild,
  ];

  let newFocusChild = state.focusChild;
  if (state.focusChild.childId == childId) {
    newFocusChild = transformedChild;
  }

  const component = {
    ...state.components.find(comp => comp.id === componentId),
    childrenArray: children,
    focusChild: newFocusChild,
  };

  const components: ComponentsInt = [
    ...state.components.filter((comp) => {
      if (comp.id !== componentId) return comp;
    }),
    component,
  ];

  return {
    ...state,
    components,
    focusChild: newFocusChild,
  };
};

export const deleteComponent = (
  state: ApplicationStateInt,
  { componentId }: { componentId: number },
) => {
  if (componentId === 1) {
    return {
      ...state,
    };
  }
  const indexToDelete = state.components.findIndex(comp => comp.id == componentId);

  const componentsCopy = cloneDeep(state.components);
  componentsCopy.splice(indexToDelete, 1);
  const totalComponents = state.totalComponents - 1;

  return {
    ...state,
    totalComponents,
    components: componentsCopy,
  };
};

export const changeFocusComponent = (
  state: ApplicationStateInt,
  { title = state.focusComponent.title }: { title: string },
) => {
  /** ****************
   * if the prm TITLE is a blank Object it means REFRESH focusd Components.
   * sometimes we update state  like adding Children/Props etc and we want those changes to be reflected in focus component
   ************************************************* */
  const newFocusComp: ComponentInt = state.components.find(comp => comp.title === title);
  // set the "focus child" to the focus child of this particular component .

  let newFocusChild: ChildInt | any; // check if the components has a child saved as a Focus child
  if (newFocusComp.focusChildId > 0) {
    newFocusChild = newFocusComp.childrenArray.find(
      child => child.childId === newFocusComp.focusChildId,
    );
  }

  if (!newFocusChild) {
    newFocusChild = cloneDeep(state.initialApplicationFocusChild);
  }

  const result = getSelectable(newFocusComp, state.components);

  return {
    ...state,
    focusComponent: newFocusComp,
    selectableChildren: result.selectableChildren,
    ancestors: result.ancestors,
    focusChild: newFocusChild,
  };
};

export const changeFocusChild = (state: ApplicationStateInt, { childId }: { childId: number }) => {
  const focComp = state.components.find(comp => comp.title === state.focusComponent.title);
  let newFocusChild: ChildInt = focComp.childrenArray.find(child => child.childId === childId);

  if (!newFocusChild) {
    newFocusChild = {
      childId: -1,
      childComponentId: focComp.id,
      componentName: focComp.title,
      childSort: 0,
      color: focComp.color,
      childType: '',
      htmlElement: '',
      HTMLInfo: {},
    };
  }

  return {
    ...state,
    focusChild: newFocusChild,
  };
};

export const changeComponentFocusChild = (
  state: ApplicationStateInt,
  { componentId, childId }: { componentId: number; childId: number },
) => {
  const component: ComponentInt = state.components.find(comp => comp.id === componentId);
  const modifiedComponent: any = cloneDeep(component);
  modifiedComponent.focusChildId = childId;
  const components: ComponentsInt = state.components.filter(comp => comp.id !== componentId);
  return {
    ...state,
    components: [modifiedComponent, ...components],
  };
};

export const exportFilesSuccess = (
  state: ApplicationStateInt,
  { status, dir }: { status: boolean; dir: string },
) => ({
  ...state,
  successOpen: status,
  appDir: dir,
  loading: false,
});

export const exportFilesError = (
  state: ApplicationStateInt,
  { status, err }: { status: boolean; err: string },
) => ({
  ...state,
  errorOpen: status,
  appDir: err,
  loading: false,
});

export const handleClose = (state: ApplicationStateInt, status: string) => ({
  ...state,
  errorOpen: status,
  successOpen: status,
});

export const openExpansionPanel = (
  state: ApplicationStateInt,
  { component }: { component: ComponentInt },
) => ({
  ...state,
});

export const addProp = (
  state: ApplicationStateInt,
  {
    key,
    value = null,
    required,
    type,
  }: { key: string; value: string; required: boolean; type: string },
) => {
  if (!state.focusComponent.id) {
    console.log('Add prop error. no focused component ');
    return state;
  }

  const selectedComponent = state.components.find(comp => comp.id === state.focusComponent.id);

  const newProp: PropInt = {
    id: selectedComponent.nextPropId,
    key,
    value: value || key,
    required,
    type,
  };
  const newProps = [...selectedComponent.props, newProp];

  const modifiedComponent: ComponentInt = {
    ...selectedComponent,
    props: newProps,
    nextPropId: selectedComponent.nextPropId + 1,
  };

  const newComponents: ComponentsInt = state.components.filter(
    comp => comp.id !== selectedComponent.id,
  );
  newComponents.push(modifiedComponent);
  return {
    ...state,
    components: newComponents,
    focusComponent: modifiedComponent,
  };
};

export const deleteProp = (state: ApplicationStateInt, propId: number) => {
  if (!state.focusComponent.id) {
    console.log('Delete prop error. no focused component ');
    return state;
  }

  const modifiedComponent: any = cloneDeep(
    state.components.find(comp => comp.id === state.focusComponent.id),
  );

  const indexToDelete = modifiedComponent.props.findIndex((prop: PropInt) => prop.id === propId);
  if (indexToDelete === -1) {
    console.log(`Delete prop Error. Prop id:${propId} not found in ${modifiedComponent.title}`);
    return state;
  }

  modifiedComponent.props.splice(indexToDelete, 1);

  const newComponentsArray = state.components.filter(comp => comp.id !== modifiedComponent.id);
  newComponentsArray.push(modifiedComponent);

  return {
    ...state,
    components: newComponentsArray,
    focusComponent: modifiedComponent,
  };
};

export const updateHtmlAttr = (
  state: ApplicationStateInt,
  { attr, value }: { attr: string; value: string },
) => {
  if (!state.focusChild.childId) {
    console.log('Update HTML error. no focused child ');
    return state;
  }

  const modifiedChild: any = cloneDeep(state.focusChild);
  modifiedChild.HTMLInfo[attr] = value;

  const modifiedComponent: ComponentInt = JSON.parse(
    JSON.stringify(state.components.find(comp => comp.id === state.focusComponent.id)),
  );

  modifiedComponent.childrenArray = modifiedComponent.childrenArray.filter(
    child => child.childId !== modifiedChild.childId,
  );
  modifiedComponent.childrenArray.push(modifiedChild);

  const newComponentsArray = state.components.filter(comp => comp.id !== modifiedComponent.id);
  newComponentsArray.push(modifiedComponent);

  return {
    ...state,
    components: newComponentsArray,
    focusComponent: modifiedComponent,
    focusChild: modifiedChild,
  };
};

export const updateChildrenSort = (
  state: ApplicationStateInt,
  { newSortValues }: { newSortValues: any },
) => {
  const modifiedChildrenArray: any = cloneDeep(state.focusComponent.childrenArray);

  for (let i = 0; i < modifiedChildrenArray.length; i += 1) {
    const currChild = modifiedChildrenArray[i];
    const currChildId = currChild.childId;
    const newValueObj = newSortValues.find((n: any) => n.childId === currChildId);
    const newSortValue = newValueObj.childSort;
    currChild.childSort = newSortValue;
  }

  const modifiedComponent = state.components.find(comp => comp.id === state.focusComponent.id);
  modifiedComponent.childrenArray = modifiedChildrenArray;

  const modifiedComponentsArray = state.components.filter(
    comp => comp.id !== state.focusComponent.id,
  );
  modifiedComponentsArray.push(modifiedComponent);

  return {
    ...state,
    components: modifiedComponentsArray,
    focusComponent: modifiedComponent,
  };
};

export const addSelector = (state: ApplicationStateInt, payload: string) => {
  const components = [...state.components];
  const index = components.findIndex(comp => comp.title === state.focusComponent.title);
  const view = { ...components[index] };
  view.selectors = view.selectors.includes(payload)
    ? [...view.selectors]
    : [...view.selectors, payload];
  components.splice(index, 1, view);
  const focusComponent = { ...state.focusComponent };
  focusComponent.selectors = focusComponent.selectors.includes(payload)
    ? [...focusComponent.selectors]
    : [...focusComponent.selectors, payload];
  return {
    ...state,
    components,
    focusComponent,
  };
};

export const deleteSelector = (state: ApplicationStateInt, payload: string) => {
  const components = [...state.components];
  const index = components.findIndex(comp => comp.title === state.focusComponent.title);
  const view = { ...components[index] };
  view.selectors = view.selectors.filter(selector => selector !== payload);
  components.splice(index, 1, view);
  const focusComponent = { ...state.focusComponent };
  focusComponent.selectors = view.selectors.filter(selector => selector !== payload);
  return {
    ...state,
    components,
    focusComponent,
  };
};

export const addActionToComponent = (state: ApplicationStateInt, payload: string) => {
  const components = [...state.components];
  const index = components.findIndex(comp => comp.title === state.focusComponent.title);
  const view = { ...components[index] };
  view.actions = view.actions.includes(payload) ? [...view.actions] : [...view.actions, payload];
  components.splice(index, 1, view);
  const focusComponent = { ...state.focusComponent };
  focusComponent.actions = focusComponent.actions.includes(payload)
    ? [...focusComponent.actions]
    : [...focusComponent.actions, payload];
  return {
    ...state,
    components,
    focusComponent,
  };
};

export const deleteActionFromComponent = (state: ApplicationStateInt, payload: string) => {
  const components = [...state.components];
  const index = components.findIndex(comp => comp.title === state.focusComponent.title);
  const view = { ...components[index] };
  view.actions = view.actions.filter(action => action !== payload);
  components.splice(index, 1, view);
  const focusComponent = { ...state.focusComponent };
  focusComponent.actions = view.actions.filter(action => action !== payload);
  return {
    ...state,
    components,
    focusComponent,
  };
};

export const setReducer = (state: ApplicationStateInt, payload: ReducersInterface) => {
  const storeConfig = {
    interfaces: {
      ...state.storeConfig.interfaces,
    },
    reducers: {
      ...state.storeConfig.reducers,
      ...payload,
    },
  };
  return {
    ...state,
    storeConfig,
  };
};

export const deleteReducer = (state: ApplicationStateInt, payload: string) => {
  const storeConfig = {
    interfaces: {
      ...state.storeConfig.interfaces,
    },
    reducers: {
      ...state.storeConfig.reducers,
    },
  };
  delete storeConfig.reducers[payload];
  return {
    ...state,
    storeConfig,
  };
};

// export const renameReducer = (
//   state: ApplicationStateInt,
//   payload: { oldName: string; newName: string },
// ) => {
//   const storeConfig = {
//     interfaces: {
//       ...state.storeConfig.interfaces,
//     },
//     reducers: {
//       ...state.storeConfig.reducers,
//       [payload.newName]: state.storeConfig.reducers[payload.oldName],
//     },
//   };
//   delete storeConfig.reducers[payload.oldName];
//   return {
//     ...state,
//     storeConfig,
//   };
// };

export const setInterface = (state: ApplicationStateInt, payload: InterfacesInterface) => {
  const storeConfig = {
    interfaces: {
      ...state.storeConfig.interfaces,
      ...payload,
    },
    reducers: {
      ...state.storeConfig.reducers,
    },
  };
  return {
    ...state,
    storeConfig,
  };
};

export const deleteInterface = (state: ApplicationStateInt, payload: string) => {
  const storeConfig = {
    interfaces: {
      ...state.storeConfig.interfaces,
    },
    reducers: {
      ...state.storeConfig.reducers,
    },
  };
  delete storeConfig.interfaces[payload];
  return {
    ...state,
    storeConfig,
  };
};

// export const renameInterface = (
//   state: ApplicationStateInt,
//   payload: { oldName: string; newName: string },
// ) => {
//   const storeConfig = {
//     interfaces: {
//       ...state.storeConfig.interfaces,
//       [payload.newName]: state.storeConfig.interfaces[payload.oldName],
//     },
//     reducers: {
//       ...state.storeConfig.reducers,
//     },
//   };
//   delete storeConfig.interfaces[payload.oldName];
//   return {
//     ...state,
//     storeConfig,
//   };
// };

export const setState = (state: ApplicationStateInt, payload: ComponentStateInterface) => {
  const components = [...state.components];
  const index = components.findIndex(comp => comp.title === state.focusComponent.title);
  const view = { ...components[index] };
  const stateIndex = view.componentState.findIndex(state => state.name === payload.name);
  if (stateIndex !== -1) {
    view.componentState.splice(stateIndex, 1, payload);
  } else {
    view.componentState = [...view.componentState, payload];
  }
  components.splice(index, 1, view);
  const focusComponent = { ...state.focusComponent };
  const stateIndexFocus = focusComponent.componentState.findIndex(
    state => state.name === payload.name,
  );
  if (stateIndexFocus !== -1) {
    focusComponent.componentState.splice(stateIndexFocus, 1, payload);
  } else {
    focusComponent.componentState = [...focusComponent.componentState, payload];
  }
  return {
    ...state,
    components,
    focusComponent,
  };
};

export const deleteState = (state: ApplicationStateInt, payload: string) => {
  const components = [...state.components];
  const index = components.findIndex(comp => comp.title === state.focusComponent.title);
  const view = { ...components[index] };
  view.componentState = view.componentState.filter(pieceOfState => pieceOfState.name !== payload);
  components.splice(index, 1, view);
  const focusComponent = { ...state.focusComponent };
  focusComponent.componentState = focusComponent.componentState.filter(
    pieceOfState => pieceOfState.name !== payload,
  );
  return {
    ...state,
    components,
    focusComponent,
  };
};

// export const renameState = (
//   state: ApplicationStateInt,
//   payload: { oldName: string; newName: string },
// ) => {
//   const components = [...state.components];
//   const index = components.findIndex(comp => comp.title === state.focusComponent.title);
//   const view = { ...components[index] };
//   const piecesOfState = {
//     ...view.componentState,
//     [payload.newName]: view.componentState[payload.oldName],
//   };
//   delete piecesOfState[payload.oldName];
//   view.componentState = piecesOfState;
//   components.splice(index, 1, view);
//   const focusComponent = { ...state.focusComponent };
//   const pieceOfState = {
//     ...focusComponent.componentState,
//     [payload.newName]: focusComponent.componentState[payload.oldName],
//   };
//   delete pieceOfState[payload.oldName];
//   focusComponent.componentState = pieceOfState;
//   return {
//     ...state,
//     components,
//     focusComponent,
//   };
// };
