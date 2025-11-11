import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number;
  firstName: string;
  lastName: string;
  documentId: string;
  phoneNumber: string;
  email: string;
  permissions: string[];
  tenant: null;
  role: string;
}

const initialState: UserState = {
  id: 0,
  firstName: "",
  lastName: "",
  documentId: "",
  phoneNumber: "",
  email: "",
  permissions: [],
  tenant: null,
  role: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
