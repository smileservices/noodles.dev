import React, {useState} from "react";
import ReactDOM from "react-dom";
import {makeId} from "./utils";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import MainContent from "./components/MainContent";

const USER_DATA = {
    'user_full_name': USER_FULL_NAME
}

function App() {
    return (
        <div key={makeId(8)}>
            <TopBar userData={USER_DATA}/>
            <div className="container-fluid">
                <div className="row">
                        <SideBar />
                        <MainContent />
                </div>
            </div>
        </div>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App/>, wrapper) : null;