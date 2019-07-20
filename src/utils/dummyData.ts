import { StoreConfigInterface } from './Interfaces';

export const dummyComponent = {
  id: 1,
  stateful: false,
  title: 'App',
  color: '#FF6D00',
  props: [],
  nextPropId: 2,
  componentState: [{ name: 'hej', type: 'string', initialValue: 'hej' }],
  childrenArray: [
    {
      childId: 4,
      childSort: 4,
      childType: 'COMP',
      childComponentId: 7,
      componentName: 'Board',
      color: null,
      htmlElement: null,
      HTMLInfo: {},
    },
    {
      childId: 7,
      childSort: 7,
      childType: 'HTML',
      childComponentId: null,
      componentName: 'Image',
      color: null,
      htmlElement: 'Image',
      HTMLInfo: {},
    },
  ],
  nextChildId: 10,
  focusChildId: 7,
  focusChild: {
    childId: 7,
    childSort: 7,
    childType: 'HTML',
    childComponentId: null,
    componentName: 'Image',
    color: null,
    htmlElement: 'Image',
    HTMLInfo: {},
  },
  selectors: ['reducer1.property1', 'reducer2.property2'],
  actions: ['action1, action2'],
};

export const dummyAllComponents = [
  {
    id: 1,
    stateful: false,
    title: 'App',
    color: '#FF6D00',
    props: [],
    nextPropId: 2,
    childrenArray: [
      {
        childId: 4,
        childSort: 4,
        childType: 'COMP',
        childComponentId: 7,
        componentName: 'Board',
        color: null,
        htmlElement: null,
        HTMLInfo: {},
      },
      {
        childId: 7,
        childSort: 7,
        childType: 'HTML',
        childComponentId: null,
        componentName: 'Image',
        color: null,
        htmlElement: 'Image',
        HTMLInfo: {},
      },
    ],
    nextChildId: 10,
    focusChildId: 7,
    focusChild: {
      childId: 7,
      childSort: 7,
      childType: 'HTML',
      childComponentId: null,
      componentName: 'Image',
      color: null,
      htmlElement: 'Image',
      HTMLInfo: {},
    },
    selectors: [],
    actions: [],
  },
  {
    id: 7,
    stateful: false,
    title: 'Board',
    color: '#E3AFBC',
    props: [
      {
        id: 1,
        key: 'isGameOver',
        value: 'false',
        required: true,
        type: 'boolean',
      },
    ],
    nextPropId: 2,
    childrenArray: [
      {
        childId: 2,
        childSort: 2,
        childType: 'COMP',
        childComponentId: 8,
        componentName: 'Box',
        color: null,
        htmlElement: null,
        HTMLInfo: {},
      },
      {
        childId: 6,
        childSort: 6,
        childType: 'COMP',
        childComponentId: 8,
        componentName: 'Box',
        color: null,
        htmlElement: null,
        HTMLInfo: {},
      },
      {
        childId: 5,
        childSort: 5,
        childType: 'COMP',
        childComponentId: 8,
        componentName: 'Box',
        color: null,
        htmlElement: null,
        HTMLInfo: {},
      },
    ],
    nextChildId: 8,
    focusChildId: 0,
    focusChild: {
      childId: 5,
      childSort: 5,
      childType: 'COMP',
      childComponentId: 8,
      componentName: 'Box',
      color: null,
      htmlElement: null,
      HTMLInfo: {},
    },
    selectors: [],
    actions: [],
  },
  {
    id: 8,
    stateful: false,
    title: 'Box',
    color: '#8860D0',
    props: [
      {
        id: 1,
        key: 'gameState',
        value: '["","","","","","","","",""]',
        required: true,
        type: 'array',
      },
    ],
    nextPropId: 2,
    childrenArray: [],
    nextChildId: 1,
    focusChildId: -1,
    selectors: ['reducer1.property1', 'reducer2.property2', 'reducer3.property3'],
    actions: ['delet', 'add', 'chaeng'],
  },
];

const storeConfigTicTacToe: StoreConfigInterface = {
  interfaces: {},
  reducers: {
    game: {
      store: {
        boxVals: { type: 'string', array: true, initialValue: ['', '', '', '', '', '', '', ''] },
        isGameOver: { type: 'boolean', array: false, initialValue: false },
      },
      actions: {
        toggle: {
          parameter: { name: 'boxId', type: 'number', array: false },
          payload: { type: 'number', array: false },
          async: false,
        },
      },
    },
  },
};

const storeConfigTTTMultiReducer: StoreConfigInterface = {
  interfaces: {
    user: { name: 'string', password: 'string' },
    userAndHiScore: { user: 'user', hiScore: 'number' },
  },
  reducers: {
    game: {
      store: {
        boxVals: { type: 'string', array: true, initialValue: ['', '', '', '', '', '', '', ''] },
        isGameOver: { type: 'boolean', array: false, initialValue: false },
      },
      actions: {
        toggleBox: {
          parameter: { name: 'boxId', type: 'number', array: false },
          payload: { type: 'number', array: false },
          async: false,
        },
      },
    },
    user: {
      store: {
        otherUsers: {
          type: 'user',
          array: true,
          initialValue: [{ name: 'bob', password: 'dole' }],
        },
        name: { type: 'string', array: false, initialValue: 'dan' },
        score: { type: 'number', array: false, initialValue: 12 },
      },
      actions: {
        addPoint: {
          parameter: { name: '', type: '', array: false },
          payload: { type: 'number', array: false },
          async: false,
        },
        fetchHighScores: {
          parameter: { name: '', type: '', array: false },
          payload: { type: 'boolean', array: false },
          async: true,
        },
      },
    },
  },
};

// example for todo app
const storeConfigTodo: StoreConfigInterface = {
  // config at the global level for redux store/actions
  interfaces: {
    todo: { id: 'number', title: 'string', completed: 'boolean' },
  },
  reducers: {
    todos: {
      store: {
        todoArray: { type: 'todo', array: true, initialValue: [] },
        allCompleted: { type: 'boolean', array: false, initialValue: false },
      },
      actions: {
        fetchTodos: {
          parameter: { name: '', type: '', array: false },
          payload: { type: 'todo', array: true },
          async: true,
        },
        deleteTodo: {
          parameter: { name: 'id', type: 'number', array: false },
          payload: { type: 'number', array: false },
          async: false,
        },
      },
    },
  },
};

// module.exports = {
//   dummyComponent,
//   dummyAllComponents,
//   storeConfigTTTMultiReducer,
//   storeConfigTicTacToe,
//   storeConfigTodo,
// };
