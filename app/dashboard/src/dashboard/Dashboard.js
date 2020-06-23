import React, {useState} from "react";
import ReactDOM from "react-dom";
import AppLayout from "../AppLayout";
import MainContent from "./components/MainContent";

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<AppLayout content={MainContent} />, wrapper) : null;