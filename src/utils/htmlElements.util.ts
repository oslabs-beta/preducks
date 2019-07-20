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
  Image: {
    width: 100,
    height: 100,
    attributes: ['className', 'id', 'src'],
  },
  Button: {
    width: 75,
    height: 28,
    attributes: ['className', 'id', 'text'],
  },
  Form: {
    width: 150,
    height: 150,
    attributes: ['className', 'id', 'text'],
  },
  Paragraph: {
    width: 250,
    height: 75,
    attributes: ['className', 'id', 'text'],
  },
  List: {
    width: 75,
    height: 75,
    attributes: ['className', 'id', 'text'],
  },
  Link: {
    width: 50,
    height: 50,
    attributes: ['className', 'id', 'href', 'text'],
  },
};

export { HTMLelements };
