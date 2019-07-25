// HTML elements that the user can choose from
interface htmlElementInt {
  width: number;
  height: number;
  attributes: Array<string>;
}

interface htmlElementsInt {
  [key: string]: htmlElementInt;
}

const HTMLelements: htmlElementsInt = {
  image: {
    width: 100,
    height: 100,
    attributes: ['className', 'id', 'src'],
  },
  button: {
    width: 75,
    height: 28,
    attributes: ['className', 'id', 'text'],
  },
  form: {
    width: 150,
    height: 150,
    attributes: ['className', 'id', 'text'],
  },
  paragraph: {
    width: 250,
    height: 75,
    attributes: ['className', 'id', 'text'],
  },
  list: {
    width: 75,
    height: 75,
    attributes: ['className', 'id', 'text'],
  },
  link: {
    width: 50,
    height: 50,
    attributes: ['className', 'id', 'href', 'text'],
  },
};

export { HTMLelements };
