import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";
import { Toggle } from "@radix-ui/react-toggle";

export const usersApi = api
  .enhanceEndpoints({ addTagTypes: ["atent", "tenants"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      tenants: builder.query({
        query: ({search}) => ({
          url: `/tenants`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["tenants"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      tenant: builder.query({
        query: () => ({
          url: `/tenants/agent`,
          method: RequestMethod.GET,
        }),
        providesTags: ["tenants"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      storeTenants: builder.mutation({
        invalidatesTags: ["atent"],
        query: (gymData) => ({
          url: "tenants",
          method: RequestMethod.POST,
          body: gymData,
        }),
      }),
      updateTenants: builder.mutation({
        invalidatesTags: ["atent"],
        query: ({ id, active, name, email }: any) => ({
          url: `/tenants/${id}`,
          method: RequestMethod.PUT,
          body: snakeToCamel({
            active,
            name,
            email,
          }),
        }),
      }),
      ToggleTenant: builder.mutation({
        invalidatesTags: ["atent"],
        query: ({ id, state }: any) => ({
          url: `/tenants/${id}/toggle-status`,
          method: RequestMethod.PATCH,
          body: snakeToCamel({
            state
          }),
        }),
      }),
    }),
  });

export const {
  useTenantsQuery,
  useTenantQuery,
  useStoreTenantsMutation,
  useUpdateTenantsMutation,
  useToggleTenantMutation,
} = usersApi;
