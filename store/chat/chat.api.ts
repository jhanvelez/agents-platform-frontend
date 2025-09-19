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
      chatSession: builder.query({
        query: ({ id } : { id: string }) => ({
          url: `/agents/${id}`,
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
      updateChatSession: builder.mutation({
        invalidatesTags: ["chat-session"],
        query: ({ id, active, name, email }: any) => ({
          url: `/agents/${id}`,
          method: RequestMethod.PUT,
          body: snakeToCamel({
            active,
            name,
            email,
          }),
        }),
      }),
    }),
  });

export const {
  useMessagesSessionQuery,
  useStartChatSessionMutation,
  useMessageChatSessionMutation,
  useChatSessionQuery,
} = chatSessionApi;
