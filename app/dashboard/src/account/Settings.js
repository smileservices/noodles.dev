import React, {useState} from "react";
import ReactDOM from "react-dom";
import MainContent from "./components/MainContent";
import AppLayout from "../AppLayout";

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<AppLayout content={MainContent} />, wrapper) : null;