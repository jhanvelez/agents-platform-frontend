import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const usersApi = api
  .enhanceEndpoints({ addTagTypes: ["permission", "permissions"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      permissions: builder.query({
        query: ({search}) => ({
          url: `/permissions`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["permissions"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      permission: builder.query({
        query: ({ id }: { id: string }) => ({
          url: `/roles/${id}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["permissions"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
    }),
  });

export const {
  usePermissionsQuery,
  usePermissionQuery,
} = usersApi;
