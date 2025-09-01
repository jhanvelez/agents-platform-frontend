import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const usersApi = api
  .enhanceEndpoints({ addTagTypes: ["user", "profiles", "users"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      users: builder.query({
        query: ({search}) => ({
          url: `/users`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["users"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      user: builder.query({
        query: () => ({
          url: `/users/user`,
          method: RequestMethod.GET,
        }),
        providesTags: ["users"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      storeUser: builder.mutation({
        query: (userData) => ({
          url: "users/register",
          method: RequestMethod.POST,
          body: userData,
        }),
      }),
      updateUser: builder.mutation({
        invalidatesTags: ["user"],
        query: ({ id, active, name, email }: any) => ({
          url: `/users/${id}`,
          method: RequestMethod.PUT,
          body: snakeToCamel({
            active,
            name,
            email,
          }),
        }),
      }),
      deleteUser: builder.mutation({
        query: ({ id }) => ({
          url: `/users/${id}`,
          method: RequestMethod.DELETE,
        }),
      }),
      toggleUser: builder.mutation({
        invalidatesTags: ["user"],
        query: ({ id, state }: any) => ({
          url: `admin/users/state/${id}`,
          method: RequestMethod.PUT,
          body: snakeToCamel({
            state
          }),
        }),
      }),
    }),
  });

export const {
  useUsersQuery,
  useUserQuery,
  useStoreUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserMutation,
} = usersApi;
