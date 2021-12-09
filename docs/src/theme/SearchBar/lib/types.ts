type Input = {
  setVal: (value: string) => void;
  before: (element: string) => void;
  remove: () => void;
  attr: (attribute: string) => void;
  offset: () => { left: number };
  width: () => number;
  length: number;
  prev: () => Input;
  find: (selector: string) => Input;
};

type Query = {};

type Hit = {
  hierarchy: {
    lvl0: string;
    lvl1: string;
  };
  url: string;
  anchor?: string;
  _snippetResult?: {
    content: {
      value: string;
      matchLevel: string;
    };
  };
  _highlightResult: {
    hierarchy: {
      lvl0: {
        value: string;
      };
      lvl1: {
        value: string;
      };
    };
  };
};

export type { Query, Input, Hit };
