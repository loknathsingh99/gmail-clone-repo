import React from "react";
import "../styles/Header.css";
// import { HiMenu, HiOutlineSearch } from "react-icons/hi";
// import { IoSettingsOutline, IoApps, IoOptionsSharp } from "react-icons/io5";
// import { BiHelpCircle } from "react-icons/bi";
// import { CgProfile } from "react-icons/cg";
import Gmail_m_icon from "../images/gmail-coloured-m-logo-transparent.png";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Avatar from "@material-ui/core/Avatar";
import { useStateValue } from "../StateProvider";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

import { useDispatch } from "react-redux";
import { logout } from "../features/userSlice";

import { selectCompose } from "../features/composeSlice";

import { auth } from "../firebase";
import { GithubAuthProvider, signOut } from "firebase/auth";
import { WhatsApp } from "@material-ui/icons";

function Header() {
    const [state, dispatchOld] = useStateValue();
    const navigate = useNavigate();

    const user = useSelector(selectUser);
    // console.log("selectUser", user);

    const compose = useSelector(selectCompose);
    // console.log("compose", compose);

    const dispatchRedux = useDispatch();

    function handleSignOut() {
        if (state.user) {
            signOut(auth);

            dispatchOld({
                type: "SIGN_OUT",
            });

            dispatchRedux(logout());

            navigate("/signin");
        }
    }

    return (
        <>
            <div className="header">
                <div className="header__left">
                    <span className="material-icons">menu</span>
                    <img src={Gmail_m_icon} alt="gmail" />
                    <p>Gmail Clone</p>
                </div>
                <div className="header__middle">
                    <span className="material-icons">search</span>
                    <input type="text" placeholder="Search mail" />
                    <span className="material-icons">tune</span>
                </div>
                <div className="header__right">
                    <span className="material-icons">help_outline</span>
                    <span className="material-icons">settings</span>
                    <span className="material-icons">apps</span>
                    {/* {state.user?.email} */}
                    <div className="tooltip__profile">
                        <Avatar
                            className="header__profile"
                            src={user?.photoURL}
                            style={{ width: "28px", height: "28px" }}
                            onClick={handleSignOut}
                        ></Avatar>
                        <span className="tooltiptext">
                            Log out <br />
                            {user?.displayName}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Header;
