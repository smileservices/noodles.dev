import React, {useState} from "react";
import ReactDOM from "react-dom";
import {makeId} from "./utils";
import TopBar from "./components/TopBar";

const USER_DATA = {
    'is_authenticated': USER_AUTH
}

function App() {
    return (
        <div key={makeId(8)}>
            <TopBar userData={USER_DATA}/>
            <div className="container-fluid">
                <div className="row">
                    <h1>React and Django set up successfully!</h1>
                </div>
            </div>
        </div>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App/>, wrapper) : null;