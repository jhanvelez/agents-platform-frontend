import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const privatePublicChatApi = api
  .enhanceEndpoints({ addTagTypes: ["PrivatePublicConfig"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      // Endpoints PRIVADOS (con JWT) - Solo para administración
      getPrivateConfig: builder.query({
        query: (agentId: string) => ({
          url: `/public-agent-config/agent/${agentId}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["PrivatePublicConfig"],
      }),

      createPublicConfig: builder.mutation({
        query: (configData: any) => ({
          url: "/public-agent-config",
          method: RequestMethod.POST,
          body: configData,
        }),
        invalidatesTags: ["PrivatePublicConfig"],
      }),

      updatePublicConfig: builder.mutation({
        query: ({ id, ...configData }: any) => ({
          url: `/public-agent-config/${id}`,
          method: RequestMethod.PATCH,
          body: configData,
        }),
        invalidatesTags: ["PrivatePublicConfig"],
      }),

      togglePublicConfig: builder.mutation({
        query: (id: string) => ({
          url: `/public-agent-config/${id}/toggle-status`,
          method: RequestMethod.POST,
        }),
        invalidatesTags: ["PrivatePublicConfig"],
      }),

      regenerateSlug: builder.mutation({
        query: (id: string) => ({
          url: `/public-agent-config/${id}/regenerate-slug`,
          method: RequestMethod.POST,
        }),
        invalidatesTags: ["PrivatePublicConfig"],
      }),

      getEmbedCode: builder.query({
        query: (id: string) => ({
          url: `/public-agent-config/${id}/embed-code`,
          method: RequestMethod.GET,
        }),
        providesTags: ["PrivatePublicConfig"],
      }),
    }),
  });

export const {
  useGetPrivateConfigQuery,
  useCreatePublicConfigMutation,
  useUpdatePublicConfigMutation,
  useTogglePublicConfigMutation,
  useRegenerateSlugMutation,
  useGetEmbedCodeQuery,
} = privatePublicChatApi;