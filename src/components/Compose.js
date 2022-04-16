import React, { useState, useEffect } from "react";
import "../styles/Compose.css";

import { useDispatch } from "react-redux";
import { close } from "../features/composeSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { resetDraft } from "../features/mailSlice";
//firebase data upload
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    serverTimestamp,
    setDoc,
    deleteDoc,
    getDoc,
} from "firebase/firestore";

function Compose({ draft }) {
    const [flag, setFlag] = useState(false);
    const emptyMail = {
        email_to: "",
        email_subject: "",
        email_body: "",
    };
    const [emailObject, setEmailObject] = useState(emptyMail);
    const db = getFirestore();
    const usersReference = collection(db, "users");

    useEffect(() => {
        if (draft) {
            // console.log("i am here", draft);
            setEmailObject({
                email_to: draft.sent_to,
                email_subject: draft.subject,
                email_body: draft.body,
            });
        }
    }, []);

    const dispatchRedux = useDispatch();
    const user = useSelector(selectUser);
    // console.log("my user is ", user);

    const handleChange = (e) => {
        setFlag(true);
        setEmailObject((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const getReceiversName = async () => {
        if (!emailObject?.email_to || emailObject?.email_to?.trim() == "")
            return "";

        const receiversDocReference = doc(
            usersReference,
            emailObject?.email_to
        );
        const docSnap = await getDoc(receiversDocReference);
        if (docSnap.exists()) {
            return docSnap?.data()?.displayName;
        }
        return "";
    };
    const saveMail = async (account, draft) => {
        // const senderDocReference = doc(usersReference, account);
        // const senderMailReference = collection(senderDocReference, "mails");
        console.log(account);
        const receivers_name = await getReceiversName();
        console.log(account);
        const accountReference = collection(db, `users/${account}/mails`);
        console.log(account);

        addDoc(accountReference, {
            sent_from: user?.email,
            sent_to: emailObject.email_to,
            subject: emailObject.email_subject,
            body: emailObject.email_body,
            sent_at: serverTimestamp(),
            senders_name: user?.displayName,
            // receivers_name: "receivers name",
            receivers_name: receivers_name,
            category: "primary",
            deleted: false,
            permanentDelete: false,
            draft: draft,
            important: false,
            spam: false,
            starrted: false,
            readed: false,
        })
            .then((response) => {
                // console.log("sender Reference", response);
                closeCompose();
                console.log(account);
            })
            .catch((e) => {
                console.log("error in ", account, e);
            });
        console.log(account);
    };
    const handleSend = async (e) => {
        e.preventDefault();
        if (emailObject.email_to.trim() == "") {
            alert("Please add receivers email");
            return;
        }
        await saveMail(user?.email, false);
        if (user?.email != emailObject?.email_to)
            await saveMail(emailObject?.email_to, false);

        if (draft && draft?.id) {
            deleteDraftMailFromDB();
        }
    };
    const deleteDraftMailFromDB = () => {
        const senderMailReference = collection(
            db,
            `users/${user?.email}/mails`
        );
        const mailDocReference = doc(senderMailReference, draft?.id);
        deleteDoc(mailDocReference);
    };
    async function closeOrDraft() {
        const senderMailReference = collection(
            db,
            `users/${user?.email}/mails`
        );

        console.log("kkkkk");
        if (draft && draft?.id) {
            console.log("dddd");
            const mailDocReference = doc(senderMailReference, draft?.id);
            console.log("dddd");
            if (
                emailObject.email_body.trim() == "" &&
                emailObject.email_to.trim() == "" &&
                emailObject.email_subject.trim() == ""
            ) {
                deleteDoc(mailDocReference);
                // console.log("delete draft mail");
            } else if (flag) {
                setDoc(mailDocReference, {
                    ...draft,
                    sent_to: emailObject.email_to,
                    subject: emailObject.email_subject,
                    body: emailObject.email_body,
                    sent_at: serverTimestamp(),
                });
                // console.log("update the draft mail- setDoc");
            }
            // console.log('reset draft in redux');
        } else if (
            emailObject.email_body.trim() != "" ||
            emailObject.email_to.trim() != "" ||
            emailObject.email_subject.trim() != ""
        ) {
            console.log("sss");
            await saveMail(user?.email, true);
            console.log("sss22");
        }
        console.log("ppp");

        // console.log("reset draft in redux");
        closeCompose();
    }

    function closeCompose() {
        dispatchRedux(resetDraft());
        dispatchRedux(close());
    }

    return (
        <div className="compose">
            <div className="compose__header">
                <div className="compose__headerLeft">
                    <span>New Message</span>
                </div>
                <div className="compose__headerRight">
                    <span className="material-icons">remove</span>
                    <span className="material-icons">open_in_full</span>
                    <span className="material-icons" onClick={closeOrDraft}>
                        close
                    </span>
                </div>
            </div>
            <div className="compose__body">
                <div className="compose__to">
                    <input
                        type="email"
                        name="email_to"
                        value={emailObject.email_to}
                        onChange={handleChange}
                    />
                </div>
                <div className="compose__subject">
                    <input
                        type="text"
                        name="email_subject"
                        value={emailObject.email_subject}
                        onChange={handleChange}
                    />
                </div>
                <div className="compose__content">
                    <textarea
                        rows="15"
                        name="email_body"
                        value={emailObject.email_body}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="compose__footer">
                <div className="compose__footerLeft">
                    <button onClick={handleSend}>Send</button>
                    <span className="material-icons">arrow_drop_down</span>
                </div>

                <div className="compose__footerRight">
                    <span className="material-icons">attach_file</span>
                    <span className="material-icons">link</span>
                    <span className="material-icons">insert_emoticon</span>
                    <span className="material-icons">insert_photo</span>
                    <span className="material-icons">delete</span>
                </div>
            </div>
        </div>
    );
}
export default Compose;
