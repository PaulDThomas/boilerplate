import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthLayer } from "./auth/AuthLayer";
import "./custom.scss";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
if (process.env.NODE_ENV === "development") {
  root.render(
    <React.StrictMode>
      <AuthLayer>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthLayer>
    </React.StrictMode>,
  );
} else {
  root.render(
    <AuthLayer>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthLayer>,
  );
}
