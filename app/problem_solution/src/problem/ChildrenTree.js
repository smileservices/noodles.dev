import React, {useState, useEffect, Fragment} from "react";
import ReactDom from "react-dom";
import apiList from "../../../src/api_interface/apiList";
import PaginatedLayout from "../../../src/components/PaginatedLayout";
import Alert from "../../../src/components/Alert";
import SolutionItem from "../solution/SolutionItem";

function SolutionChildrenApp() {
    const [solutions, setSolutions] = useState([]);
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
            PROBLEM_SOLUTIONS_ENDPOINT,
            pagination,
            setSolutions,
            setWaiting,
            err => setAlert(<Alert close={e => setAlert(null)} text={err} type="danger"/>)
        )
    }, [pagination, refresh])

    return (
        <Fragment>
            <h3>Solutions</h3>
            {waiting}
            {alert}
            <PaginatedLayout data={solutions.results} resultsCount={solutions.count} pagination={pagination}
                             setPagination={setPagination}
                             resultsContainerClass="tile-container"
                             mapFunction={
                                 (item, idx) => <SolutionItem key={"solution" + item.pk} data={item}/>
                             }
            />
        </Fragment>
    )
}

ReactDom.render(<SolutionChildrenApp />, document.getElementById('children'));