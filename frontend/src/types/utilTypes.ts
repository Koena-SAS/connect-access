type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

/**
 * Same as Object.keys() but narrows down the type instead of having string[].
 * cf. https://stackoverflow.com/a/59459000/1774332
 */
const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

/**
 * Same as Object.entries() but narrows down the type.
 */
const getEntries = Object.entries as <T extends object>(
  obj: T
) => [keyof T, T[keyof T]][];

export type { PartialRecord };
export { getKeys, getEntries };
