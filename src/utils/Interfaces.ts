export interface PropInt {
  id: number;
  key: string;
  value: string;
  required: boolean;
  type: string;
}

export interface ChildInt {
  childId: number;
  childSort: number;
  childType: string;
  childComponentId: number;
  componentName: string;
  color: string | null; // maybe optional instead, look up null vs undefined
  htmlElement: string | null; // maybe should be optional instead
  HTMLInfo: { [index: string]: string }; // replace with HTMLinfo specifics
}

export interface ChildrenInt extends Array<ChildInt> {}

export interface ComponentStateInterface {
  name: string;
  type: string;
  initialValue: any;
}

export interface ComponentInt {
  id: number;
  stateful: boolean;
  componentState: ComponentStateInterface[];
  title: string;
  color: string;
  props: PropInt[];
  nextPropId: number;
  childrenArray: ChildInt[];
  nextChildId: number;
  focusChildId: number;
  selectors: string[];
  actions: string[];
}

export interface ComponentsInt extends Array<ComponentInt> {}

export interface ApplicationStateInt {
  totalComponents: number;
  nextId: number;
  successOpen: boolean;
  errorOpen: boolean;
  focusComponent: ComponentInt;
  selectableChildren: number[];
  ancestors: number[];
  initialApplicationFocusChild: ChildInt;
  focusChild: ChildInt | ChildInt[] | { [key: string]: ChildInt };
  components: ComponentsInt;
  appDir: string;
  loading: boolean;
  storeConfig: StoreConfigInterface;
}

export interface StoreInterface {
  workspace: ApplicationStateInt;
}

export interface ActionConfigInterface {
  parameter: { name: string; type: string; array: boolean };
  payload: { type: string; array: boolean };
  async: boolean;
}

export interface StateConfigInterface {
  type: string;
  array: boolean;
  initialValue: any;
}

export interface InterfacesInterface {
  [key: string]: { [key: string]: string };
}

export interface ReducersInterface {
  [key: string]: {
    store: { [key: string]: StateConfigInterface };
    actions: { [key: string]: ActionConfigInterface };
  };
}

export interface StoreConfigInterface {
  interfaces: InterfacesInterface;
  reducers: ReducersInterface;
}

export interface InputValidation {
  isValid: boolean,
  input: string,
  error?: string,
}