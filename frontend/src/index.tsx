import React from "react";
import ReactDOM from "react-dom";
import AppWrapper from "./AppWrapper";
import { hideLogin } from "./constants/config";
import reportWebVitals from "./reportWebVitals";
import "./sass/main.scss";

if (process.env.NODE_ENV !== "production" && process.env.REACT_APP_CI !== "1") {
  // REACT_APP_CI is set to "1" to avoid injecting axe twice when running end to
  // end tests on the CI
  import("@axe-core/react").then((axe) => {
    axe.default(React, ReactDOM, 1000, undefined, {
      exclude: [["#djDebug"]],
    });
  });
}

if (process.env.NODE_ENV === "production" && process.env.REACT_APP_CI !== "1") {
  hideLogin();
}

ReactDOM.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
