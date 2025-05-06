import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../types/user";

interface UserState {
    users: User[];
    error:any;
    loading:any;
    filteredUsers: User[];
    selectedIds: string[];
}

const initialState: UserState = {
    users: [],
    error:[],
    loading:[],
    filteredUsers: [],
    selectedIds: [],
};

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
    const res = await axios.get<User[]>(
        "https://excelerate-profile-dev.s3.ap-south-1.amazonaws.com/1681980949109_users.json"
    );
    return res.data;
});

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        editUser: (state, action: PayloadAction<User>) => {
            const index = state.users.findIndex(u => u.id === action.payload.id);
            if (index !== -1) state.users[index] = action.payload;
            state.filteredUsers = [...state.users];
        },

        deleteMultipleUsers: (state, action) => {
            state.users = state.users.filter(user => !action.payload.includes(user.id));
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(u => u.id !== action.payload);
            state.filteredUsers = [...state.users];
        },
    },

    extraReducers: builder => {
 builder
  .addCase(fetchUsers.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(fetchUsers.fulfilled, (state, action) => {
    state.loading = false;
    state.users = action.payload;
    state.filteredUsers = action.payload;
    state.error = null;
  })
  .addCase(fetchUsers.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message || 'Failed to fetch users';
  });

    },
});

export const {
    editUser,
    deleteUser,
    deleteMultipleUsers,
} = userSlice.actions;

export default userSlice.reducer;
