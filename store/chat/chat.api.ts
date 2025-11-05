import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const chatSessionApi = api
  .enhanceEndpoints({ addTagTypes: ["chat-session", "chat-sessions"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      messagesSession: builder.query({
        query: ({sessionId}) => ({
          url: `/chat-messages/${sessionId}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["chat-sessions"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      startChatSession: builder.mutation({
        invalidatesTags: ["chat-session"],
        query: ({ agentId, message }: { agentId: string, message: string }) => ({
          url: `chat/${agentId}/start`,
          method: RequestMethod.POST,
          body: { message },
        }),
      }),
      messageChatSession: builder.mutation({
        invalidatesTags: ["chat-session"],
        query: ({ sessionId, message }: { sessionId: string, message: string }) => ({
          url: `chat/${sessionId}/message`,
          method: RequestMethod.POST,
          body: { message },
        }),
      }),
      chatSessions: builder.query({
        query: ({ search }) => ({
          url: `/chat-sessions`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["chat-sessions"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      exportChatSession: builder.mutation({
        invalidatesTags: ["chat-session"],
        query: ({ sessionId, email }: { sessionId: string, email: string }) => ({
          url: `chat/${sessionId}/export`,
          method: RequestMethod.POST,
          body: { email },
        }),
      }),
      SearchInChatSessions: builder.query({
        query: ({ query }) => ({
          url: `/search`,
          method: RequestMethod.GET,
          params: camelToSnake({
            query,
          }),
        }),
        providesTags: ["chat-sessions"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      chatAgentConversations: builder.query({
        query: ({ agentId, search }) => ({
          url: `/chat/agent/${agentId}/conversations`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["chat-sessions"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      chatAgentAnalytics: builder.query({
        query: ({ agentId, startDate, endDate }) => ({
          url: `/chat/analytics`,
          method: RequestMethod.GET,
          params: camelToSnake({
            agentId,
            startDate,
            endDate,
          }),
        }),
        providesTags: ["chat-sessions"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
    }),
  });

export const {
  useMessagesSessionQuery,
  useStartChatSessionMutation,
  useMessageChatSessionMutation,
  useChatSessionsQuery,
  useExportChatSessionMutation,
  useSearchInChatSessionsQuery,
  useChatAgentConversationsQuery,
  useChatAgentAnalyticsQuery,
} = chatSessionApi;
