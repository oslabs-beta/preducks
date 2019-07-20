// import configureMockStore from 'redux-mock-store';
import componentReducer from '../src/reducers/componentReducer';
import {
  initialAppStateMock,
  aboutToAddChildMock,
  aboutToDeleteComponentMock,
} from '../__mocks__/appStateMocks';
import * as types from '../src/actionTypes';

describe('initialization stuff', () => {
  it('should return the initial state if no recognized action argument is given', () => {
    expect(componentReducer(undefined, {})).toEqual(initialAppStateMock);
  });
});

describe('addComponent', () => {
  it('should handle addComponent with submitted title Test', () => {
    const addComponentResult = componentReducer(initialAppStateMock, {
      type: types.ADD_COMPONENT,
      payload: { title: 'Test' },
    });
    expect(addComponentResult.nextId).toEqual(3);
    expect(addComponentResult.focusComponent.id).toEqual(2);
    expect(addComponentResult.focusComponent.title).toEqual('Test');
    expect(addComponentResult.components[1].id).toEqual(2);
    expect(addComponentResult.components[1].title).toEqual('Test');
    expect(addComponentResult.totalComponents).toEqual(2);
    expect(addComponentResult.selectableChildren[0]).toEqual(1);
  });

  it('should take only alpha chars from name and capitalize first letter of each word', () => {
    const addComponentResult = componentReducer(initialAppStateMock, {
      type: types.ADD_COMPONENT,
      payload: { title: '34*&;first;;98<p></p>' },
    });
    expect(addComponentResult.nextId).toEqual(3);
    expect(addComponentResult.focusComponent.id).toEqual(2);
    expect(addComponentResult.focusComponent.title).toEqual('FirstPP');
    expect(addComponentResult.components[1].id).toEqual(2);
    expect(addComponentResult.components[1].title).toEqual('FirstPP');
    expect(addComponentResult.totalComponents).toEqual(2);
    expect(addComponentResult.selectableChildren[0]).toEqual(1);
  });

  it('should not add a component when submitted title is empty', () => {
    const addComponentResult = componentReducer(initialAppStateMock, {
      type: types.ADD_COMPONENT,
      payload: { title: '' },
    });
    expect(addComponentResult.nextId).toEqual(2);
    expect(addComponentResult.focusComponent.id).toEqual(1);
    expect(addComponentResult.focusComponent.title).toEqual('App');
    expect(addComponentResult.components[0].id).toEqual(1);
    expect(addComponentResult.components[0].title).toEqual('App');
    expect(addComponentResult.totalComponents).toEqual(1);
    expect(addComponentResult.selectableChildren).toEqual([]);
  });

  it('should not add a component when a component with that name already exists', () => {
    global.alert = jest.fn();
    const addComponentResult = componentReducer(initialAppStateMock, {
      type: types.ADD_COMPONENT,
      payload: { title: 'App' },
    });
    expect(addComponentResult.nextId).toEqual(2);
    expect(addComponentResult.focusComponent.id).toEqual(1);
    expect(addComponentResult.focusComponent.title).toEqual('App');
    expect(addComponentResult.components[0].id).toEqual(1);
    expect(addComponentResult.components[0].title).toEqual('App');
    expect(addComponentResult.totalComponents).toEqual(1);
    expect(addComponentResult.selectableChildren).toEqual([]);
  });
});

describe('addChild', () => {
  it('should add a component child correctly', () => {
    const addChildResult = componentReducer(aboutToAddChildMock, {
      type: types.ADD_CHILD,
      payload: { title: 'Child', childType: 'COMP', HTMLInfo: {} },
    });
    expect(addChildResult.focusComponent.childrenArray.length).toEqual(1);
    expect(addChildResult.focusComponent.focusChildId).toEqual(1);
    expect(addChildResult.focusComponent.nextChildId).toEqual(2);
    expect(addChildResult.focusChild.childId).toEqual(1);
    expect(addChildResult.focusChild.componentName).toEqual('Child');
    expect(addChildResult.focusChild.childType).toEqual('COMP');
    expect(addChildResult.focusChild.childSort).toEqual(1);
    expect(addChildResult.focusChild.childComponentId).toEqual(2);
    expect(addChildResult.components[1].childrenArray[0].componentName).toEqual('Child');
  });

  it('should add an HTML child correctly', () => {
    const addChildResult = componentReducer(aboutToAddChildMock, {
      type: types.ADD_CHILD,
      payload: { title: 'Image', childType: 'Image', HTMLInfo: {} },
    });
    expect(addChildResult.focusComponent.childrenArray.length).toEqual(1);
    expect(addChildResult.focusComponent.focusChildId).toEqual(1);
    expect(addChildResult.focusComponent.nextChildId).toEqual(2);
    expect(addChildResult.focusChild.childId).toEqual(1);
    expect(addChildResult.focusChild.componentName).toEqual('Image');
    expect(addChildResult.focusChild.childType).toEqual('HTML');
    expect(addChildResult.focusChild.childSort).toEqual(1);
    expect(addChildResult.focusChild.childComponentId).toEqual(null);
    expect(addChildResult.components[1].childrenArray[0].componentName).toEqual('Image');
  });
});

describe('deleteChild', () => {
  it('should delete a component child correctly', () => {
    const addChildResult = componentReducer(aboutToAddChildMock, {
      type: types.ADD_CHILD,
      payload: { title: 'Child', childType: 'COMP', HTMLInfo: {} },
    });

    const deleteChildResult = componentReducer(addChildResult, {
      type: types.DELETE_CHILD,
      payload: 2, // this is confusing bc this is actually the component's ID, not its child ID
    });

    expect(deleteChildResult.focusComponent.childrenArray.length).toEqual(0);
    expect(deleteChildResult.focusChild.childId).toEqual(0);
    expect(deleteChildResult.components[1].childrenArray.length).toEqual(0);
  });

  it('should delete an HTML child correctly', () => {
    const addChildResult = componentReducer(aboutToAddChildMock, {
      type: types.ADD_CHILD,
      payload: { title: 'Image', childType: 'Image', HTMLInfo: {} },
    });

    const deleteChildResult = componentReducer(addChildResult, {
      type: types.DELETE_CHILD,
      payload: 1, // this is the child ID of the html element
    });

    expect(deleteChildResult.focusComponent.childrenArray.length).toEqual(0);
    expect(deleteChildResult.focusChild.childId).toEqual(0);
    expect(deleteChildResult.components[1].childrenArray.length).toEqual(0);
  });

  it('should delete instances of a component as a child when the component has been deleted (uses alt form of action payload)', () => {
    const addChildResult = componentReducer(aboutToAddChildMock, {
      type: types.ADD_CHILD,
      payload: { title: 'Child', childType: 'COMP', HTMLInfo: {} },
    });

    const deleteChildResult = componentReducer(addChildResult, {
      type: types.DELETE_CHILD,
      payload: {
        parentId: 1,
        childId: 1,
        calledFromDeleteComponent: true,
      },
    });

    expect(deleteChildResult.focusComponent.childrenArray.length).toEqual(0);
    expect(deleteChildResult.focusChild.childId).toEqual(0);
    expect(deleteChildResult.components[1].childrenArray.length).toEqual(0);
  });
});

describe('deleteComponent', () => {
  it('should delete a component correctly', () => {
    const deleteComponentResult = componentReducer(aboutToDeleteComponentMock, {
      type: types.DELETE_COMPONENT,
      payload: {
        componentId: 2,
      },
    });
    expect(deleteComponentResult.totalComponents).toEqual(1);
    expect(deleteComponentResult.components.length).toEqual(1);
    expect(deleteComponentResult.components[0].title).toEqual('App');
  });

  it('App component is not deletable', () => {
    const deleteComponentResult = componentReducer(aboutToDeleteComponentMock, {
      type: types.DELETE_COMPONENT,
      payload: {
        componentId: 1,
      },
    });
    expect(deleteComponentResult.totalComponents).toEqual(2);
    expect(deleteComponentResult.components.length).toEqual(2);
    expect(deleteComponentResult.components[0].title).toEqual('App');
  });
});
