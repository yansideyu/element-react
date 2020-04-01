export function clone(object) {
  const newObject = object instanceof Array ? [...object] : { ...object };
  for (const key of Object.keys(object)) {
    if (newObject[key] instanceof Array) {
      newObject[key] = [...newObject[key]];

      // Note: typeof null === 'object'
    } else if (Object.prototype.toString.call(newObject[key]) === '[object Object]') {
      newObject[key] = clone(newObject[key]);
    }
  }
  return newObject;
}

export function merge(...objects) {
  const newObject = {};
  for (const object of objects) {
    for (const key of Object.keys(object || {})) {
      if (Object.prototype.toString.call(object[key]) !== '[object Object]') {
        newObject[key] = object[key];
      } else {
        newObject[key] = merge(newObject[key], object[key]);
      }
    }
  }
  return newObject;
}
