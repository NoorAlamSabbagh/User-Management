import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../types/user";

interface UserState {
    users: User[];
    filteredUsers: User[];
    selectedIds: string[];
}

const initialState: UserState = {
    users: [],
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
        updateUser: (state, action) => {
            const { id, updatedData } = action.payload;
            const index = state.users.findIndex(user => user.id === id);
            if (index !== -1) {
                state.users[index] = { ...state.users[index], ...updatedData };
            }
        },

        deleteMultipleUsers: (state, action) => {
            state.users = state.users.filter(user => !action.payload.includes(user.id));
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(u => u.id !== action.payload);
            state.filteredUsers = [...state.users];
        },
        deleteSelected: (state) => {
            state.users = state.users.filter(u => !state.selectedIds.includes(u.id));
            state.filteredUsers = [...state.users];
            state.selectedIds = [];
        },
        setFilteredUsers: (state, action: PayloadAction<User[]>) => {
            state.filteredUsers = action.payload;
        },
        toggleSelect: (state, action: PayloadAction<string>) => {
            if (state.selectedIds.includes(action.payload)) {
                state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
            } else {
                state.selectedIds.push(action.payload);
            }
        },
        selectAll: (state, action: PayloadAction<string[]>) => {
            state.selectedIds = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.users = action.payload;
            state.filteredUsers = action.payload;
        });
    },
});

export const {
    editUser,
    deleteUser,
    deleteSelected,
    setFilteredUsers,
    toggleSelect,
    selectAll,
    deleteMultipleUsers,
    updateUser
} = userSlice.actions;

export default userSlice.reducer;
