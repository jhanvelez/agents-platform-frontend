import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const systemMetricsApi = api
  .enhanceEndpoints({ addTagTypes: ["system-metric", "system-metrics"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      systemMetrics: builder.query({
        query: ({search}) => ({
          url: `/system/metrics`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["system-metric"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
    }),
  });

export const {
  useSystemMetricsQuery,
} = systemMetricsApi;
