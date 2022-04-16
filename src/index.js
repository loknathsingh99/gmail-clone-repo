import React from "react";
import ReactDom from "react-dom";
import "./index.css";
import App from "./App";

import Reducer, { initialState } from "./Reducer";
import { StateProvider } from "./StateProvider";

import { BrowserRouter as Router } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./app/store";

ReactDom.render(
    <Provider store={store}>
        <StateProvider initialState={initialState} reducer={Reducer}>
            <Router>
                <App />
            </Router>
        </StateProvider>
    </Provider>,
    document.getElementById("root")
);
