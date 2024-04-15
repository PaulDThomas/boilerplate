import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthLayer } from "./auth/AuthLayer";
import { BrowserRouter } from "react-router-dom";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

if (process.env.NODE_ENV === "development") {
  root.render(
    <React.StrictMode>
      <AuthLayer>
        <BrowserRouter>
          <FluentProvider theme={webLightTheme}>
            <App />
          </FluentProvider>
        </BrowserRouter>
      </AuthLayer>
    </React.StrictMode>,
  );
} else {
  root.render(
    <AuthLayer>
      <BrowserRouter>
        <FluentProvider theme={webLightTheme}>
          <App />
        </FluentProvider>
      </BrowserRouter>
    </AuthLayer>,
  );
}
