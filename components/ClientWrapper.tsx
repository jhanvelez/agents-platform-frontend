"use client";

import { useUserQuery } from "@/store/users/users.api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/users/userSlice";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { data: userData, isError } = useUserQuery({ search: "" });
  const dispatch = useDispatch();

  function mapPermissions(apiPermissions: { action: string; subject: string }[]) {
    return apiPermissions.map((p) => {
      // El backend manda "user.read", lo separamos
      const [subject, action] = p.action.split(".");
      // Capitalizamos el subject para que encaje con CASL (User, Role, etc.)
      const formattedSubject =
        subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();

      return `${action}:${formattedSubject}`;
    });
  }

  useEffect(() => {
    if (userData) {
      dispatch(
        setUser({
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          tenant: userData.tenant,
          role: userData.roles[0]?.name || "viewer",
          permissions: mapPermissions(userData.roles[0]?.permissions || []),
        })
      );
    }

    if (isError) {
      dispatch(clearUser());
    }
  }, [userData, isError, dispatch]);

  return <main className="flex-1 overflow-auto px-6 pt-6">{children}</main>;
}
