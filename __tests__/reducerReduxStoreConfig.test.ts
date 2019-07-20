import componentReducer from '../src/reducers/componentReducer';
import { initialAppStateMock, initialAppStateMock2 } from '../__mocks__/appStateMocks';
import * as types from '../src/actionTypes';
import { renameReducer } from '../src/utils/componentReducer.util';
import {ReducersInterface, InterfacesInterface, ComponentStateInterface} from '../src/utils/Interfaces';

// REDUX STORE CONFIG STUFF
describe('tests for redux store config', () => {
  let initialState;

  beforeEach(() => {
    initialState = JSON.parse(JSON.stringify(initialAppStateMock));
  });

  describe('Each Redux action should return a new state object instead of mutating the original state', () => {
    const testCases : [string, string | ReducersInterface | InterfacesInterface | ComponentStateInterface][] = [
      [types.ADD_SELECTOR, 'test.selector1'],
      [types.DELETE_SELECTOR, 'test.selector'],
      [types.ADD_ACTION_TO_COMPONENT, 'test.action1'],
      [types.DELETE_ACTION_FROM_COMPONENT, 'test.action'],
      [types.SET_REDUCER, { test1: { store: {}, actions: {} } }],
      [types.DELETE_REDUCER, 'test'],
      [types.SET_INTERFACE, { test1: { type1: 'string', type2: 'number' } }],
      [types.DELETE_INTERFACE, 'test'],
      [types.SET_STATE, {name: 'test1', type: 'string', initialValue: 'test'}],
      [types.DELETE_STATE, 'test']
    ] ;
    testCases.forEach(([type, payload]) => {
      const mockState = initialAppStateMock2;
      it(`${type} should return a new state object instead of the original`, () => {
        const newState = componentReducer(initialState, {
          type, 
          payload
        });
        expect(newState).not.toBe(initialState);
      });
      
      it(`${type} should not mutate the original state`, () => {
        const initialStateCopy = JSON.parse(JSON.stringify(mockState));
        componentReducer(mockState, {
          type, 
          payload
        });
        expect(mockState).toEqual(initialStateCopy);
      })
    });
  });

  describe('addSelector', () => {
    it('should add a string representing a Redux selector to a React component so Redux.useSelector() can be called', () => {
      const initialSelectors = initialState.focusComponent.selectors;
      const storeWithAddedSelector = componentReducer(initialState, {
        type: types.ADD_SELECTOR,
        payload: 'test.selector'
      });
      const nextSelectors = storeWithAddedSelector.focusComponent.selectors;
      expect(nextSelectors.length).toEqual(initialSelectors.length + 1);
      expect(nextSelectors[0]).toEqual('test.selector');
    });

    it('should not add a duplicate selector to a component', () => {
      const storeWithAddedSelector = componentReducer(initialState, {
        type: types.ADD_SELECTOR,
        payload: 'test.selector'
      });
      const storeWithAddedSelector2 = componentReducer(storeWithAddedSelector, {
        type: types.ADD_SELECTOR,
        payload: 'test.selector'
      });
      const nextSelectors = storeWithAddedSelector2.focusComponent.selectors;
      expect(nextSelectors.length).toEqual(1);
    });
  });
  
  describe('deleteSelector', () => {
    it('should remove a Redux selector from a React component', () => {
      const storeWithAddedSelector1 = componentReducer(initialState, {
        type: types.ADD_SELECTOR,
        payload: 'test.selector1'
      });
      const storeWithAddedSelector2 = componentReducer(storeWithAddedSelector1, {
        type: types.ADD_SELECTOR,
        payload: 'test.selector2'
      });
      const initialSelectors = storeWithAddedSelector2.focusComponent.selectors;
      const storeWithDeletedSelector = componentReducer(storeWithAddedSelector2, {
        type: types.DELETE_SELECTOR,
        payload: 'test.selector2'
      });
      const nextSelectors = storeWithDeletedSelector.focusComponent.selectors;
      expect(nextSelectors.length).toEqual(initialSelectors.length - 1);
      expect(nextSelectors).not.toContain('test.selector2');
      expect(nextSelectors).toContain('test.selector1');
    });
  });
  
  describe('addActionToComponent', () => {
    it('should add a Redux action to a React component so the action can be imported', () => {
      const initialActions = initialState.focusComponent.actions;
      const storeWithAddedAction = componentReducer(initialState, {
        type: types.ADD_ACTION_TO_COMPONENT,
        payload: 'test.action'
      });
      const nextActions = storeWithAddedAction.focusComponent.actions;
      expect(nextActions.length).toEqual(initialActions.length + 1);
      expect(nextActions[0]).toEqual('test.action');
    });

    it('should not add a duplicate action to a component', () => {
      const storeWithAddedAction = componentReducer(initialState, {
        type: types.ADD_SELECTOR,
        payload: 'test.selector'
      });
      const storeWithAddedAction2 = componentReducer(storeWithAddedAction, {
        type: types.ADD_SELECTOR,
        payload: 'test.selector'
      });
      const nextActions = storeWithAddedAction2.focusComponent.selectors;
      expect(nextActions.length).toEqual(1);
    });
  });
  
  describe('deleteActionFromComponent', () => {
    it('should remove a Redux action from a React component', () => {
      const storeWithAddedAction1 = componentReducer(initialState, {
        type: types.ADD_ACTION_TO_COMPONENT,
        payload: 'test.action1'
      });
      const storeWithAddedAction2 = componentReducer(storeWithAddedAction1, {
        type: types.ADD_ACTION_TO_COMPONENT,
        payload: 'test.action2'
      });
      const initialActions = storeWithAddedAction2.focusComponent.actions;
      const storeWithDeletedAction = componentReducer(storeWithAddedAction2, {
        type: types.DELETE_ACTION_FROM_COMPONENT,
        payload: 'test.action2'
      });
      const nextActions = storeWithDeletedAction.focusComponent.actions;
      expect(nextActions.length).toEqual(initialActions.length - 1);
      expect(nextActions).not.toContain('test.action2');
      expect(nextActions).toContain('test.action1');
    });
  });
  
  describe('setReducer', () => {
    it('should add a reducer to the store config', () => {
      const storeWithAddedReducer = componentReducer(initialState, {
        type: types.SET_REDUCER,
        payload: { test: { store: {}, actions: {} } },
      });
      expect(Object.keys(storeWithAddedReducer.storeConfig.reducers)[0]).toEqual('test');
    });

    it('should not add a duplicate reducer to the store config', () => {
      const storeWithAddedReducer = componentReducer(initialState, {
        type: types.SET_REDUCER,
        payload: { test: { store: {}, actions: {} } },
      });
      const storeWithAddedReducer2 = componentReducer(storeWithAddedReducer, {
        type: types.SET_REDUCER,
        payload: { test: { store: {}, actions: {} } },
      });
      expect(Object.keys(storeWithAddedReducer2.storeConfig.reducers).length).toEqual(1);
    });
  });

  describe('deleteReducer', () => {
    it('should remove a reducer from the store config', () => {
      const stateWithAddedReducer1 = componentReducer(initialState, {
        type: types.SET_REDUCER,
        payload: { test1: { store: {}, actions: {} } },
      });
      const stateWithAddedReducer2 = componentReducer(stateWithAddedReducer1, {
        type: types.SET_REDUCER,
        payload: { test2: { store: {}, actions: {} } },
      });
      const initialReducers = Object.keys(stateWithAddedReducer2.storeConfig.reducers);
      const stateWithDeletedReducer = componentReducer(stateWithAddedReducer2, {
        type: types.DELETE_REDUCER,
        payload: 'test2'
      });
      const nextReducers = stateWithDeletedReducer.storeConfig.reducers;
      expect(Object.keys(nextReducers).length).toEqual(initialReducers.length - 1);
      expect(Object.keys(nextReducers)).not.toContain('test2');
      expect(Object.keys(nextReducers)).toContain('test1');
    });
  });
  
  describe('setInterface', () => {
    it('should add an interface to the storeConfig', () => {
      const reducerOutput = componentReducer(initialState, {
        type: types.SET_INTERFACE,
        payload: { test: { type1: 'string', type2: 'number' } },
      });
      expect(Object.keys(reducerOutput.storeConfig.interfaces)[0]).toEqual('test');
    });
  });
  
  
  describe('deleteInterface', () => {
    it('should remove an interface from storeConfig', () => {
      const storeWithAddedInterface = componentReducer(initialState, {
        type: types.SET_INTERFACE,
        payload: { test: { type1: 'string', type2: 'number' } },
      });
      const storeWithDeletedInterface = componentReducer(storeWithAddedInterface, {
        type: types.DELETE_INTERFACE,
        payload: 'test'
      });
      expect(Object.keys(storeWithDeletedInterface.storeConfig.interfaces).length).toEqual(0);
    });
  });
  
  describe('setState', () => {
    it('should add a piece of local state to a React component', () => {
      const initialComponentState = initialState.focusComponent.componentState;
      const storeWithAddedState = componentReducer(initialState, {
        type: types.SET_STATE,
        payload: {
          name: 'test',
          type: 'string',
          initialValue: 'test'
        }
      });
      const nextComponentState = storeWithAddedState.focusComponent.componentState;
      expect(nextComponentState.length).toEqual(initialComponentState.length + 1);
      expect(nextComponentState.map(state => state.name)).toContain('test');
    });

    it('should not add pieces of local state with duplicate names', () => {
      const initialComponentState = initialState.focusComponent.componentState;
      const storeWithAddedState = componentReducer(initialState, {
        type: types.SET_STATE,
        payload: {
          name: 'test1',
          type: 'string',
          initialValue: 'test'
        }
      });
      const storeWithAddedState2 = componentReducer(storeWithAddedState, {
        type: types.SET_STATE,
        payload: {
          name: 'test2',
          type: 'string',
          initialValue: 'test'
        }
      });
      const storeWithAddedState3 = componentReducer(storeWithAddedState2, {
        type: types.SET_STATE,
        payload: {
          name: 'test1',
          type: 'string',
          initialValue: 'test'
        }
      });
      const nextComponentState = storeWithAddedState3.focusComponent.componentState;
      expect(nextComponentState.length).toEqual(initialComponentState.length + 2);
    });
  });
  
  describe('deleteState', () => {
    it('should remove a piece of local state from a React component', () =>{
      const storeWithAddedState = componentReducer(initialState, {
        type: types.SET_STATE,
        payload: {
          name: 'test1',
          type: 'string',
          initialValue: 'test'
        }
      });
      const storeWithAddedState2 = componentReducer(storeWithAddedState, {
        type: types.SET_STATE,
        payload: {
          name: 'test2',
          type: 'string',
          initialValue: 'test'
        }
      });
      const initialComponentState = storeWithAddedState2.focusComponent.componentState;
      const storeWithDeletedState = componentReducer(storeWithAddedState2, {
        type: types.DELETE_STATE,
        payload: 'test2'
      });
      const nextComponentState = storeWithDeletedState.focusComponent.componentState;
      expect(nextComponentState.length).toEqual(initialComponentState.length - 1);
      expect(nextComponentState.map(state => state.name)).not.toContain('test2');
    });
  });
});
