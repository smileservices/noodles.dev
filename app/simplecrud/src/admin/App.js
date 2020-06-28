import React, {useState} from "react";
import ReactDOM from "react-dom";
import AppLayout from "../../../dashboard/src/layout/AppLayout";

function Content() {
    return (
        <h3>People App!</h3>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<AppLayout content={Content} />, wrapper) : null;