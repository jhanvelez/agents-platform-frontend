import { Ability, AbilityBuilder } from "@casl/ability";

export type Actions = "manage" | "read" | "create" | "update" | "delete";
export type Subjects = "users" | "agents" | "dashboard" | "all" | "model" | "business" | "plans" | "conversation" | "analytics" | "monitoring" | "roles" | "settings" | "settings" | "manage-agents" | "profile";

export type AppAbility = Ability<[Actions, Subjects]>;

export function defineAbilityFor(role: string, permissions: string[]) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability as any);

  if (role === "Super Admin") {
    can("manage", "all");
  } else {
    permissions.forEach((perm) => {
      const [action, subject] = perm.split(":") as [Actions, Subjects];
      if (action && subject) {
        can(action, subject);
      }
    });
  }

  return build();
}
