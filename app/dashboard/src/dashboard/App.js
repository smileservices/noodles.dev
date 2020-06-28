import React, {useState} from "react";
import ReactDOM from "react-dom";
import AppLayout from "../layout/AppLayout";

function Content() {
    return (
        <div className="card">
            <div className="card-header">
                <h2>Welcome to the dashboard</h2>
            </div>
            <div className="card-body">
                <h2>The main dashboard view</h2>
            </div>
        </div>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<AppLayout content={Content} />, wrapper) : null;