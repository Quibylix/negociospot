export type FormValidator = (value: unknown, values?: unknown) => string | null;
export type FormValidators = {
  [key: string]: (value: unknown, values?: unknown) => string | null;
};
