import { Profile, type Credentials } from "@/store/auth/auth";
import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";
import { camelToSnake, snakeToCamel } from "caseparser";

export const authApi = api
  .enhanceEndpoints({ addTagTypes: ["user", "auth.user", "profiles"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      createSession: builder.mutation({
        query: ({ userId }) => ({
          url: "/auth/session",
          method: RequestMethod.POST,
          body: camelToSnake({ userId }),
        }),
        transformResponse: (response) => response?.data,
      }),
      logIn: builder.mutation({
        query: (credentials: Credentials) => ({
          url: "auth/login",
          method: RequestMethod.POST,
          body: {
            ...credentials,
          },
        }),
      }),
      signUp: builder.mutation({
        query: (values) => ({
          url: "/users/register",
          method: RequestMethod.POST,
          body: {
            ...values
          },
        }),
        transformErrorResponse: (response) => {
          return response.data;
        },
      }),
      forgotPassword: builder.mutation({
        query: (body) => ({
          url: "/auth/forgot-password",
          method: "POST",
          body: {
            email: body.email,
          },
        }),
      }),
      resetPassword: builder.mutation({
        query: (body: { token: string; password: string }) => ({
          url: "/auth/reset-password",
          method: "POST",
          body: {
            token: body.token,
            password: body.password,
          },
        }),
      }),
      changePassword: builder.mutation({
        query: ({ id, password }) => ({
          url: "/auth/change-password",
          method: RequestMethod.POST,
          body: camelToSnake({
            id,
            password,
          }),
        }),
      }),
      profiles: builder.query({
        providesTags: ["profiles"],
        query: (credentials: Credentials) => ({
          url: "/auth/profiles",
          method: RequestMethod.POST,
          body: {
            username: credentials.username,
            password: credentials.password,
          },
        }),
        transformResponse: (response): Array<Profile> => response?.data,
      }),
      otherProfiles: builder.query({
        providesTags: ["profiles"],
        query: () => ({
          url: "/auth/others",
          method: RequestMethod.POST,
        }),
        transformResponse: (response) => snakeToCamel(response?.data),
      }),
      session: builder.query({
        query: () => ({
          url: `/auth/user`,
          method: RequestMethod.GET,
        }),
        transformResponse: (response) => snakeToCamel(response.data),
        providesTags: ["auth.user"],
      }),
      getUserById: builder.query({
        providesTags: ["user"],
        query: ({ id }) => ({
          url: `/api/v1/user-get/${id}`,
          method: RequestMethod.GET,
        }),
        transformResponse: (response) => {
          return {
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            documentId: response.data.documentId,
            email: response.data.email,
          };
        },
      }),
      googleLogIn: builder.mutation({
        query: (googleToken: string) => ({
          url: "auth/google",
          method: RequestMethod.POST,
          body: { token: googleToken },
        }),
      }),
    }),
  });

export const {
  useLogInMutation,
  useSignUpMutation,
  useProfilesQuery,
  useLazyProfilesQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserByIdQuery,
  useSessionQuery,
  useChangePasswordMutation,
  useCreateSessionMutation,
  useOtherProfilesQuery,
  useGoogleLogInMutation,
} = authApi;
