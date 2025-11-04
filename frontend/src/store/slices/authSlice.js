import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiRequest } from "../../services/ApiRequest";

export const registerUserAsyncThunk = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await ApiRequest.signup(data);
      console.log("res:::", res?.data);
      return res?.data;
    } catch (error) {
      console.log("error:::", error);
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const loginUserAsyncThunk = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await ApiRequest.login(data);
      console.log("res:::", res?.data);
      return res?.data;
    } catch (error) {
      console.log("error:::", error);
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

let savedUser = null;
try {
  const rawUser = localStorage.getItem("user");
  if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
    savedUser = JSON.parse(rawUser);
  }
} catch (e) {
  console.warn("Invalid user data in localStorage:", e);
  localStorage.removeItem("user");
}

const savedToken = localStorage.getItem("token");

const initialState = {
  user: savedUser,
  token: savedToken || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
     setAuthState: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
    },
  },

  extraReducers: (builder) => {
    builder
      //  Signup cases
      .addCase(registerUserAsyncThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUserAsyncThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerUserAsyncThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login cases
      .addCase(loginUserAsyncThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUserAsyncThunk.fulfilled, (state, action) => {
        state.loading = false;
        const userData = action?.payload;

        state.user = { email: userData.email, user_id: userData.user_id };
        state.token = userData.access_token; 

        localStorage.setItem("access_token", userData.access_token); 
        localStorage.setItem("refresh_token", userData.refresh_token);
        localStorage.setItem("user", JSON.stringify(state.user));
      })

      .addCase(loginUserAsyncThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAuthState, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
