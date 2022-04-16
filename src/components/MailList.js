import React, { useEffect, useState } from "react";
import "../styles/MailList.css";
import MailListSettings from "./MailListSettings";
import MailRow from "./MailRow";

import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectMailList } from "../features/mailListSlice";
import { setMailList } from "../features/mailListSlice";

import { useDispatch } from "react-redux";
import { selectMailListType } from "../features/toggleSlice";

// import { query } from "firebase/firestore/lite";

function MailList({ alterMailDetails }) {
    const dispatchRedux = useDispatch();

    const user = useSelector(selectUser);
    const mailListType = useSelector(selectMailListType);
    // console.log("mailListType from redux", mailListType);
    const mails = useSelector(selectMailList);
    // console.table(mails);
    // console.log(user);
    // function
    // try to use async here

    return (
        <div className="maillist">
            <MailListSettings />
            <div className="maillist__container">
                {mailListType == "RECEIVED" && (
                    <div className="maillist__section">
                        <div className="section section__selected">
                            <span className="material-icons">inbox</span>
                            <p>Primary</p>
                        </div>

                        <div className="section">
                            <span className="material-icons">people</span>
                            <p>Social</p>
                        </div>

                        <div className="section">
                            <span className="material-icons">local_offer</span>
                            <p>Promotions</p>
                        </div>

                        <div className="section">
                            <span className="material-icons">info</span>
                            <p>Updates</p>
                        </div>
                    </div>
                )}

                <div className="maillist__list">
                    {mails.map((mailItem) => {
                        return (
                            <MailRow
                                key={mailItem.id}
                                id={mailItem.id}
                                sendersMail={mailItem.sent_from}
                                subject={mailItem.subject}
                                body={mailItem.body}
                                sent_at={mailItem.sent_at}
                                mailItem={mailItem}
                                alterMailDetails={alterMailDetails}
                            />
                        );
                    })}
                    {/* 
                    <MailRow />
                    <MailRow />
                    <MailRow />
                    <MailRow />
                    <MailRow />
                    <MailRow />

                    <MailRow /> */}
                </div>
                {/* <div className="maillist__footer">
                Terms · Privacy · Program Policies
            </div> */}
            </div>
        </div>
    );
}

export default React.memo(MailList);
