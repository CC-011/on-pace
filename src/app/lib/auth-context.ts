import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

const initialState: UserState = {
  uid: null,
  email: null,
  displayName: null,
  photoURL: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (_, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;