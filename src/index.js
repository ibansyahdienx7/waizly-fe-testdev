import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ValidUserContextProvider } from "./authCheck";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ValidUserContextProvider>
    <App />
  </ValidUserContextProvider>
);

reportWebVitals();
