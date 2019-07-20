const validateInput = (input: string = '') => {
  let inputValue = input
    .replace(/\s([a-z])/gi, el => el.toUpperCase())
    .replace(/\s/g, '');
  let error;
  const regex = /^([a-z$_]{1})[a-z0-9$_]+$/i;
  if (inputValue === '') {
    return {
      isValid: false,
      input: inputValue,
    }
  }
  if (regex.test(inputValue)) {
    if (reservedWords.indexOf(inputValue) === -1) {
      return {
        isValid: true,
        input: inputValue,
      };
    }
    error = `“${inputValue}” is a reserved word`;
  }
  return {
    isValid: false,
    input: inputValue,
    error: error || `Invalid input “${inputValue}”`,
  };
}

const reservedWords = [
  'abstract',
  'arguments',
  'await',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'double',
  'else',
  'enum',
  'eval',
  'export',
  'extends',
  'false',
  'final',
  'finally',
  'float',
  'for',
  'function',
  'goto',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'int',
  'interface',
  'let',
  'long',
  'native',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'volatile',
  'while',
  'with',
  'yield',
  // Not reserved, but not suggested:
  'Array',
  'Date',
  'eval',
  'function',
  'hasOwnProperty',
  'Infinity',
  'isFinite',
  'isNaN',
  'isPrototypeOf',
  'length',
  'Math',
  'NaN',
  'name',
  'Number',
  'Object',
  'prototype',
  'String',
  'toString',
  'undefined',
  'valueOf',
];

export default validateInput;