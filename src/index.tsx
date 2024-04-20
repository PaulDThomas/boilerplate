import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthLayer } from "./auth/AuthLayer";
import { BrowserRouter } from "react-router-dom";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const Inner = (): JSX.Element => (
  <AuthLayer>
    <BrowserRouter>
      <FluentProvider theme={webLightTheme}>
        <App />
      </FluentProvider>
    </BrowserRouter>
  </AuthLayer>
);

if (process.env.NODE_ENV === "development") {
  root.render(
    <React.StrictMode>
      <Inner />
    </React.StrictMode>,
  );
} else {
  root.render(<Inner />);
}
