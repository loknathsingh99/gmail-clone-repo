import React, { useState } from "react";

import "../styles/Sidebar.css";
import GmailPlusIcon from "../images/gmail-coloured-plus-icon-transparent.png";

import { useSelector } from "react-redux";
import { selectCompose } from "../features/composeSlice";
import { useDispatch } from "react-redux";
import { open } from "../features/composeSlice";

import { selectUser } from "../features/userSlice";
import { selectMailListType } from "../features/toggleSlice";

import { setMailList } from "../features/mailListSlice";
import { setMailListType } from "../features/toggleSlice";
import { closeMail } from "../features/toggleSlice";

import { setQuery } from "../features/toggleSlice";

import {
    getFirestore,
    collection,
    doc,
    query,
    orderBy,
    where,
    onSnapshot,
} from "firebase/firestore";

function Sidebar() {
    // const composeToggle = useSelector(selectCompose);
    const dispatchRedux = useDispatch();

    const mailListType = useSelector(selectMailListType);

    const openCompose = () => {
        dispatchRedux(open());
    };

    const user = useSelector(selectUser);

    useState(() => {
        // const q = query(
        //     userMailReference,
        //     where("sent_to", "==", user?.email),
        //     where("deleted", "==", false),
        //     orderBy("sent_at", "desc")
        // );
        // dispatchRedux(
        //     setQuery({
        //         query: q,
        //     })
        // );
    }, []);
    const closeMailBox = () => {
        dispatchRedux(closeMail());
    };

    function openSpecifiedMailType(value) {
        if (user?.email) {
            dispatchRedux(
                setMailListType({
                    type: value,
                })
            );

            const db = getFirestore();
            const usersReference = collection(db, "users");
            const userDocRefrence = doc(usersReference, user?.email);
            const userMailReference = collection(userDocRefrence, "mails");
            // -------------------------
            const q = query(
                userMailReference,
                where("sent_to", "==", user?.email),
                where("deleted", "==", false),
                orderBy("sent_at", "desc")
            );
            // dispatchRedux(
            //     setQuery({
            //         query: userMailReference,
            //     })
            // );
            // -------------------------
        }
        closeMailBox();
    }

    return (
        <div className="sidebar">
            <button className="sidebar__compose" onClick={openCompose}>
                <img src={GmailPlusIcon} alt="compose" />
                Compose
            </button>

            <div
                className={
                    mailListType === "RECEIVED"
                        ? "sidebar__options sidebar__optionActive"
                        : "sidebar__options"
                }
                onClick={() => openSpecifiedMailType("RECEIVED")}
            >
                <span className="material-icons">inbox</span>
                <p>Inbox</p>
            </div>
            <div
                className={
                    mailListType === "STARRED"
                        ? "sidebar__options sidebar__optionActive"
                        : "sidebar__options"
                }
                onClick={() => openSpecifiedMailType("STARRED")}
            >
                <span className="material-icons">star</span>
                <p>Starred</p>
            </div>
            <div
                className={
                    mailListType === "SENT"
                        ? "sidebar__options sidebar__optionActive"
                        : "sidebar__options"
                }
                onClick={() => openSpecifiedMailType("SENT")}
            >
                <span className="material-icons">send</span>
                <p>Sent</p>
            </div>
            <div
                className={
                    mailListType === "DRAFT"
                        ? "sidebar__options sidebar__optionActive"
                        : "sidebar__options"
                }
                onClick={() => openSpecifiedMailType("DRAFT")}
            >
                <span className="material-icons">description</span>
                <p>Drafts</p>
            </div>

            <div
                className={
                    mailListType === "IMPORTANT"
                        ? "sidebar__options sidebar__optionActive"
                        : "sidebar__options"
                }
                onClick={() => openSpecifiedMailType("IMPORTANT")}
            >
                <span className="material-icons">label_important</span>
                <p>Important</p>
            </div>

            <div
                className={
                    mailListType === "ALL_MAIL"
                        ? "sidebar__options sidebar__optionActive"
                        : "sidebar__options"
                }
                onClick={() => openSpecifiedMailType("ALL_MAIL")}
            >
                <span className="material-icons">email</span>
                <p>All mail</p>
            </div>

            <div
                className={
                    mailListType === "SPAM"
                        ? "sidebar__options sidebar__optionActive"
                        : "sidebar__options"
                }
                onClick={() => openSpecifiedMailType("SPAM")}
            >
                <span className="material-icons">report</span>
                <p>Spam</p>
            </div>

            <div
                className={
                    mailListType === "DELETED"
                        ? "sidebar__options sidebar__optionActive"
                        : "sidebar__options"
                }
                onClick={() => openSpecifiedMailType("DELETED")}
            >
                <span className="material-icons">delete</span>

                <p>Trash</p>
            </div>

            <div className="sidebar__footer">
                <div className="sidebar__icons">
                    <span className="material-icons">person</span>
                    <span className="material-icons">duo</span>
                    <span className="material-icons">message</span>
                </div>
            </div>
            <center>{user?.displayName}</center>
            {/* <div>list of users</div> */}
        </div>
    );
}
export default Sidebar;
