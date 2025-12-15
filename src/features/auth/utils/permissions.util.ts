export type UserPermissionContext = {
  id: string;
} | null;

export type RestaurantPermissionContext = { id: string; admins: string[] };

const POLICIES = {
  Session: {
    create: (u) => u === null,
  },
} satisfies PoliciesSchema;

export function check(user: UserPermissionContext) {
  return {
    can<A extends Actions, S extends SubjectsWithAction<A>>(
      action: A,
      subject: S,
    ): CheckReturnType<A, S> {
      const policyResult = (
        POLICIES[subject][action as keyof Policies[S]] as PolicyResult<A, S>
      )(user);

      return {
        verify:
          typeof policyResult === "function"
            ? policyResult
            : () => policyResult,
      } as CheckReturnType<A, S>;
    },
  };
}

type PoliciesSchema = Record<
  string,
  Record<
    string,
    | ((u: UserPermissionContext) => (...args: never[]) => boolean)
    | ((u: UserPermissionContext) => boolean)
  >
>;
type Policies = typeof POLICIES;
type Actions = {
  [K in keyof Policies]: keyof Policies[K];
}[keyof Policies];
type SubjectsWithAction<A extends Actions> = {
  [K in keyof Policies]: A extends keyof Policies[K] ? K : never;
}[keyof Policies];

type CheckReturnType<
  A extends Actions,
  S extends SubjectsWithAction<A>,
> = S extends keyof Policies
  ? A extends keyof Policies[S]
    ? Policies[S][A] extends (u: UserPermissionContext) => boolean
      ? { verify: () => boolean }
      : Policies[S][A] extends (
            u: UserPermissionContext,
          ) => (...args: infer P) => boolean
        ? {
            verify: (...args: P) => boolean;
          }
        : never
    : never
  : never;

type PolicyResult<
  A extends Actions,
  S extends SubjectsWithAction<A>,
> = S extends keyof Policies
  ? A extends keyof Policies[S]
    ? Policies[S][A]
    : never
  : never;
