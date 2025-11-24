import { snakeToCamel } from "caseparser";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://ia.bybinary.co:3001/"
  : "http://localhost:3001/";

const publicBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers: Headers) => {
    headers.set("Accept", "application/json");
    headers.set("Accept-Language", "es");
    return headers;
  },
});

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: publicBaseQuery,
  tagTypes: ["PublicConfig", "PublicSession"],
  endpoints: (builder) => ({
    getPublicConfig: builder.query({
      query: (publicSlug: string) => ({
        url: `/public-agent-config/slug/${publicSlug}`,
        method: RequestMethod.GET,
      }),
      providesTags: ["PublicConfig"],
    }),

    createPublicSession: builder.mutation({
      query: (sessionData: {
        configId: string;
        name: string;
        email?: string;
        phone?: string;
      }) => ({
        url: "/public-chat/session",
        method: RequestMethod.POST,
        body: sessionData,
      }),
      invalidatesTags: ["PublicSession"],
    }),

    getPublicSession: builder.query({
      query: (sessionId: string) => ({
        url: `/public-chat/session/${sessionId}`,
        method: RequestMethod.GET,
      }),
      providesTags: ["PublicSession"],
    }),

    sendPublicMessage: builder.mutation({
      query: (messageData: {
        sessionId: string;
        content: string;
      }) => ({
        url: "/public-chat/message",
        method: RequestMethod.POST,
        body: messageData,
      }),
      invalidatesTags: ["PublicSession"],
    }),

    getSessionMessages: builder.query({
      query: (sessionId: string) => ({
        url: `/public-chat/session/${sessionId}/messages`,
        method: RequestMethod.GET,
      }),
      providesTags: ["PublicSession"],
      transformResponse: (response: any) => snakeToCamel(response.data),
    }),

    closePublicSession: builder.mutation({
      query: (sessionId: string) => ({
        url: `/public-chat/session/${sessionId}/close`,
        method: RequestMethod.POST,
      }),
    }),
    exportPublicSession: builder.mutation({
      invalidatesTags: ["PublicSession"],
      query: ({ sessionId, email }: { sessionId: string, email: string }) => ({
        url: `public-chat/${sessionId}/export`,
        method: RequestMethod.POST,
        body: { email },
      }),
    }),
  }),
});

export const {
  useGetPublicConfigQuery,
  useCreatePublicSessionMutation,
  useGetPublicSessionQuery,
  useSendPublicMessageMutation,
  useGetSessionMessagesQuery,
  useClosePublicSessionMutation,
  useExportPublicSessionMutation,
} = publicApi;