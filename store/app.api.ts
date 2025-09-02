import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { toasts } from "@/lib/toasts";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://ia.bybinary.co:3001/"
    : "http://localhost:3001/";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers: Headers) => {
    const token = localStorage.getItem("accessToken");

    headers.set("Accept", "application/json");
    headers.set("Accept-Language", "es");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    if (typeof window !== "undefined") {
      await toasts.warning(
        "Sesión expirada",
        "Inicia sesión nuevamente."
      );

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }

  if (result?.error?.status === 403) {
    if (typeof window !== "undefined") {
      await toasts.warning(
        "Acceso denegado",
        "No tienes permisos suficientes para acceder a esta sección."
      );

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
