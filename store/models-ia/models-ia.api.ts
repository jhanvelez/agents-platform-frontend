import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const modelsApi = api
  .enhanceEndpoints({ addTagTypes: ["models", "model"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      models: builder.query({
        query: ({ search }) => ({
          url: `/models-ia`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["models"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      modelsAssets: builder.query({
        query: ({ search }) => ({
          url: `/models-ia/assets`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["models"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      storeModel: builder.mutation({
        invalidatesTags: ["model"],
        query: (modelData) => ({
          url: "models-ia",
          method: RequestMethod.POST,
          body: modelData,
        }),
      }),
      updateModel: builder.mutation({
        invalidatesTags: ["model"],
        query: ({ id, ...payload }: any) => ({
          url: `/models-ia/${id}`,
          method: RequestMethod.PUT,
          body: snakeToCamel(payload),
        }),
      }),
      toggleModelStatus: builder.mutation({
        invalidatesTags: ["model"],
        query: ({ id }) => ({
          url: `/models-ia/${id}/toggle-status`,
          method: RequestMethod.PATCH,
        }),
      }),
    }),
  });

export const {
  useModelsQuery,
  useModelsAssetsQuery,
  useLazyModelsQuery,
  useStoreModelMutation,
  useUpdateModelMutation,
  useToggleModelStatusMutation,
} = modelsApi;
