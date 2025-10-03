import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { authSlice } from "@/store/auth/auth.slice";
import { userSlice } from "@/store/users/userSlice";
import { api } from "@/store/app.api";


export const store = configureStore({
  devTools: true,
  reducer: combineReducers({
    [authSlice.name]: authSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [api.reducerPath]: api.reducer,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => store.dispatch;
