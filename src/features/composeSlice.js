import { createSlice } from "@reduxjs/toolkit";

export const composeSlice = createSlice({
    name: "compose",
    initialState: {
        composeToggle: false,
    },
    reducers: {
        open: (state) => {
            state.composeToggle = true;
        },
        close: (state) => {
            state.composeToggle = false;
        },
    },
});

export const { open, close } = composeSlice.actions;

export const selectCompose = (state) => state.compose.composeToggle;

export default composeSlice.reducer;
