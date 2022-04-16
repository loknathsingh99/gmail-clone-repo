import { createSlice } from "@reduxjs/toolkit";

import {
    getFirestore,
    collection,
    query,
    orderBy,
    where,
    getDocs,
    onSnapshot,
} from "firebase/firestore";

import { useSelector } from "react-redux";

export const mailListSlice = createSlice({
    name: "mailList",
    initialState: {
        mailList: [],
    },
    reducers: {
        setMailList: (state, action) => {
            state.mailList = action.payload.mailList;
        },
        resetMailList: (state) => {
            state.mailList = [];
        },
        getSentMails: (state, action) => {
            // const user = getUser();
            console.log("i will execute on each snapshot", action.payload.user);
            if (action.payload.user?.email) {
                const db = getFirestore();
                const userMailReference = collection(
                    db,
                    `users/${action.payload.user.email}/mails`
                );
                const q = query(userMailReference, orderBy("sent_at", "desc"));

                // getDocs(q)
                //     .then((snapshot) => {
                //         console.log(snapshot.docs);
                //         const tempMails = [];
                //         snapshot.docs.forEach((doc) => {
                //             tempMails.push({
                //                 ...doc.data(),
                //                 id: doc.id,
                //                 sent_at: doc?.data()?.sent_at?.seconds,
                //             });
                //         });
                //         state.mailList = tempMails;
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //     });
            }
        },
    },
});

export const { setMailList, resetMailList, getSentMails } =
    mailListSlice.actions;

export const selectMailList = (state) => state.mailList.mailList;

export default mailListSlice.reducer;
