import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const usersApi = api
  .enhanceEndpoints({ addTagTypes: ["assign-token", "assign-tokens"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      assignTokens: builder.mutation({
        invalidatesTags: ["assign-token"],
        query: (gymData) => ({
          url: "agent-token-usage/register",
          method: RequestMethod.POST,
          body: gymData,
        }),
      }),
    }),
  });

export const {
  useAssignTokensMutation
} = usersApi;
