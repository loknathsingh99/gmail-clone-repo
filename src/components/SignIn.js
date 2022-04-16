import React, { useState } from "react";
import "../styles/SignIn.css";
import GoogleLogo from "../images/Google-logo-transparent.png";

import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
    // getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";

import { useStateValue } from "../StateProvider";

//signin with google
import {
    // getAuth,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";

// add name to database

import {
    getFirestore,
    collection,
    query,
    orderBy,
    where,
    onSnapshot,
    getDocs,
    getDoc,
    doc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
//redux user login
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";

function SignIn() {
    const [emailI, setEmailI] = useState("");
    const [passwordI, setPasswordI] = useState("");
    const [signinPage, setSigninPage] = useState(true);
    const [state, dispatch] = useStateValue();
    const [createObject, setCreateObject] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPass: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCreateObject((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };
    const provider = new GoogleAuthProvider();

    const dispatchRedux = useDispatch();

    const handleEmail = (e) => {
        setEmailI(e.target.value);
    };
    const handlePassword = (e) => {
        setPasswordI(e.target.value);
    };

    function formValidation() {
        if (emailI?.trim() === "" || passwordI?.trim() === "") {
            alert("please enter valid Email and Password");
            return false;
        }
        return true;
    }

    function formValidation2() {
        if (createObject.firstName.trim() === "") {
            alert("Please enter first name");
            return false;
        } else if (createObject.lastName.trim() === "") {
            alert("please enter last name");
            return false;
        } else if (
            createObject.email.trim() === "" ||
            -1 === createObject.email.indexOf("@") ||
            createObject.email.indexOf("@") < 2 ||
            createObject.email.indexOf("@") >= createObject.email.length - 5
        ) {
            alert("please enter valid email");
            return false;
        } else if (
            createObject.password.trim() == "" ||
            createObject.password.length < 6 ||
            -1 != createObject.password.indexOf(" ")
        ) {
            alert("please enter valid password");
            return false;
        } else if (
            createObject.password.trim() != createObject.confirmPass.trim()
        ) {
            alert("password is not matching");
            return false;
        }
        return true;
    }
    function saveUserData(user) {
        const db = getFirestore();
        const usersReference = collection(db, "users");
        const userDocRefrence = doc(usersReference, user?.email);

        // const docSnap = getDocs(userDocRefrence);
        // console.log("getiing a doc of :", user?.email);
        setDoc(userDocRefrence, {
            displayName: user.displayName,
            email: user.email,
            // creationTime: user?.metadata?.creationTime,
            // lastLoginAt: user?.metadata?.lastLoginAt,
            // lastSignInTime: user?.metadata?.lastSignInTime,
            photoURL: user.photoURL,
        })
            .then(() => {
                console.log("data recorded");
                // console.log("snapshot data", snapshot.data());
            })
            .catch((error) => {
                console.log("error in recordind user data", error);
            });
    }
    const saveUserLoginInRedux = (user) => {
        dispatchRedux(
            login({
                user: {
                    displayName: user.displayName,
                    email: user.email,
                    // creationTime: user.metadata.creationTime,
                    // lastLoginAt: user.metadata.lastLoginAt,
                    // lastSignInTime: user.metadata.lastSignInTime,
                    photoURL: user.photoURL,
                },
            })
        );
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formValidation()) {
            signInWithEmailAndPassword(auth, emailI, passwordI)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("user is ", user);
                    // dispatch({
                    //     type: "SET_USER",
                    //     user: user,
                    // });

                    navigate("/");
                })
                .catch((error) => {
                    console.log("error in signin:", error);
                });
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();

        if (formValidation2()) {
            createUserWithEmailAndPassword(
                auth,
                createObject.email.trim(),
                createObject.password.trim()
            )
                .then((auth) => {
                    console.log("user created");

                    if (auth) {
                        console.log("auth :", auth);

                        updateProfile(auth.user, {
                            displayName:
                                createObject.firstName.trim() +
                                " " +
                                createObject.lastName.trim(),
                        })
                            .then(() => {
                                console.log("name updated");
                            })
                            .catch((e) => console.log(e));

                        // updateInfo.displayName =
                        //     createObject.firstName.trim() +
                        //     " " +
                        //     createObject.lastName.trim();

                        // auth.user.updateProfile(updateInfo);
                        // auth.updateProfile({
                        //     displayName:
                        //         createObject.firstName.trim() +
                        //         " " +
                        //         createObject.lastName.trim(),
                        // });

                        navigate("/");
                        const user = {
                            email: createObject.email,
                            displayName:
                                createObject.firstName.trim() +
                                " " +
                                createObject.lastName.trim(),
                            creationTime: {
                                metadata: {
                                    creationTime: serverTimestamp(),
                                },
                            },
                            photoURL: "",
                        };
                        saveUserLoginInRedux(user);
                        saveUserData(user);
                    }
                })
                .catch((error) => {
                    alert(error.message);
                });
        }
    };

    const handleSignInWithGoogle = (e) => {
        e.preventDefault();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // console.log("token", token);
                console.log("user is:", user);

                // storing user in redux
                saveUserLoginInRedux(user);
                // dispatchRedux(
                //     login({
                //         user: {
                //             displayName: user.displayName,
                //             email: user.email,
                //             creationTime: user.metadata.creationTime,
                //             lastLoginAt: user.metadata.lastLoginAt,
                //             lastSignInTime: user.metadata.lastSignInTime,
                //             photoURL: user.photoURL,
                //         },
                //     })
                // );
                saveUserData(user);

                // const db = getFirestore();
                // const usersReference = collection(db, "users");
                // const userDocRefrence = doc(usersReference, user?.email);
                // // const docSnap = getDocs(userDocRefrence);
                // // console.log("getiing a doc of :", user?.email);
                // setDoc(userDocRefrence, {
                //     displayName: user.displayName,
                //     email: user.email,
                //     creationTime: user.metadata.creationTime,
                //     lastLoginAt: user.metadata.lastLoginAt,
                //     lastSignInTime: user.metadata.lastSignInTime,
                //     photoURL: user.photoURL,
                // })
                //     .then(() => {
                //         console.log("data recorded");
                //         // console.log("snapshot data", snapshot.data());
                //     })
                //     .catch((error) => {
                //         console.log("error in recordind user data", error);
                //     });

                navigate("/");
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const errorEmail = error.email;
                // The AuthCredential type that was used.
                const errorCredential =
                    GoogleAuthProvider.credentialFromError(error);
                // ...

                console.log("errorCode", errorCode);
                console.log("errorMessage", errorMessage);
                console.log("errorEmail", errorEmail);
                console.log("errorCredential", errorCredential);
            });
    };

    return (
        <div className="signin">
            <form onSubmit={handleSubmit}>
                {signinPage ? (
                    <div className="signin__container">
                        <img src={GoogleLogo} alt="google" />
                        <h1>Sign in</h1>
                        <h4>to continue to Gmail Clone</h4>
                        <div className="signin__email">
                            <input
                                type="text"
                                value={emailI}
                                onChange={handleEmail}
                                placeholder="Email"
                            />
                            <span>Forget email ?</span>
                        </div>

                        <div className="signin__password">
                            <input
                                type="password"
                                value={passwordI}
                                onChange={handlePassword}
                                placeholder="Password"
                            />
                            <span>Forget password ?</span>
                        </div>
                        <div className="signin__options">
                            <button
                                onClick={() => setSigninPage(false)}
                                className="signin__create tooltip"
                            >
                                Creat account
                                <span className="tooltiptext">
                                    with Email and Password
                                </span>
                            </button>
                            <button
                                type="submit"
                                className="signin__next tooltip"
                            >
                                Sign In
                                <span className="tooltiptext">
                                    with Email and Password
                                </span>
                            </button>
                        </div>
                        <div>Or</div>
                        <div className="signin__options2">
                            <button
                                onClick={handleSignInWithGoogle}
                                className="signin__withGoogle"
                            >
                                <img
                                    width="20px"
                                    alt="Google sign-in"
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                                />
                                SignIn with google
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="create__container">
                        <>
                            <div>
                                <img src={GoogleLogo} alt="google" />
                                <h1>Create your Email Account</h1>
                                <div className="create__name">
                                    <input
                                        name="firstName"
                                        type="text"
                                        value={createObject.firstName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                    />
                                    <input
                                        name="lastName"
                                        type="text"
                                        value={createObject.lastName}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                    />
                                </div>
                                <div className="create__email">
                                    <input
                                        name="email"
                                        type="text"
                                        value={createObject.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                    />
                                    {/* <span>Forget email ?</span> */}
                                </div>

                                <div className="create__password">
                                    <input
                                        name="password"
                                        type="password"
                                        value={createObject.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                    />
                                    <input
                                        name="confirmPass"
                                        type="password"
                                        value={createObject.confirmPass}
                                        onChange={handleChange}
                                        placeholder="Password"
                                    />
                                    {/* <span>Forget password ?</span> */}
                                </div>

                                <div className="create__options">
                                    <button
                                        onClick={() => setSigninPage(true)}
                                        className="signin__create"
                                    >
                                        Sign in instead
                                    </button>

                                    <button
                                        onClick={handleCreate}
                                        className="signin__next"
                                    >
                                        Create
                                    </button>
                                    {/* <span>Forget password ?</span> */}
                                </div>
                            </div>
                            <div className="create__image">
                                <img src="https://ssl.gstatic.com/accounts/signup/glif/account.svg" />
                            </div>
                        </>
                    </div>
                )}
            </form>
            <div className="signin__footer">
                <div className="signin__language">
                    <p>English (India)</p>
                    <span className="material-icons">arrow_drop_down</span>
                </div>
                <div>This is fake website</div>
                <div className="signin__info">
                    <div>Help</div>
                    <div>Privacy</div>
                    <div>Terms</div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
