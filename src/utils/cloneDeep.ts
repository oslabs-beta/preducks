// index signatures
function cloneDeep<T>(value: { [key: string]: T } | T[] | T): { [key: string]: T } | T[] | T {
  if (Array.isArray(value)) {
    const result: any[] = [];
    value.forEach((el) => {
      if (typeof el === 'object') {
        result.push(cloneDeep(el));
      } else {
        result.push(el);
      }
    });
    return result;
  }
  if (typeof value === 'object' && value !== null) {
    const result: { [key: string]: any } = {};
    Object.keys(value).forEach((key) => {
      if (typeof value[key] === 'object') {
        result[key] = cloneDeep(value[key]);
      } else {
        result[key] = value[key];
      }
    });
    return result;
  }
  return value;
}

export default cloneDeep;
