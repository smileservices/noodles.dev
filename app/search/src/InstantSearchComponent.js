import React, {useEffect, useReducer, Fragment, useRef} from "react";
import {WaitingInline} from "../../src/components/Waiting";

const FETCH_AUTOCOMPLETE_RESULTS_API = '/search/api/autocomplete';

const EMPTY = 'EMPTY';
const WAIT = 'WAIT';
const SET_QUERY = 'SET_QUERY';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';
const HIDE_RESULTS = 'HIDE_RESULTS';

const initialState = {
    overlay: false,
    wait: false,
    error: false,
    query: {term: ''},
    results: []
}

const reducer = (state, {type, payload}) => {
    switch (type) {
        case EMPTY:
            return {
                ...initialState,
                overlay: false,
            }
        case SET_QUERY:
            return {
                ...state,
                query: {term: payload},
                overlay: false,
            }
        case WAIT:
            return {
                ...state,
                wait: true,
                overlay: false
            }
        case SUCCESS:
            let message = 'SEARCH RESULTS';
            if (payload.length === 0) {
                message = 'No Instant Results. Click the search icon.';
            }
            return {
                ...state,
                wait: false,
                error: false,
                overlay: {
                    message: message,
                    results: payload
                },
            }
        case ERROR:
            return {
                ...state,
                wait: false,
                overlay: {
                    message: payload,
                    results: []
                },
            }
        case HIDE_RESULTS:
            return {
                ...state,
                wait: false,
                overlay: false,
            }
    }
}


export default function InstantSearchComponent({setSearchTerm}) {
    const [state, dispatch] = useReducer(reducer, {...initialState});
    const controller = new AbortController();
    const wrapperRef = useRef(null);

    (function (ref) {
        useEffect(() => {
            /**
             * Close instant search overlay when click outside
             */
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    const instantResultsOverlayVisible = document.querySelector('.navbar-search-results-overlay');
                    if (instantResultsOverlayVisible) {
                        dispatch({type: HIDE_RESULTS})
                    }
                }
            }

            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref])
    })(wrapperRef);

    const getResults = (query_term) => {
        fetch(`${FETCH_AUTOCOMPLETE_RESULTS_API}/${query_term}/`, {
            signal: controller.signal,
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error in fetching results');
            }
        }).then(data => {
            dispatch({type: SUCCESS, payload: data.items})
        }).catch(error => {
            dispatch({type: ERROR, payload: error})
        })
    }

    useEffect(() => {
        if (state.query.term.length > 3) {
            getResults(state.query.term);
        }
    }, [state.query.term]);

    return (
        <Fragment>
            <form onSubmit={e => {
                e.preventDefault();
                setSearchTerm(state.query.term);
            }}>
                <div className="navbar-input-container">

                    <input type="text"
                           placeholder="Search for a topic or technology"
                           className="navbar-search-input"
                           onChange={event => {
                               dispatch({type: SET_QUERY, payload: event.target.value})
                           }}
                    />
                    {state.wait ? <span className="search-overlay"><WaitingInline/></span> : ''}
                    <span className="icon-search" onClick={e => setSearchTerm(state.query.term)}> </span>
                </div>
            </form>

            {state.overlay ?
                <div className="navbar-search-results-overlay" ref={wrapperRef}>
                    <div className="message">
                        {state.overlay.message}
                    </div>
                    {state.overlay.results.length > 0 ?
                        <div className="small-results">
                            {state.overlay.results.map(r => <a key={r.url} href={r.url}>{r.name}</a>)}
                        </div>
                        : ''}
                </div>
                : ''}
        </Fragment>
    )
}