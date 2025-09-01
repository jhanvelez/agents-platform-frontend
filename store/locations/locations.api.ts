import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const usersApi = api
  .enhanceEndpoints({ addTagTypes: ["locations"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      locations: builder.query({
        query: ({search}) => ({
          url: `/locations`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["locations"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
    }),
  });

export const {
  useLocationsQuery,
} = usersApi;
