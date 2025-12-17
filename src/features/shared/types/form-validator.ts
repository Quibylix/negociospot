export type FormValidator = (value: unknown, values?: unknown) => string | null;
export type FormValidators = {
  [key: string | symbol]:
    | FormValidators
    | ((value: unknown, values?: unknown) => string | null);
};
