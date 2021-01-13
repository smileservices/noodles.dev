import React, {useState, useEffect, Fragment} from "react";
import ReactDom from "react-dom";
import apiList from "../../../src/api_interface/apiList";
import PaginatedLayout from "../../../src/components/PaginatedLayout";
import Alert from "../../../src/components/Alert";
import ProblemItem from "../problem/ProblemItem";

function ProblemChildrenApp() {
    const [problems, setProblems] = useState([]);
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [refresh, setRefresh] = useState(false);

    const [pagination, setPagination] = useState({
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });

    window.refreshChildren = () => setRefresh(!refresh);

    useEffect(e => {
        apiList(
            SOLUTION_PROBLEMS_LIST,
            pagination,
            setProblems,
            setWaiting,
            err => setAlert(<Alert close={e=>setAlert(null)} text={err} type="danger"/>)
        )
    }, [pagination, refresh])

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

ReactDom.render(<ProblemChildrenApp/>, document.getElementById('children'));