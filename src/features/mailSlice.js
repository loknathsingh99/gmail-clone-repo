import { createSlice } from "@reduxjs/toolkit";

export const mailSlice = createSlice({
    name: "mail",
    initialState: {
        mail: null,
        draft: null,
    },
    reducers: {
        setMail: (state, action) => {
            state.mail = action.payload.mail;
        },
        resetMail: (state) => {
            state.mail = null;
        },
        setDraft: (state, action) => {
            state.draft = action.payload.draft;
        },
        resetDraft: (state, action) => {
            state.draft = null;
        },
    },
});

export const { setMail, resetMail, setDraft, resetDraft } = mailSlice.actions;

export const selectMail = (state) => state.mail.mail;
export const selectDraft = (state) => state.mail.draft;
export default mailSlice.reducer;
