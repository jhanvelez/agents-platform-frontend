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
      toggleUser: builder.mutation({
        invalidatesTags: ["user"],
        query: ({ id }: any) => ({
          url: `/users/${id}/toggle-status`,
          method: RequestMethod.PUT,
        }),
      }),
    }),
  });

export const {
  useUsersQuery,
  useUserQuery,
  useStoreUserMutation,
  useUpdateUserMutation,
  useToggleUserMutation,
} = usersApi;
