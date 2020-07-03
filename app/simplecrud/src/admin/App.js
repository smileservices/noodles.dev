import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import AppLayout from "../../../dashboard/src/layout/AppLayout";
import {PeopleListing} from "./components/PeopleListing";
import {list} from "../../../src/api_interface/list";
import {TableLayout} from "../../../src/components/TableLayout";
import {makeId} from "../../../src/components/utils";
import {PaginationDropdown, PaginationElement} from "../../../src/components/pagination";
import {Waiting} from "../../../src/components/Waiting";
import {Alert} from "../../../src/components/Alert";
import {FilterComponent} from "../../../src/components/FilterComponent";

function Content() {
    const [data, setData] = useState({});
    const [waiting, setWaiting] = useState('');
    const [hasError, setError] = useState('');
    const [alert, setAlert] = useState({});

    const [pagination, setPagination] = useState({
        options: [2, 4, 5, 10],
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });

    const [queryFilter, setQueryFilter] = useState({});
    const [querySort, setQuerySort] = useState({});
    const [querySearch, setQuerySearch] = useState({});

    const [personEdit, setPersonEdit] = useState(false);

    const filterFields = {
        nationality: {
            text: 'Nationality',
            options: {
                ro: 'Romanian',
                au: 'Austrian',
                en: 'Endlish',
            }
        },
        age: {
            text: 'Age',
            options: {
                15: '15',
                12: '12',
                13: '13',
            }
        }
    }

    useEffect(() => {
        list(
            SIMPLECRUD_ADMIN.api_endpoint,
            pagination,
            setData,
            setWaiting, setError,
            queryFilter, querySort, querySearch
        )
    }, [pagination, queryFilter, querySort, querySearch]);

    function updatePerson(person) {
        console.log('Edit Person', person)
    }

    function createPerson(person) {
        console.log('Create Person', person)
    }

    function deletePerson(person) {
        console.log('Delete Person', person)
    }

    const DisplayContent = () => {
        function Table() {
            if (data.results && data.results.length > 0) {
                return (
                    <TableLayout
                        key="table-people"
                        data={data.results}
                        header={["ID", "name", "age", "nationality", "", ""]}
                        mapFunction={
                            (person, idx) => <PeopleListing key={"person-list-" + person.id}
                                                            person={person}
                                                            editAction={person => setPersonEdit(person)}
                                                            deleteAction={deletePerson}/>
                        }/>
                )
            } else {
                return (
                    <h3>No entries exist</h3>
                )
            }
        }

        const ContentLayout = (
            <div className="card-body">
                <div className="pull-right">
                    <PaginationDropdown key={makeId(5)} pagination={pagination}
                                        setPagination={setPagination}/>
                </div>
                <div>
                    {Table()}
                </div>
                <div className="pull-left">
                    {data ?
                        <PaginationElement pagination={pagination} resultsCount={data.count}
                                           setPagination={setPagination}/>
                        : ''}
                </div>
            </div>
        )

        const HasWaiting = (
            <div className="card-body">
                <Waiting text={waiting}/>
            </div>
        )
        const HasError = (
            <div className="card-body">
                <Alert text={hasError} type="danger"/>
            </div>
        )

        if (waiting) return HasWaiting;
        if (hasError) return HasError;
        return ContentLayout;
    }

    return (
        <section>
            <div className="section-body contain-lg">
                {alert ? <Alert text={alert.text} type={alert.type}/> : ""}
                <div className="card">
                    <div className="card-body">
                        <FilterComponent fields={filterFields} queryFilter={queryFilter} setQueryFilter={setQueryFilter}/>
                    </div>
                </div>
                <div className="card">
                    {DisplayContent()}
                </div>
            </div>
        </section>
    )
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<AppLayout content={Content}/>, wrapper) : null;