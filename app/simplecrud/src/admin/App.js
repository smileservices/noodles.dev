import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import AppLayout from "../../../dashboard/src/layout/AppLayout";
import {Alert} from "../../../src/components/Alert";
import {PeopleListing} from "./components/PeopleListing";
import {list} from "../../../src/api_interface/list";
import {TableFilterLayout} from "../../../src/components/TableFilterLayout";
import {PersonEditForm} from "./components/PersonEditForm";

function Content() {
    const [peopleListContent, setPeopleListContent] = useState({});
    const [alert, setAlert] = useState({});

    const [personEdit, setPersonEdit] = useState(false);

    console.log('rendered content');

    useEffect(async () => {
        list(
            SIMPLECRUD_ADMIN.api_endpoint,
            'peoples',
            setPeopleListContent,
            data => (
                <TableFilterLayout
                    key="table-people"
                    data={data}
                    filterBy={["name", "age", "nationality"]}
                    header={["ID", "name", "age", "nationality", "", ""]}
                    mapFunction={(person, idx) => <PeopleListing key={"person-list-" + person.id} person={person}
                                            editAction={person => setPersonEdit(person)} deleteAction={deletePerson}/>}
                />
            ),
        )
    }, []);

    function updatePerson(person) {
        console.log('Edit Person', person)
    }

    function createPerson(person) {
        console.log('Create Person', person)
    }

    function deletePerson(person) {
        console.log('Delete Person', person)
    }

    return (
        <section>
            <div className="section-body contain-lg">
            {alert ? <Alert text={alert.text} type={alert.type}/> : ""}
            <div className="card">
                <div className="card-header">

                </div>
                <div className="card-body">
                    {peopleListContent.display}
                </div>
            </div>
            {personEdit
                ?
                <div className="card card-underline">
                    <div className="card-head"><header>Edit Person {personEdit.name}</header></div>
                    <div className="card-body">
                        <PersonEditForm person={personEdit} />
                        <a className="btn btn-outline-primary" onClick={e => setPersonEdit(false)}>cancel</a>
                    </div>
                </div>
                : ''
            }
            </div>
        </section>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<AppLayout content={Content}/>, wrapper) : null;