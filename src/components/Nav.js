import React from "react";
import "../styles/Nav.css";
import { AiFillStar } from "react-icons/ai";
import { IoSendSharp, IoMail } from "react-icons/io5";
import { IoMdDocument, IoMdTrash } from "react-icons/io";
import { MdOutlineLabelImportant } from "react-icons/md";
import { RiSpam2Fill } from "react-icons/ri";
import { GoInbox } from "react-icons/go";

import GmailPlusIcon from "../images/gmail-coloured-plus-icon-transparent.png";

function Nav() {
    return (
        <div className="nav">
            <div className="nav__container">
                <div className="nav__compose ">
                    <img src={GmailPlusIcon} alt="compose" />
                    <p>Compose</p>
                </div>
                <div className="nav__inbox nav__items">
                    <GoInbox className="nav__icons" />
                    <p>Inbox</p>
                </div>
                <div className="nav__starred nav__items">
                    <AiFillStar className="nav__icons" />
                    <p>Starred</p>
                </div>
                <div className="nav__sent nav__items">
                    <IoSendSharp className="nav__icons" />
                    <p>Sent</p>
                </div>
                <div className="nav__drafts nav__items">
                    <IoMdDocument className="nav__icons" />
                    <p>Drafts</p>
                </div>
                <div className="nav__important nav__items">
                    <MdOutlineLabelImportant className="nav__icons" />
                    <p>Important</p>
                </div>
                <div className="nav__allMail nav__items">
                    <IoMail className="nav__icons" />
                    <p>All mail</p>
                </div>
                <div className="nav__spam nav__items">
                    <RiSpam2Fill className="nav__icons" />
                    <p>Spam</p>
                </div>
                <div className="nav__trash nav__items">
                    <IoMdTrash className="nav__icons" />
                    <p>Trash</p>
                </div>
            </div>
        </div>
    );
}
export default Nav;
