import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
/* using chakra to deal with modals and other css things */
  <ChakraProvider>
    <React.StrictMode>
        <App />
    </React.StrictMode>
  </ChakraProvider>,
  
  document.getElementById("root")
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
