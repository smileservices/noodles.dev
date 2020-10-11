import React, {useState, useEffect, Fragment} from "react";
import ReactDom from "react-dom";
import apiList from "../../../src/api_interface/apiList";
import PaginatedLayout from "../../../src/components/PaginatedLayout";
import Alert from "../../../src/components/Alert";
import ProblemItem from "../problem/ProblemItem";

function Content() {
    const [problems, setProblems] = useState([]);
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');

    const [pagination, setPagination] = useState({
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });

    useEffect(e => {
        apiList(
            SOLUTION_PROBLEMS_ENDPOINT,
            pagination,
            setProblems,
            setWaiting,
            err => setAlert(<Alert close={e=>setAlert(null)} text={err} type="danger"/>)
        )
    }, [pagination])

    return (
        <Fragment>
            <h3>Problems</h3>
            {waiting}
            {alert}
            <PaginatedLayout data={problems.results} resultsCount={problems.count} pagination={pagination}
                             setPagination={setPagination}
                             resultsContainerClass="tile-container"
                             mapFunction={
                                 (item, idx) => <ProblemItem key={"problem"+item.pk} data={item}/>
                             }
            />
        </Fragment>
    )
}

ReactDom.render(<Content/>, document.getElementById('children'));