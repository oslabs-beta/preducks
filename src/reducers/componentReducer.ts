import { ComponentInt, ChildInt, ApplicationStateInt } from '../utils/InterfaceDefinitions';

import * as types from '../actionTypes';

import {
  addComponent,
  addChild,
  deleteChild,
  deleteComponent,
  changeFocusComponent,
  changeComponentFocusChild,
  changeFocusChild,
  exportFilesSuccess,
  exportFilesError,
  handleClose,
  handleTransform,
  openExpansionPanel,
  addProp,
  deleteProp,
  updateHtmlAttr,
  updateChildrenSort,
  addSelector,
  deleteSelector,
  addActionToComponent,
  deleteActionFromComponent,
  setReducer,
  deleteReducer,
  // renameReducer,
  setInterface,
  deleteInterface,
  // renameInterface,
  setState,
  deleteState,
  // renameState,
} from '../utils/componentReducer.util';
import cloneDeep from '../utils/cloneDeep';

const appComponent: ComponentInt = {
  id: 1,
  stateful: false,
  componentState: [],
  title: 'App',
  color: '#FF6D00',
  props: [],
  nextPropId: 1,
  childrenArray: [],
  nextChildId: 1,
  focusChildId: 0,
  selectors: [],
  actions: [],
};

const initialApplicationFocusChild: ChildInt = {
  childId: 0,
  componentName: null,
  childType: null,
  childSort: 0,
  childComponentId: 0,
  color: null,
  htmlElement: null,
  HTMLInfo: null,
};

const initialApplicationState: ApplicationStateInt = {
  totalComponents: 1,
  nextId: 2,
  successOpen: false,
  errorOpen: false,
  focusComponent: appComponent,
  selectableChildren: [],
  ancestors: [],
  initialApplicationFocusChild,
  focusChild: cloneDeep<ChildInt>(initialApplicationFocusChild),
  components: [appComponent],
  appDir: '',
  loading: false,
  storeConfig: { interfaces: {}, reducers: {} },
};

const componentReducer = (state = initialApplicationState, action: any) => {
  // console.log(action.type);
  switch (action.type) {
    case types.LOAD_INIT_DATA:
      // return { ...state };
      return {
        ...state,
        ...action.payload.data,
        loading: false,
        appDir: '',
        successOpen: false,
        errorOpen: false,
      };
    case types.ADD_COMPONENT:
      return addComponent(state, action.payload);
    case types.ADD_CHILD:
      return addChild(state, action.payload);
    case types.DELETE_CHILD:
      return deleteChild(state, action.payload);
    case types.DELETE_COMPONENT:
      return deleteComponent(state, action.payload);
    case types.CHANGE_FOCUS_COMPONENT:
      return changeFocusComponent(state, action.payload);
    case types.CHANGE_FOCUS_CHILD:
      return changeFocusChild(state, action.payload);
    case types.CHANGE_COMPONENT_FOCUS_CHILD:
      return changeComponentFocusChild(state, action.payload);
    case types.CREATE_APPLICATION:
    case types.EXPORT_FILES:
      return { ...state, loading: true };
    case types.EXPORT_FILES_SUCCESS:
      return exportFilesSuccess(state, action.payload);
    case types.CREATE_APPLICATION_ERROR:
    case types.EXPORT_FILES_ERROR:
      return exportFilesError(state, action.payload);
    case types.HANDLE_CLOSE:
      return handleClose(state, action.payload);
    case types.HANDLE_TRANSFORM:
      return handleTransform(state, action.payload);
    case types.OPEN_EXPANSION_PANEL:
      return openExpansionPanel(state, action.payload);
    case types.DELETE_ALL_DATA:
      return initialApplicationState;
    case types.ADD_PROP:
      return addProp(state, action.payload);
    case types.DELETE_PROP:
      return deleteProp(state, action.payload);
    case types.UPDATE_HTML_ATTR:
      return updateHtmlAttr(state, action.payload);
    case types.UPDATE_CHILDREN_SORT:
      return updateChildrenSort(state, action.payload);
    case types.ADD_SELECTOR:
      return addSelector(state, action.payload);
    case types.DELETE_SELECTOR:
      return deleteSelector(state, action.payload);
    case types.ADD_ACTION_TO_COMPONENT:
      return addActionToComponent(state, action.payload);
    case types.DELETE_ACTION_FROM_COMPONENT:
      return deleteActionFromComponent(state, action.payload);
    case types.SET_REDUCER:
      return setReducer(state, action.payload);
    case types.DELETE_REDUCER:
      return deleteReducer(state, action.payload);
    case types.SET_INTERFACE:
      return setInterface(state, action.payload);
    case types.DELETE_INTERFACE:
      return deleteInterface(state, action.payload);
    // case RENAME_INTERFACE:
    //   return renameInterface(state, action.payload);
    case types.SET_STATE:
      return setState(state, action.payload);
    case types.DELETE_STATE:
      return deleteState(state, action.payload);
    // case RENAME_STATE:
    //   return renameState(state, action.payload);
    default:
      return state;
  }
};

export default componentReducer;
