import React, {useState} from "react";
import ReactDOM from "react-dom";
import {makeId} from "./utils";

function App() {
    return(
        <div key={makeId(8)}>
            <h1>React and Django set up successfully!</h1>
        </div>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App/>, wrapper) : null;