import React from "react";
import "../styles/MailRow.css";

import { useDispatch } from "react-redux";
import { openMail } from "../features/toggleSlice";

import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

import { setMail, setDraft } from "../features/mailSlice";
import { open } from "../features/composeSlice";

import { selectMailListType } from "../features/toggleSlice";

// import { login } from "../features/userSlice";
// import {
//     doc,
//     collection,
//     getDoc,
//     getFirestore,
//     setDoc,
// } from "firebase/firestore";

function MailRow({
    id,
    sendersMail,
    subject,
    body,
    sent_at,
    mailItem,
    alterMailDetails,
}) {
    const dispatchRedux = useDispatch();
    // console.log("mail unique id ", id);
    // console.log("mailItem ", mailItem);
    const user = useSelector(selectUser);
    const mailListType = useSelector(selectMailListType);
    const openThisMail = (e) => {
        // console.log("here in mail list");
        if (mailItem.draft) {
            // console.log("he he draft open kr rha hai");
            dispatchRedux(
                setDraft({
                    draft: {
                        ...mailItem,
                    },
                })
            );
            dispatchRedux(open());
        } else {
            dispatchRedux(
                setMail({
                    mail: {
                        ...mailItem,
                        // readed:true
                    },
                })
            );
            dispatchRedux(openMail());
            if (!mailItem?.readed) alterMailDetails(id, "READED");
        }

        // setMail({
        //     mail: {
        //         id,
        //         sendersMail,
        //         subject,
        //         body,
        //         sent_at,
        //     },
        // })
    };

    // console.log("time", sent_at?.seconds);
    // console.log("time", );
    return (
        <div
            className={mailItem?.readed ? "mailrow mailrow__readed" : "mailrow"}
        >
            <div className="mailrow__options">
                <input type="checkbox" />
                <span
                    className={
                        mailItem?.starrted
                            ? "material-icons tooltip golden"
                            : "material-icons tooltip"
                    }
                    // style={{ color: "gold" }}
                    onClick={() => alterMailDetails(id, "STAR")}
                >
                    {mailItem?.starrted ? "star" : "star_outline"}
                    <span className="tooltiptext">
                        {mailItem?.starrted ? "starred" : "Not starred"}
                    </span>
                </span>

                <span
                    className={
                        mailItem?.important
                            ? "material-icons tooltip golden"
                            : "material-icons-outlined tooltip"
                    }
                    onClick={() => alterMailDetails(id, "IMPORTANT")}
                >
                    label_important
                    <span className="tooltiptext">
                        {mailItem?.important ? "important" : "Not important"}
                    </span>
                </span>
            </div>
            <div className="mailrow__sender" onClick={openThisMail}>
                <p>
                    {mailListType == "SENT"
                        ? `To: ${mailItem?.receivers_name?.toUpperCase()} <${
                              mailItem?.sent_to
                          }>`
                        : `${mailItem?.senders_name}`}
                </p>
            </div>
            <div className="mailrow__content1" onClick={openThisMail}>
                <p>
                    <span className="mailrow__subject">
                        {mailItem?.subject}{" "}
                    </span>
                    {mailItem?.body}
                </p>
            </div>
            {/* <p className="mailrow__description"> */}
            {/* <div className="mailrow__content">
                <p className="mailrow__subject">
                    Welcome to gmail -
                    <span className="mailrow__message">
                        here is the list of things you can do here hello i am
                        here here is the list of things you can do here hello i
                        am here is the list of things you can do here hello i am
                        here is the list of things you can do here here is the
                        list here is the list of things you can do here here is
                        list here is the list of things you can do here here is
                        list here is the list of things you can do here here is
                        list here is the list of things you can do here here is
                        the list here is the list of things you can do here here
                        is the list of things you can do here 
                    </span>
                </p>
            </div> */}
            {/* </p> */}
            <div className="mailrow__time" onClick={openThisMail}>
                {new Date(mailItem?.sent_at * 1000).toLocaleDateString()}
                {/* {new Date(sent_at?.seconds * 1000).toLocaleDateString()} */}
                {/* {new Date().toLocaleDateString()} */}
            </div>
        </div>
    );
}
export default MailRow;
