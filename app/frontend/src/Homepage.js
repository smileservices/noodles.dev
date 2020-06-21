import React, {useState} from "react";
import ReactDOM from "react-dom";
import {makeId} from "./utils";
import TopBar from "./components/TopBar";
import MainContent from "./components/MainContent";

const USER_DATA = {
    'is_authenticated': USER_AUTH
}

function App() {
    return (
        <div key={makeId(8)}>
            <TopBar userData={USER_DATA}/>
            <MainContent />
        </div>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App/>, wrapper) : null;