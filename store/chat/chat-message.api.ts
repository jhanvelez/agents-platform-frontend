import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const chatSessionApi = api
  .enhanceEndpoints({ addTagTypes: ["chat-message", "chat-messages"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      feedbackMessage: builder.mutation({
        invalidatesTags: ["chat-message"],
        query: ({ messageId, liked }: { messageId: string, liked: boolean }) => ({
          url: `chat-messages/${messageId}/feedback`,
          method: RequestMethod.POST,
          body: { liked },
        }),
      }),
    }),
  });

export const {
  useFeedbackMessageMutation,
} = chatSessionApi;
