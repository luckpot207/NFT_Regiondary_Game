import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "./wallet";
import { Provider } from "react-redux";
import { store } from "./store";
import { CssBaseline } from "@mui/material";
import { themeConfig } from "./config/theme.config";
import { MoralisProvider } from "react-moralis";
import gameVersion from "./constants/gameVersion";

const { moralisServerUrl, moralisAppId } = gameVersion;

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
      serverUrl={moralisServerUrl + ""}
      appId={moralisAppId + ""}
    >
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={themeConfig}>
            <CssBaseline />
            <Web3ReactProvider getLibrary={getLibrary}>
              <App />
            </Web3ReactProvider>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
