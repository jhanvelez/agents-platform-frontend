import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const publicChatApi = api
  .enhanceEndpoints({ addTagTypes: ["PublicConfig", "PublicSession"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      getPrivateConfig: builder.query({
        query: (agentId: string) => ({
          url: `/public-agent-config/agent/${agentId}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["PublicConfig"],
      }),

      getPublicConfig: builder.query({
        query: (agentId: string) => ({
          url: `/public-agent-config/slug/${agentId}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["PublicConfig"],
      }),
      
      createPublicConfig: builder.mutation({
        query: (configData: any) => ({
          url: "/public-agent-config",
          method: RequestMethod.POST,
          body: configData, // Sin camelToSnake para evitar problemas
        }),
        invalidatesTags: ["PublicConfig"],
      }),
      
      updatePublicConfig: builder.mutation({
        query: ({ id, ...configData }: any) => ({
          url: `/public-agent-config/${id}`,
          method: RequestMethod.PATCH,
          body: configData, // Sin camelToSnake
        }),
        invalidatesTags: ["PublicConfig"],
      }),
      
      togglePublicConfig: builder.mutation({
        query: (id: string) => ({
          url: `/public-agent-config/${id}/toggle-status`,
          method: RequestMethod.POST,
        }),
        invalidatesTags: ["PublicConfig"],
      }),
      
      regenerateSlug: builder.mutation({
        query: (id: string) => ({
          url: `/public-agent-config/${id}/regenerate-slug`,
          method: RequestMethod.POST,
        }),
        invalidatesTags: ["PublicConfig"],
      }),

      getEmbedCode: builder.query({
        query: (id: string) => ({
          url: `/public-agent-config/${id}/embed-code`,
          method: RequestMethod.GET,
        }),
        providesTags: ["PublicConfig"],
      }),

      createPublicSession: builder.mutation({
        query: (sessionData: {
          configId: string;
          name: string;
        }) => ({
          url: "/public-chat/session",
          method: RequestMethod.POST,
          body: sessionData,
        }),
        invalidatesTags: ["PublicSession"],
      }),
      
      getPublicSession: builder.query({
        query: (sessionId: string) => ({
          url: `/public-chat/sessions/${sessionId}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["PublicSession"],
      }),
      
      sendPublicMessage: builder.mutation({
        query: (messageData: {
          sessionId: string;
          content: string;
        }) => ({
          url: "/public-chat/messages",
          method: RequestMethod.POST,
          body: messageData,
        }),
        invalidatesTags: ["PublicSession"],
      }),
      
      getSessionMessages: builder.query({
        query: (sessionId: string) => ({
          url: `/public-chat/sessions/${sessionId}/messages`,
          method: RequestMethod.GET,
        }),
        providesTags: ["PublicSession"],
      }),

    }),
  });

export const {
  useGetPrivateConfigQuery,
  useGetPublicConfigQuery,
  useCreatePublicConfigMutation,
  useUpdatePublicConfigMutation,
  useTogglePublicConfigMutation,
  useRegenerateSlugMutation,
  useGetEmbedCodeQuery,
  useCreatePublicSessionMutation,
} = publicChatApi;