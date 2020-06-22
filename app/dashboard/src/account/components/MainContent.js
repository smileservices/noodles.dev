import React, {useState} from "react";
import ReactDOM from "react-dom";
import {makeId} from "../../utils";

export default function MainContent(attrs) {
    return (
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Account</h1>
                <h2>Settings</h2>
            </div>
        </main>
    )
}