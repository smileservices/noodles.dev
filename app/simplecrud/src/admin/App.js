import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import AppLayout from "../../../dashboard/src/layout/AppLayout";
import {Alert} from "../../../src/components/Alert";
import {PeopleListing} from "./components/PeopleListing";
import {list} from "../../../src/api_interface/list";
import {TablePaginationLayout} from "../../../src/components/TablePaginationLayout";
import {PersonEditForm} from "./components/PersonEditForm";
import {makeId} from "../../../src/components/utils";

function Content() {
    const [content, setContent] = useState({});
    const [query, setQuery] = useState({});
    const [pagination, setPagination] = useState({
        options: [2,4,5,10],
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });
    const [alert, setAlert] = useState({});

    const [personEdit, setPersonEdit] = useState(false);

    useEffect(() => {
        list(
            SIMPLECRUD_ADMIN.api_endpoint,
            'peoples',
            setContent,
            data => (
                <TablePaginationLayout
                    key="table-people"
                    data={data}
                    header={["ID", "name", "age", "nationality", "", ""]}
                    setPagination={setPagination}
                    pagination={pagination}
                    mapFunction={(person, idx) => <PeopleListing key={"person-list-" + person.id} person={person}
                                                                 editAction={person => setPersonEdit(person)}
                                                                 deleteAction={deletePerson}/>}
                />
            ),
            pagination,
            query
        )
    }, [pagination]);

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
                        {content.display}
                    </div>
                </div>
            </div>
        </section>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<AppLayout content={Content}/>, wrapper) : null;