/**
 * Transforms snake case keys to camel case keys.
 *
 * @param {object} obj object or array of objects, that can itself
 *     contain arrays.
 * @returns the same object with camel case keys.
 */
export function keysToCamel(obj) {
  return transformKeys(obj, toCamel);
}

function toCamel(str) {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
}

/**
 * Transforms camel case keys to snake case keys.
 *
 * @param {object} obj object or array of objects, that can itself
 *     contain arrays.
 * @returns the same object with snake case keys.
 */
export function keysToSnake(obj) {
  return transformKeys(obj, toSnake);
}

function toSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function transformKeys(obj, transformFunction) {
  if (isObject(obj)) {
    const resultingObject = {};
    Object.keys(obj).forEach((key) => {
      resultingObject[transformFunction(key)] = transformKeys(
        obj[key],
        transformFunction
      );
    });
    return resultingObject;
  } else if (Array.isArray(obj)) {
    return obj.map((element) => {
      return transformKeys(element, transformFunction);
    });
  }
  return obj;
}

function isObject(obj) {
  return (
    obj === Object(obj) && !Array.isArray(obj) && typeof obj !== "function"
  );
}

export function replaceKeyInObject(oldKey, newKey, object) {
  if (oldKey !== newKey) {
    Object.defineProperty(
      object,
      newKey,
      Object.getOwnPropertyDescriptor(object, oldKey)
    );
    delete object[oldKey];
  }
}
