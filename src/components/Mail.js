import React from "react";
import "../styles/Mail.css";
import MailListSettings from "./MailListSettings";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import { useSelector } from "react-redux";
import { selectMail } from "../features/mailSlice";

function Mail({ alterMailDetails }) {
    const mail = useSelector(selectMail);
    // console.log("mail is ", mail);
    let time = 0;
    let date = 0;

    if (mail?.sent_at) {
        date = new Date(mail.sent_at * 1000).toDateString();
        time = new Date(mail.sent_at * 1000).toLocaleTimeString();
    }
    // console.log(mail?.body);
    return (
        <div className="mail">
            <MailListSettings
                insideMail={true}
                id={mail?.id}
                alterMailDetails={alterMailDetails}
                deleted={mail?.deleted}
                spam={mail?.spam}
            />
            <div className="mail__container">
                <div className="mail__subject">
                    {mail?.subject} &nbsp;
                    <span
                        className={
                            mail?.important
                                ? "material-icons tooltip golden"
                                : "material-icons tooltip"
                        }
                        onClick={() =>
                            alterMailDetails(
                                mail?.id,
                                "IMPORTANT",
                                "from-mail",
                                null
                            )
                        }
                    >
                        label_important
                        <span className="tooltiptext">
                            {mail?.important ? "important" : "not important"}
                        </span>
                    </span>
                </div>
                <div className="mail__body">
                    <div className="mail__senderImager">
                        {/* <AccountCircleIcon /> */}
                        <span className="material-icons">account_circle</span>
                    </div>
                    <div className="mail__content">
                        <div className="mail__bodyTop">
                            <div className="mail__emailDetailsLeft">
                                <div className="mail__emailDetails">
                                    <div className="mail__senderName">
                                        {mail?.senders_name}
                                    </div>
                                    <div className="mail__senderEmail">
                                        &nbsp;&nbsp;{`<${mail?.sent_from}>`}
                                        {/* {`<${mail?.sendersMail}>`} */}
                                    </div>
                                </div>
                                <div className="mail__sentTo">
                                    To: &nbsp;
                                    {mail?.receivers_name?.toUpperCase()}
                                    &nbsp;
                                    {`<${mail?.sent_to}>`}{" "}
                                </div>
                            </div>
                            <div className="mail__emailDetailsRight">
                                <div className="mail__datetime">{`${date},  ${time}`}</div>
                                <div className="mail__options">
                                    <span
                                        className={
                                            mail?.starrted
                                                ? "material-icons tooltip golden"
                                                : "material-icons-outlined tooltip"
                                        }
                                        // style={{ color: "gold" }}
                                        onClick={() =>
                                            alterMailDetails(
                                                mail?.id,
                                                "STAR",
                                                "from-mail",
                                                null
                                            )
                                        }
                                    >
                                        star
                                        <span className="tooltiptext">
                                            {mail?.starrted
                                                ? "starred"
                                                : "not starred"}
                                        </span>
                                    </span>

                                    <span className="material-icons">
                                        reply
                                    </span>
                                    <span className="material-icons">
                                        more_vert
                                    </span>
                                </div>
                            </div>
                        </div>
                        {mail?.spam && (
                            <div className="mail__bodySpam">
                                <div className="mail__spamIcon">
                                    <span className="material-icons">
                                        report
                                    </span>
                                </div>
                                <div className="mail__bodySpamRight">
                                    Why is this message in spam?
                                    <button
                                        onClick={() =>
                                            alterMailDetails(
                                                mail?.id,
                                                "NONSPAM",
                                                "from-mail"
                                            )
                                        }
                                    >
                                        Report not spam
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mail__bodyMiddle">
                            <pre>{mail?.body}</pre>
                        </div>
                    </div>
                </div>
                {/* </div> */}
                <div className="mail__footer">
                    <button>
                        <span className="material-icons">reply</span>
                        Reply
                    </button>
                    <button>
                        <span className="material-icons">forward</span>
                        Forward
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Mail;
