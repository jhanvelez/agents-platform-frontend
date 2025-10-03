import { Ability, AbilityBuilder } from "@casl/ability";

export type Actions = "manage" | "read" | "create" | "update" | "delete";
export type Subjects = "User" | "Agent" | "Dashboard" | "all" | "Model" | "Business" | "Plan" | "Conversation" | "Analytics" | "Monitoring" | "Roles" | "Settings" | "Settings";

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
