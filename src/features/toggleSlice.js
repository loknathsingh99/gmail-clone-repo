import { createSlice } from "@reduxjs/toolkit";

export const toggleSlice = createSlice({
    name: "toggle",
    initialState: {
        composeOpenToggle: false,
        mailOpenToggle: false,
        mailListType: "RECEIVED",
        hitQuery: null,
    },

    reducers: {
        openCompose: (state) => {
            state.composeOpenToggle = true;
        },
        closeCompose: (state) => {
            state.composeOpenToggle = false;
        },
        openMail: (state) => {
            state.mailOpenToggle = true;
        },
        closeMail: (state) => {
            state.mailOpenToggle = false;
        },
        setMailListType: (state, action) => {
            state.mailListType = action.payload.type;
        },
        setQuery: (state, action) => {
            state.hitQuery = action.payload.query;
        },
    },
});
export const {
    openCompose,
    closeCompose,
    openMail,
    closeMail,
    setMailListType,
    setQuery,
} = toggleSlice.actions;

export const selectOpenCompose = (state) => state.toggle.composeOpenToggle;
export const selectOpenMail = (state) => state.toggle.mailOpenToggle;
export const selectMailListType = (state) => state.toggle.mailListType;
export const selectQuery = (state) => state.toggle.hitQuery;
export default toggleSlice.reducer;
