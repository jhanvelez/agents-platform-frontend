import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const usersApi = api
  .enhanceEndpoints({ addTagTypes: ["user", "profiles", "users"] })
  .injectEndpoints({
    overrideExisting: true,
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
        query: ({ id, userData }) => ({
          url: `/users/${id}`,
          method: RequestMethod.PUT,
          body: userData
        }),
      }),
      toggleUser: builder.mutation({
        invalidatesTags: ["user"],
        query: ({ id }: any) => ({
          url: `/users/${id}/toggle-status`,
          method: RequestMethod.PUT,
        }),
      }),
      userResetPassword: builder.mutation({
        query: (body: { currentPassword: string; newPassword: string }) => ({
          url: "/users/reset-password",
          method: "POST",
          body: {
            currentPassword: body.currentPassword,
            newPassword: body.newPassword,
          },
        }),
      }),
      updateInfo: builder.mutation({
        invalidatesTags: ["user"],
        query: (body: { firstName: string; lastName: string; documentId: string; phoneNumber: string; email: string }) => ({
          url: `/users/update-info`,
          method: RequestMethod.PUT,
          body: snakeToCamel(body),
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
  useUpdateInfoMutation,
  useUserResetPasswordMutation,
} = usersApi;
