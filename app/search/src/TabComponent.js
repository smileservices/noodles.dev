import React, {useState, useEffect, useReducer, useCallback, Fragment} from "react";
import PaginatedLayout from "../../src/components/PaginatedLayout";
import {FilterComponent} from "../../src/components/FilterComponent";

import {SkeletonLoadingResults} from "../../src/components/skeleton/SkeletonLoadingResults";
import {codeParamsToUrl, decodeParamsFromUrl, updateUrl, getAvailableFilters} from "../../src/components/utils";
import SortComponent from "./SortingComponent";

const NoResultsElement = (
    <div className="no-results">
        <h2>Too picky maybe?</h2>
        <p>Try to broaden your filters.</p>
    </div>
)

const CHANGE_TAB = 'CHANGE_TAB';
const SET_FILTER = 'SET_FILTER';
const SET_PAGINATION = 'SET_PAGINATION';
const SET_SEARCH = 'SET_SEARCH';
const SET_SORT = 'SET_SORT';
const FETCH_INIT = 'FETCH_INIT';
const SET_ERROR = 'SET_ERROR';
const SET_SUCCESS = 'SET_RESULTS';

const [init_filters, init_sort, init_pagination] = decodeParamsFromUrl();

const initialTabState = {
    tab: '',
    search: '',
    sort: init_sort,
    pagination: {
        resultsPerPage: 10,
        current: 1,
        offset: 0
    },
    results: [],
    waiting: true,
    errors: false,
    filters: init_filters,
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
            updateUrl('/search?', {
                tab: state.tab,
                search: state.search,
                filters: state.filters,
                sort: payload,
            });
            return {
                ...state,
                sort: payload,
                results: [],
                pagination: initialTabState.pagination,
            }
        case SET_SEARCH:
            updateUrl('/search?', {
                tab: state.tab,
                search: payload,
                filters: state.filters,
                sort: state.sort,
            });
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
            updateUrl('/search?', {
                tab: state.tab,
                search: state.search,
                filters: payload,
                sort: state.sort,
            });
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

function getTabFilters(tabname, resultsFilters) {
    // sets the available filters
    // used when populating filter component
    if (resultsFilters === undefined) return {};

    switch (tabname) {
        case 'categories':
            return {
                'parent': getAvailableFilters(resultsFilters['parent'], 'Parent', 'simple-select'),
            }
        case 'category_concepts':
            return {
                'category': getAvailableFilters(resultsFilters['parent'], 'Category', 'simple-select'),
                'parent': getAvailableFilters(resultsFilters['parent'], 'Parent', 'simple-select'),
                'experience_level': getAvailableFilters(resultsFilters['experience_level'], 'Experience Level', 'simple-select'),
            }
        case 'technology_concepts':
            return {
                'parent': getAvailableFilters(resultsFilters['parent'], 'Parent', 'simple-select'),
                'experience_level': getAvailableFilters(resultsFilters['experience_level'], 'Experience Level', 'simple-select'),
                'technology': getAvailableFilters(resultsFilters['technology'], 'Technology', 'simple-select'),
            }
        case 'resources':
            return {
                'tech_v': getAvailableFilters(resultsFilters['technologies'], 'Technologies', 'simple-select'),
                'tags': getAvailableFilters(resultsFilters['tags'], 'Tags', 'simple-select'),
                'price': getAvailableFilters(resultsFilters['price'], 'Price', 'simple-select'),
                'media': getAvailableFilters(resultsFilters['media'], 'Media', 'simple-select'),
                'experience_level': getAvailableFilters(resultsFilters['experience_level'], 'Experience Level', 'simple-select'),
                'category': getAvailableFilters(resultsFilters['category'], 'Category', 'simple-select'),
            }
        case 'collections':
            return {
                'technologies': getAvailableFilters(resultsFilters['technologies'], 'Technologies', 'simple-select'),
                'tags': getAvailableFilters(resultsFilters['tags'], 'Tags', 'simple-select'),
            }
        case 'technologies':
            return {
                'license': getAvailableFilters(resultsFilters['license'], 'License Type', 'simple-select'),
                'ecosystem': getAvailableFilters(resultsFilters['ecosystem'], 'Technology Ecosystem', 'simple-select'),
                'category': getAvailableFilters(resultsFilters['category'], 'Category', 'simple-select'),
            }
    }
}

export default function TabComponent({tabname, searchTerm, title, containerClass, ListingComponent, listType = 'list'}) {
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
        <FilterComponent
            key={"filters" + containerClass}
            fields={getTabFilters(tabname, state.results.filters)}
            queryFilter={state.filters}
            setQueryFilter={filter => {
                dispatch({type: SET_FILTER, payload: filter});
            }}
        />
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
                    resultsContainerClass={listType !== 'list' ? 'grid-results' : 'results'}
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