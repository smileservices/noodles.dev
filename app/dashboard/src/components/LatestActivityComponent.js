import React, {useState, useEffect, Fragment} from 'react';
import Alert from "../../../src/components/Alert";
import Waiting from "../../../src/components/Waiting";
import {makeId} from "../../../src/components/utils";
import PaginatedLayout from "../../../src/components/PaginatedLayout";
import apiList from "../../../src/api_interface/apiList";


export const ProcessLogObject = (log_data) => {
    if (typeof log_data === "string") return (<div className="single-line">{log_data}</div>);
    return Object.keys(log_data).map(key =>
        (<div className="field" key={makeId(3)}>
            <span className={"key " + key}>{key}</span>
            <span className={"value " + key}>{log_data[key]}</span>
        </div>)
    )
}

export const ProcessActivityLogLine = ({line}) => {
    return (<div className="log-line">{line}</div>);
}

export const ProcessActivityLog = (content) => {
    let processed = content.split('\n');
    return processed.filter(line => line).reverse();
}


export default function LatestActivityComponent() {
    const [state, setState] = useState({
        page: 1,
        data: {},
        loading: true,
        error: false,
        pagination: {
            resultsPerPage: 5,
            current: 1,
            offset: 0
        }
    });

    function handleSetData(data) {
        const processedData = (() => {
            if (data.items) return ProcessActivityLog(data.items);
            if (data.error) return [data.error];
        })();
        const data_obj = {
            items: processedData,
            total: data.total
        }
        setState({...state, data: data_obj, loading: false, error: false})
    }

    useEffect(() => {
        apiList(
            LATEST_ACTIVITY_ENDPOINT,
            state.pagination,
            handleSetData,
            (loading) => setState({...state, loading: loading, error: false}),
            (err) => setState({...state, error: err, loading: false})
        )
    }, [state.page, state.pagination])

    if (state.error) return <Alert text={state.error}/>;
    if (state.loading) return <Waiting text="Retrieving Activity Log"/>;

    return (<div className="activity-log">
        <h2>Activity Log</h2>
        <PaginatedLayout
            pagination={state.pagination}
            resultsCount={state.data.total}
            data={state.data.items}
            resultsContainerClass="results"
            setPagination={pagination => {
                setState({...state, pagination: pagination});
            }}
            mapFunction={(item, idx) => <ProcessActivityLogLine key={makeId(3)} line={item} />}
        />
    </div>)
}