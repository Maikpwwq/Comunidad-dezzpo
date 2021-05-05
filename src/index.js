import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles.styl";
// import * as serviceWorker from './serviceWorker';

var mountNode = document.getElementById("app");
ReactDOM.render(<App name="Jane" />, mountNode);

// serviceWorker.unregister();