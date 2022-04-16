import React from "react";
import "../styles/Home.css";
import Compose from "./Compose";
import MailList from "./MailList";
import Sidebar from "./Sidebar";
// import MailListSettings from "./MailListSettings";
import Mail from "./Mail";

import { useSelector, useDispatch } from "react-redux";
import { selectCompose } from "../features/composeSlice";
import { selectMail, selectDraft } from "../features/mailSlice";

import { selectOpenMail } from "../features/toggleSlice";
import { setMail } from "../features/mailSlice";
import Header from "./Header";

import { selectUser } from "../features/userSlice";

import {
    doc,
    collection,
    getDoc,
    getFirestore,
    setDoc,
} from "firebase/firestore";

function Home() {
    const composeToggle = useSelector(selectCompose);
    const mailOpenToggle = useSelector(selectOpenMail);
    const user = useSelector(selectUser);
    const dispatchRedux = useDispatch();
    const mail = useSelector(selectMail);
    const draft = useSelector(selectDraft);

    const alterMailDetails = async (id, type, from = "", mailtemp) => {
        console.log("marking", id);
        const db = getFirestore();
        const usersReference = collection(db, "users");
        const userDocReference = doc(usersReference, user?.email);
        const mailCollection = collection(userDocReference, "mails");
        const mailDocReference = doc(mailCollection, id);
        // const mailDocReference2 = doc(db, `user/${user?.email}/mails/${id}`);

        const docSnap = await getDoc(mailDocReference);
        console.table("type", type);
        if (docSnap.exists()) {
            if (type == "STAR") {
                console.table("type", type);

                setDoc(mailDocReference, {
                    ...docSnap.data(),
                    starrted: !docSnap.data().starrted,
                });
                if (from == "from-mail") {
                    dispatchRedux(
                        setMail({
                            mail: {
                                ...mail,
                                starrted: !mail?.starrted,
                            },
                        })
                    );
                }
            } else if (type == "IMPORTANT") {
                console.table("type", type);

                setDoc(mailDocReference, {
                    ...docSnap.data(),
                    important: !docSnap.data().important,
                });
                if (from == "from-mail") {
                    dispatchRedux(
                        setMail({
                            mail: {
                                ...mail,
                                important: !mail?.important,
                            },
                        })
                    );
                }
            } else if (type == "DELETE") {
                console.table("type", type);

                setDoc(mailDocReference, {
                    ...docSnap.data(),
                    deleted: true,
                });
            } else if (type == "RESTORE") {
                console.log("i am here");
                setDoc(mailDocReference, {
                    ...docSnap.data(),
                    deleted: false,
                });
            } else if (type == "SPAM") {
                console.log("i am here");
                setDoc(mailDocReference, {
                    ...docSnap.data(),
                    spam: true,
                });

                if (from == "from-mail") {
                    dispatchRedux(
                        setMail({
                            mail: {
                                ...mail,
                                // spam: !mail?.spam,
                                spam: true,
                            },
                        })
                    );
                }
            } else if (type == "NONSPAM") {
                console.log("i am here");
                setDoc(mailDocReference, {
                    ...docSnap.data(),
                    spam: false,
                });

                if (from == "from-mail") {
                    dispatchRedux(
                        setMail({
                            mail: {
                                ...mail,
                                // spam: !mail?.spam,
                                spam: false,
                            },
                        })
                    );
                }
            } else if (type == "READED") {
                setDoc(mailDocReference, {
                    ...docSnap.data(),
                    readed: true,
                });
            }

            // console.table("type", type);
        }
    };

    return (
        <div className="home">
            <Header />
            <div className="home__container">
                <Sidebar />
                {/* <Nav /> */}
                {/* <MailListSettings /> */}
                {mailOpenToggle ? (
                    <Mail alterMailDetails={alterMailDetails} />
                ) : (
                    <MailList alterMailDetails={alterMailDetails} />
                )}
                {/* <MailList /> */}
                {/* <Mail /> */}
                {composeToggle && <Compose draft={draft} />}
            </div>
        </div>
    );
}
export default Home;
