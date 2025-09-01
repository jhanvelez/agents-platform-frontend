import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const usersApi = api
  .enhanceEndpoints({ addTagTypes: ["plans", "plan"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      plans: builder.query({
        query: ({search}) => ({
          url: `/plans`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["plans"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      storePlan: builder.mutation({
        invalidatesTags: ["plan"],
        query: (gymData) => ({
          url: "plans",
          method: RequestMethod.POST,
          body: gymData,
        }),
      }),
      updatePlan: builder.mutation({
        invalidatesTags: ["plan"],
        query: ({ id, active, name, email }: any) => ({
          url: `/plans/${id}`,
          method: RequestMethod.PUT,
          body: snakeToCamel({
            active,
            name,
            email,
          }),
        }),
      }),
      deletePlan: builder.mutation({
        invalidatesTags: ["plan"],
        query: ({ id }) => ({
          url: `/plans/${id}/toggle-status`,
          method: RequestMethod.PATCH,
        }),
      }),
    }),
  });

export const {
  usePlansQuery,
  useLazyPlansQuery,
  useStorePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = usersApi;
