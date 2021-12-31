import React, {useState, useEffect, useReducer, useCallback, Fragment} from "react";
import PaginatedLayout from "../../src/components/PaginatedLayout";
import {FilterComponent} from "../../src/components/FilterComponent";

import {SkeletonLoadingResults} from "../../src/components/skeleton/SkeletonLoadingResults";
import {codeParamsToUrl, getAvailableFilters} from "../../src/components/utils";
import SortComponent from "./SortingComponent";

const NoResultsElement = (
    <div className="no-results">
        <img src="/static/imgs/img_empty.png" />
        <h2>Sorry, we can't find</h2>
        <h2>what you're looking for</h2>
    </div>
)

const SET_FILTER = 'SET_FILTER';
const SET_PAGINATION = 'SET_PAGINATION';
const SET_SEARCH = 'SET_SEARCH';
const SET_SORT = 'SET_SORT';
const FETCH_INIT = 'FETCH_INIT';
const SET_ERROR = 'SET_ERROR';
const SET_SUCCESS = 'SET_RESULTS';

const initialTabState = {
    tab: '',
    search: '',
    sort: '',
    pagination: {
        resultsPerPage: 10,
        current: 1,
        offset: 0
    },
    results: [],
    waiting: true,
    errors: false,
    filters: [],
}

const tabStateReducer = (state, {type, payload}) => {
    switch (type) {
        case SET_PAGINATION:
            return {
                ...state,
                results: [],
                pagination: payload,
            }
        case SET_SORT:
            return {
                ...state,
                sort: payload,
                results: [],
                pagination: initialTabState.pagination,
            }
        case SET_SEARCH:
            return {
                ...state,
                results: [],
                search: payload,
                pagination: initialTabState.pagination,
            }
        case FETCH_INIT:
            if (state.tab !== payload.tab) {
                return {
                    ...state,
                    tab: payload.tab,
                    results: [],
                    waiting: true,
                    errors: false,
                    filters: {},
                    sort: 'default',
                    pagination: initialTabState.pagination
                }
            } else {
                return {
                    ...state,
                    results: [],
                    waiting: true,
                    errors: false,
                }
            }
        case SET_FILTER:
            return {
                ...state,
                results: [],
                filters: payload,
                pagination: initialTabState.pagination,
            }
        case SET_ERROR:
            return {
                ...state,
                waiting: false,
                errors: payload
            }
        case SET_SUCCESS:
            return {
                ...state,
                results: payload,
                waiting: false,
                errors: false
            }
        default:
            throw new Error(`Action type ${type} unknown`);
    }
}

export default function TabComponentNoUrlUpdate({tabname, searchTerm, title, containerClass, ListingComponent, listType = 'list'}) {
    const [state, dispatch] = useReducer(tabStateReducer, {...initialTabState, tab: tabname, search: searchTerm});
    useEffect(() => dispatch({type: SET_SEARCH, payload: searchTerm}), [searchTerm]);

    useEffect(() => {
        dispatch({type: FETCH_INIT, payload: {tab: tabname}});
        if (tabname !== state.tab) {
            return () => {
            };
        }
        const url = '/search/api/' + tabname + '?';
        let params = new URLSearchParams();
        const paginationList = Object.keys(state.pagination).map(k => {
            let d = {};
            d[k] = state.pagination[k];
            return d
        });
        if (state.search) {
            params.set('search', state.search);
        }
        codeParamsToUrl(params, state.filters);
        codeParamsToUrl(params, paginationList);
        if (state.sort) {
            codeParamsToUrl(params, {'sort': state.sort});
        }
        fetch(url + params.toString(), {
            method: 'GET',
        }).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                dispatch({type: SET_ERROR, payload: ['Could not retrieve results']});
            }
        }).then(data => {
            dispatch({type: SET_SUCCESS, payload: data});
        })
    }, [tabname, state.search, state.filters, state.pagination, state.sort]);

    if (state.waiting || tabname !== state.tab) return SkeletonLoadingResults;
    if (state.errors) return (
        <div className="no-results">
            <h2>Encountered errors :(</h2>
            {state.errors.map(e => <p>e</p>)}
        </div>
    )
    return (<div className={containerClass}>
        {state.results.items?.length > 0 ?
            <Fragment>
                <div className="has-sort">
                    <h4>{title} (<span className="aggregation">{state.results.stats.total}</span>):</h4>
                    <SortComponent
                        sort={state.sort}
                        sortOptions={state.results.sort}
                        callback={sort => {
                            dispatch({type: SET_SORT, payload: sort});
                        }}
                    />
                </div>
                <PaginatedLayout
                    pagination={state.pagination}
                    resultsCount={state.results.stats.total}
                    data={state.results.items}
                    resultsContainerClass={listType === 'list' ? 'results' : 'grid-results'}
                    setPagination={pagination => {
                        dispatch({type: SET_PAGINATION, payload: pagination});
                    }}
                    mapFunction={(item, idx) => <ListingComponent
                        key={item.pk}
                        data={item}
                        addFilter={(field, value) => {
                            const newFilters = {};
                            newFilters[field] = value;
                            dispatch({type: SET_FILTER, payload: newFilters});
                        }}
                    />}
                />
            </Fragment>
            : NoResultsElement}
    </div>)
}