import React, { useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";
import SignIn from "./components/SignIn";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import { useStateValue } from "./StateProvider";

import { useDispatch } from "react-redux";
import { login, logout } from "./features/userSlice";

// import Compose from "./components/Compose";

import {
    getFirestore,
    collection,
    query,
    orderBy,
    where,
    onSnapshot,
    getDocs,
    doc,
} from "firebase/firestore";

import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import { selectMailList } from "./features/mailListSlice";
import { setMailList } from "./features/mailListSlice";
import { selectMail, resetMail } from "./features/mailSlice";
import { getSentMails } from "./features/mailListSlice";

import {
    selectMailListType,
    closeMail,
    setMailListType,
} from "./features/toggleSlice";

import { selectQuery } from "./features/toggleSlice";
import CreateAccount from "./components/CreateAccount";
// import {setQuery}
function App() {
    const [state, dispatchOld] = useStateValue();

    const dispatchRedux = useDispatch();

    const navigate = useNavigate();

    const user = useSelector(selectUser);
    const mailListType = useSelector(selectMailListType);
    const mail = useSelector(selectMail);
    // const hitQuery = useSelector(selectQuery);

    // console.log("mailListType from redux", mailListType);
    // console.log("hitQuery", hitQuery);
    // const mails = useSelector(selectMailList);

    useEffect(() => {
        // console.log("console on first render");

        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                console.log(currentUser.email, " is logged in");
                // console.log("current user", currentUser);
                // console.log("meta data", currentUser.metadata);
                dispatchOld({
                    type: "SET_USER",
                    user: currentUser,
                });

                dispatchRedux(
                    login({
                        user: {
                            displayName: currentUser.displayName,
                            email: currentUser.email,
                            creationTime: currentUser.metadata.creationTime,
                            lastLoginAt: currentUser.metadata.lastLoginAt,
                            lastSignInTime: currentUser.metadata.lastSignInTime,
                            photoURL: currentUser.photoURL,
                        },
                    })
                );

                if (!(mail?.sent_to === currentUser.email)) {
                    dispatchRedux(resetMail({}));
                    dispatchRedux(closeMail());
                    dispatchRedux(
                        setMailListType({
                            type: "RECEIVED",
                        })
                    );
                }
            } else {
                dispatchOld({
                    type: "SIGN_OUT",
                });

                dispatchRedux(logout({}));

                navigate("/signin");
            }
        });
    }, []);

    useEffect(() => {
        if (user?.email) {
            // trying firebase start

            // const tempColRefrence = collection(db, "userMailList");

            //         let qa = query(
            //             tempColRefrence,
            //             where("sent_to", "==", user?.email),
            //             where("deleted", "==", false),
            //             orderBy("sent_at", "desc")
            //         );
            //         await onSnapshot(qa, (snapshot) => {
            //             snapshot.docs.forEach((doc) => {
            //                 tempMails.push({
            //                     ...doc.data(),
            //                     id: doc.id,
            //                     sent_at: doc.data().sent_at.seconds,
            //                 });
            //             });

            //         }

            // trying firebase END
            const db = getFirestore();
            // const usersReference = collection(db, "users");
            // const userDocRefrence = doc(usersReference, user?.email);
            // const userMailReference = collection(userDocRefrence, "mails");
            const userMailReference = collection(
                db,
                `users/${user?.email}/mails`
            );
            let q = "";

            // switch (mailListType) {
            //     case "RECEIVED": {
            //         q = query(
            //             userMailReference,
            //             where("sent_to", "==", user?.email),
            //             where("deleted", "==", false),
            //             orderBy("sent_at", "desc")
            //         );
            //         break;
            //     }
            //     case "SENT": {
            //         q = query(
            //             userMailReference,
            //             where("sent_from", "==", user?.email),
            //             where("deleted", "==", false),
            //             orderBy("sent_at", "desc")
            //         );
            //         break;
            //     }
            //     case "STARRED": {
            //         q = query(
            //             userMailReference,
            //             where("starrted", "==", true),
            //             where("deleted", "==", false),
            //             orderBy("sent_at", "desc")
            //         );
            //         break;
            //     }
            //     case "IMPORTANT": {
            //         q = query(
            //             userMailReference,
            //             where("important", "==", true),
            //             where("deleted", "==", false),
            //             orderBy("sent_at", "desc")
            //         );
            //         break;
            //     }
            //     case "DELETED": {
            //         q = query(
            //             userMailReference,
            //             where("deleted", "==", true),
            //             orderBy("sent_at", "desc")
            //         );
            //         break;
            //     }
            //     case "ALL_MAIL": {
            //         q = query(
            //             userMailReference,
            //             where("deleted", "==", false),
            //             orderBy("sent_at", "desc")
            //         );
            //         break;
            //     }
            //     default: {
            //         q = query(
            //             userMailReference,
            //             where("sent_to", "==", user?.email),
            //             where("deleted", "==", false),
            //             orderBy("sent_at", "desc")
            //         );
            //         break;
            //     }
            // }

            // --------------------------------------

            // console.log("query", query.toString());

            // const qt = query(
            //     userMailReference,
            //     where("sent_to", "==", user?.email),
            //     where("deleted", "==", false),
            //     orderBy("sent_at", "desc")
            // );
            // let temprary = [];
            // await onSnapshot(qt, (snapshot) => {
            //     snapshot.docs.forEach((doc) => {
            //         temprary.push({
            //             ...doc.data(),
            //             id: doc.id,
            //             sent_at: doc.data().sent_at.seconds,
            //         });
            //     });
            //     dispatchRedux(
            //         setMailList({
            //             mailList: temprary,
            //         })
            //     );
            // });
            // console.log("onSnapshot he he", temprary);

            // ----------------------------
            // ----------------------------------
            q = query(
                userMailReference,
                // where("sent_to", "==", user?.email),
                // where("deleted", "==", false),
                orderBy("sent_at", "desc")
            );
            // onSnapshot(q, { includeMetadataChanges: false }, (snapshot) => {
            onSnapshot(q, (snapshot) => {
                console.log("in side onSnapshot");
                const tempMails = [];

                if (q == null || q.length == 0) {
                    // TODO add a welcome mail from me....
                }
                // console.log("pending ?:", snapshot.metadata.hasPendingWrites);
                // console.log("From cache ?:", snapshot.metadata.fromCache);
                // if (
                // !snapshot.metadata.hasPendingWrites &&
                // !snapshot.metadata.fromCache
                // )
                {
                    if (mailListType == "SENT") {
                        snapshot.docs.forEach((doc) => {
                            if (
                                doc.data().sent_from == user?.email &&
                                doc.data().deleted == false &&
                                doc.data().draft == false
                            ) {
                                tempMails.push({
                                    ...doc.data(),
                                    id: doc.id,
                                    sent_at: doc?.data()?.sent_at?.seconds,
                                });
                            }
                        });
                    } else if (mailListType == "RECEIVED") {
                        snapshot.docs.forEach((doc) => {
                            if (
                                doc.data().sent_to == user?.email &&
                                doc.data().deleted == false &&
                                doc.data().spam == false
                            ) {
                                tempMails.push({
                                    ...doc.data(),
                                    id: doc.id,
                                    sent_at: doc?.data()?.sent_at?.seconds,
                                });
                            }
                        });
                    } else if (mailListType == "STARRED") {
                        snapshot.docs.forEach((doc) => {
                            if (
                                doc.data().starrted == true &&
                                doc.data().deleted == false
                            ) {
                                tempMails.push({
                                    ...doc.data(),
                                    id: doc.id,
                                    sent_at: doc?.data()?.sent_at?.seconds,
                                });
                            }
                        });
                    } else if (mailListType == "IMPORTANT") {
                        snapshot.docs.forEach((doc) => {
                            if (
                                doc.data().important == true &&
                                doc.data().deleted == false
                            ) {
                                tempMails.push({
                                    ...doc.data(),
                                    id: doc.id,
                                    sent_at: doc?.data()?.sent_at?.seconds,
                                });
                            }
                        });
                    } else if (mailListType == "DELETED") {
                        snapshot.docs.forEach((doc) => {
                            if (doc.data().deleted == true) {
                                tempMails.push({
                                    ...doc.data(),
                                    id: doc.id,
                                    sent_at: doc?.data()?.sent_at?.seconds,
                                });
                            }
                        });
                    } else if (mailListType == "ALL_MAIL") {
                        snapshot.docs.forEach((doc) => {
                            if (
                                !doc.data().deleted &&
                                !doc.data().spam &&
                                !doc.data().draft
                            ) {
                                tempMails.push({
                                    ...doc.data(),
                                    id: doc.id,
                                    sent_at: doc?.data()?.sent_at?.seconds,
                                });
                            }
                        });
                    } else if (mailListType == "SPAM") {
                        snapshot.docs.forEach((doc) => {
                            if (
                                doc.data().deleted == false &&
                                doc.data().spam
                            ) {
                                tempMails.push({
                                    ...doc.data(),
                                    id: doc.id,
                                    sent_at: doc?.data()?.sent_at?.seconds,
                                });
                            }
                        });
                    } else if (mailListType == "DRAFT") {
                        snapshot.docs.forEach((doc) => {
                            if (
                                doc.data().deleted == false &&
                                doc.data().draft
                            ) {
                                tempMails.push({
                                    ...doc.data(),
                                    id: doc.id,
                                    sent_at: doc?.data()?.sent_at?.seconds,
                                });
                            }
                        });
                    } else {
                        snapshot.docs.forEach((doc) => {
                            if (
                                doc.data().deleted == false &&
                                doc.data().sent_at == user?.email
                            ) {
                                tempMails.push({
                                    ...doc.data(),
                                    id: doc.id,
                                    sent_at: doc?.data()?.sent_at?.seconds,
                                });
                            }
                        });
                    }

                    // snapshot.docs.forEach((doc) => {
                    //     if (mailListType == "SENT") {
                    //         if (doc.data().sent_from == user?.email)
                    //             tempMails.push({
                    //                 ...doc.data(),
                    //                 // ...tempObject,
                    //                 id: doc.id,
                    //                 sent_at: doc?.data()?.sent_at?.seconds,
                    //             });
                    //     } else {
                    //         tempMails.push({
                    //             ...doc.data(),
                    //             // ...tempObject,
                    //             id: doc.id,
                    //             sent_at: doc?.data()?.sent_at?.seconds,
                    //         });
                    //     }
                    // });
                    // adding mails to the state

                    console.log("mail count:", tempMails.length);
                    dispatchRedux(
                        setMailList({
                            mailList: tempMails,
                        })
                    );
                    // dispatchRedux(
                    //     getSentMails({ user: { email: user?.email } })
                    // );
                }
            });

            // ----------------------------------

            // getDocs(q)
            //     .then((snapshot) => {
            //         const tempMails = [];
            //         snapshot.docs.forEach((doc) => {
            //             tempMails.push({
            //                 ...doc.data(),
            //                 // ...tempObject,
            //                 id: doc.id,
            //                 sent_at: doc?.data()?.sent_at?.seconds,
            //             });
            //         });
            //         console.log("mail count:", tempMails.length);
            //         adding mails to the state
            //         dispatchRedux(
            //             setMailList({
            //                 mailList: tempMails,
            //             })
            //         );
            //     })
            //     .catch((e) => {
            //         console.log("error", e);
            //     });

            // ====================================================
            // for mail sorting

            // finalMailArray2.sort((a, b) => {
            //     if (a?.sent_at > b?.sent_at) {
            //         return 1;
            //     }
            //     if (a?.sent_at < b?.sent_at) {
            //         return -1;
            //     }
            //     return 0;
            // });
            // ====================================================
        }
    }, [user, mailListType]);

    return (
        <div className="app">
            {/* <Router> */}
            <div className="caution">
                Caution: It is a clone website just for learning purpose
            </div>
            <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/create" element={<CreateAccount />} />
                <Route
                    path="/"
                    exact
                    element={
                        <>
                            {/* <Header /> */}
                            <Home />
                        </>
                    }
                />

                <Route
                    path="*"
                    element={
                        <div>
                            <h2>Invalid url</h2>
                        </div>
                    }
                />
            </Routes>
            {/* <Compose /> */}
            {/* </Router> */}
        </div>
    );
}

export default App;
