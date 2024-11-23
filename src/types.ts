export type Token = {
  type: string;
  content: string;
};

export type TokenPattern = {
  [key: string]: RegExp[];
};
