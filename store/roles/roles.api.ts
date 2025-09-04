import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const usersApi = api
  .enhanceEndpoints({ addTagTypes: ["rol", "roles"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      roles: builder.query({
        query: ({search}) => ({
          url: `/roles`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["roles"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      rol: builder.query({
        query: ({ id }: { id: string }) => ({
          url: `/roles/${id}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["roles"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      storeRol: builder.mutation({
        invalidatesTags: ["rol"],
        query: (gymData) => ({
          url: "roles",
          method: RequestMethod.POST,
          body: gymData,
        }),
      }),
      updateRol: builder.mutation({
        invalidatesTags: ["rol"],
        query: ({ id, active, name, email }: any) => ({
          url: `/roles/${id}`,
          method: RequestMethod.PUT,
          body: snakeToCamel({
            active,
            name,
            email,
          }),
        }),
      }),
      addPermissionRol: builder.mutation({
        invalidatesTags: ["rol"],
        query: ({ rolId, permissionId }: { rolId: string, permissionId: string }) => ({
          url: `/roles/${rolId}/permissions/${permissionId}/add`,
          method: RequestMethod.POST,
        }),
      }),
      removePermissionRol: builder.mutation({
        invalidatesTags: ["rol"],
        query: ({ rolId, permissionId }: { rolId: string, permissionId: string }) => ({
          url: `/roles/${rolId}/permissions/${permissionId}/remove`,
          method: RequestMethod.POST,
        }),
      }),
      ToggleRol: builder.mutation({
        invalidatesTags: ["rol"],
        query: ({ id, state }: any) => ({
          url: `/users/state/${id}`,
          method: RequestMethod.PUT,
          body: snakeToCamel({
            state
          }),
        }),
      }),
    }),
  });

export const {
  useRolesQuery,
  useRolQuery,
  useStoreRolMutation,
  useUpdateRolMutation,
  useToggleRolMutation,
  useAddPermissionRolMutation,
  useRemovePermissionRolMutation,
} = usersApi;
