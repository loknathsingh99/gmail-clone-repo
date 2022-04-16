import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import composeReducer from "../features/composeSlice";
import toggleReducer from "../features/toggleSlice";
import mailReducer from "../features/mailSlice";
import mailListReducer from "../features/mailListSlice";

export default configureStore({
    reducer: {
        user: userReducer,
        compose: composeReducer,
        toggle: toggleReducer,
        mail: mailReducer,
        mailList: mailListReducer,
    },
});
