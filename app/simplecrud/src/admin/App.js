import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import AppLayout from "../../../dashboard/src/layout/AppLayout";
import {Alert} from "../../../src/components/Alert";
import {PeopleListing} from "./components/PeopleListing";
import {list} from "../../../src/api_interface/list";

function Content() {
    const [peopleListContent, setPeopleListContent] = useState({});
    const [alert, setAlert] = useState({});

    console.log('rendered content');

    useEffect(async () => {
        list(
            SIMPLECRUD_ADMIN.api_endpoint,
            'peoples',
            setPeopleListContent,
            (peoples) => peoples.map(person => <PeopleListing person={person} />)
        )
    }, []);

    return (
        <div>
            {alert ? <Alert text={alert.text} type={alert.type}/> : ""}
            <div className="card">
                <div className="card-header">
                    People App
                </div>
                <div className="card-body">
                    {peopleListContent.display}
                </div>
            </div>
        </div>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<AppLayout content={Content}/>, wrapper) : null;