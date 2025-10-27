import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const usersApi = api
  .enhanceEndpoints({ addTagTypes: ["agent", "agents", "agent-users"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      metrics: builder.query({
        query: ({search}) => ({
          url: `/dashboard/metrics`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["agents"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
    }),
  });

export const {
  useMetricsQuery,
} = usersApi;
