import React, {useState, useEffect, useReducer} from "react";
import ReactDOM from "react-dom";
import {SkeletonLoadingResults} from "../../src/components/skeleton/SkeletonLoadingResults";
import PaginatedLayout from "../../src/components/PaginatedLayout";
import ResourceHistoryListing from "./ResourceHistoryListing";


const FETCH_INIT = 'FETCH_INIT';
const SET_PAGINATION = 'SET_PAGINATION';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

const initialTabState = {
    pagination: {
        resultsPerPage: 3,
        current: 1,
        offset: 0 //this can be left 0 as we don't need it on the backend
    },
    results: [],
    waiting: true,
    errors: false,
}

const reducer = (state, {type, payload}) => {
    switch (type) {
        case FETCH_INIT:
            return {
                ...state,
                waiting: true
            }
        case SUCCESS:
            return {
                ...state,
                results: payload,
                waiting: false,
                errors: false
            }
        case ERROR:
            return {
                ...state,
                errors: payload
            }
        case SET_PAGINATION:
            return {
                ...state,
                pagination: payload
            }
        default:
            throw new Error(`Action type ${type} unknown`);
    }
}

const NoResultsElement = (
    <div className="no-results">
        <h2>There are no edits to this resource yet!</h2>
        <p>Be the first to improve it!</p>
    </div>
)

function ResourceHistoryApp() {
    const [state, dispatch] = useReducer(reducer, initialTabState)

    useEffect(e => {
        dispatch({type: FETCH_INIT});
        fetch(
            URLS.history +
            '?resultsPerPage=' + state.pagination.resultsPerPage +
            '&currentPage=' + state.pagination.current,
            {method: 'GET'})
            .then(result => {
                if (result.ok) {
                    return result.json();
                } else {
                    dispatch({
                        type: ERROR,
                        payload: ['Encountered an error while retrieving history: ' + result.statusText]
                    })
                }
            }).then(data => {
            dispatch({type: SUCCESS, payload: data})
        })
    }, [state.pagination]);

    if (state.waiting) return SkeletonLoadingResults;
    if (!state.results.items || state.results.items.length === 0) return NoResultsElement;
    if (state.errors) return (
        <div className="no-results">
            <h2>Encountered errors :(</h2>
            {state.errors.map(e => <p>e</p>)}
        </div>
    )
    return (
        <PaginatedLayout
            pagination={state.pagination}
            resultsCount={state.results.stats.total}
            data={state.results.items}
            resultsContainerClass="results"
            setPagination={pagination => {
                dispatch({type: SET_PAGINATION, payload: pagination});
            }}
            mapFunction={(item, idx) => <ResourceHistoryListing key={item.pk} data={item}/>}
        />
    )
}

ReactDOM.render(<ResourceHistoryApp/>, document.getElementById('resource-history-app'));