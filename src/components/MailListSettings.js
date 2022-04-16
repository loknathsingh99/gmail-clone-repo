import React from "react";
import "../styles/MailListSettings.css";

import { useDispatch } from "react-redux";
import { closeMail } from "../features/toggleSlice";

function MailListSettings({ insideMail, id, alterMailDetails, deleted, spam }) {
    const dispatchRedux = useDispatch();
    const handleBack = () => {
        dispatchRedux(closeMail());
    };
    const deleteMail = () => {
        alterMailDetails(id, "DELETE");
        dispatchRedux(closeMail());
    };
    const restoreMail = () => {
        alterMailDetails(id, "RESTORE");
        dispatchRedux(closeMail());
    };

    return (
        <div className="mailListSettings">
            <div className="mailListSettings__left">
                {insideMail ? (
                    <>
                        <span className="material-icons" onClick={handleBack}>
                            arrow_back
                        </span>
                        {spam ? (
                            <span
                                className="notspam__button"
                                onClick={() =>
                                    alterMailDetails(id, "NONSPAM", "from-mail")
                                }
                            >
                                Not Spam
                            </span>
                        ) : (
                            <span
                                className="material-icons tooltip"
                                onClick={() =>
                                    alterMailDetails(id, "SPAM", "from-mail")
                                }
                            >
                                report
                                <span className="tooltiptext">Report spam</span>
                            </span>
                        )}

                        {deleted ? (
                            <span
                                className="material-icons tooltip"
                                onClick={restoreMail}
                            >
                                restore
                                <span className="tooltiptext">Restore</span>
                            </span>
                        ) : (
                            <span
                                className="material-icons tooltip"
                                onClick={deleteMail}
                            >
                                delete
                                <span className="tooltiptext">Delete</span>
                            </span>
                        )}
                    </>
                ) : (
                    <>
                        <input type="checkbox" />
                        <span className="material-icons">arrow_drop_down</span>
                    </>
                )}

                <span className="material-icons">refresh</span>
                <span className="material-icons">more_vert</span>
            </div>
            <div className="mailListSettings__right">
                <span className="material-icons">chevron_left</span>
                <span className="material-icons">chevron_right</span>
                <span className="material-icons">keyboard_hide</span>
                <span className="material-icons">arrow_drop_down</span>
            </div>
        </div>
    );
}

export default MailListSettings;
