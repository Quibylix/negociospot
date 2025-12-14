import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from "@casl/ability";

export type UserPermissionContext = {
  id: string;
} | null;

export type Actions = "create";
export type Subjects = "Session";

export function getUserAbility(user: UserPermissionContext) {
  const { can, build } = new AbilityBuilder<MongoAbility<[Actions, Subjects]>>(
    createMongoAbility,
  );

  if (!user) {
    can("create", "Session");
  }

  return build();
}
