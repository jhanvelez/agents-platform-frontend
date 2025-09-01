import { createSelector, createSlice } from "@reduxjs/toolkit";

import { authApi } from "@/store/auth/auth.api";

import { Role } from "./auth";

import { User } from "./auth.type";

export interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  user: User;
}

const initialState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
  user: {
    id: 0,
    firstName: "",
    lastName: "",
    documentId: "",
    email: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.accessToken = undefined;
      state.refreshToken = undefined;
      state.user = {
        id: 0,
        firstName: "",
        lastName: "",
        documentId: "",
        email: "",
      };
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
    setUserId: (state, action) => {
      state.user = {
        id: action.payload.id,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        documentId: action.payload.documentId,
        email: action.payload.email,        
      };
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      authApi.endpoints.logIn.matchFulfilled,
      (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      }
    );
    builder.addMatcher(
      authApi.endpoints.getUserById.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
      }
    );
  },
});

export const { logOut, setAccessToken, setUserId, setUser } = authSlice.actions;

export const selectAuth = (state: any) => state.auth;

export const selectAccessToken = createSelector(
  selectAuth,
  (auth) => auth.accessToken
);

export const selectRefreshToken = createSelector(
  selectAuth,
  (auth) => auth.refreshToken
);

export const selectUserId = createSelector(selectAuth, (auth) => auth.user?.id);

export const selectUser = createSelector(selectAuth, (auth) => auth.user);

export const selectPermissions = createSelector(
  selectAuth,
  (auth) => auth.user?.permissions
);

export const selectIsAdmin = createSelector(
  selectUser,
  (user) => user?.role === Role.Admin || user?.role === Role.SuperAdmin
);