import React, {useState, useEffect, useReducer, Fragment} from "react";
import ReactDOM from "react-dom";
import SearchBarComponent from "./SearchBarComponent";
import CategorySearchListing from "../../category/src/CategorySearchListing";
import CategoryConceptSearchListing from "../../concepts/src/category/CategoryConceptSearchListing";
import TechnologyConceptSearchListing from "../../concepts/src/technology/TechnologyConceptSearchListing";
import StudyResourceSearchListing from "../../study_resource/src/StudyResourceSearchListing";
import CollectionSearchListing from "../../study_collection/src/CollectionSearchListing";
import TechnologySearchListing from "../../technology/src/TechnologySearchListing";
import TabComponentNoUrlUpdate from "./TabComponentNoUrlUpdate";

import useDebounce from '../../frontend/src/hooks/useDebounce';

const OPEN = 'OPEN';
const CLOSE = 'CLOSE';
const WAIT = 'WAIT';
const SET_QUERY = 'SET_QUERY';
const CHANGE_TAB = 'CHANGE_TAB';

const FETCH_AUTOCOMPLETE_RESULTS_API = '/search/api/autocomplete';

const initialState = {
    open: true,
    wait: false,
    query: {term: ''},
    currentTab: 'categories'
}

const reducer = (state, {type, payload}) => {
    switch (type) {
        case OPEN:
            return {
                ...initialState,
                open: true,
            }
        case CLOSE:
            return {
                ...state,
                open: false,
            }
        case WAIT:
            return {
                ...state,
                wait: true,
            }
        case SET_QUERY:
            return {
                ...state,
                query: payload,
            }
        case CHANGE_TAB:
            return {
                ...state,
                currentTab: payload,
            }
    }
}

function NavbarSearchApp() {
    const [state, dispatch] = useReducer(reducer, {...initialState});
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 1000);
    const controller = new AbortController();

    const handleSearch = event => {
        const { value } = event.target;
        if (value !== "") {
            setLoading(true);
            setQuery(value);
        }
    }

    useEffect(() => {
        const getResults = () => {
            fetch(`${FETCH_AUTOCOMPLETE_RESULTS_API}/${query}/`, {
                signal: controller.signal,
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error in fetching results');
                }
            }).then(data => {
                setLoading(false);
                console.log(data);
            }).catch(error => {
                setLoading(false);
                console.log(error);
            })
        }

        if (debouncedQuery) {
            getResults(debouncedQuery);
          }
    }, [debouncedQuery]);

    const getTabContent = tabName => {
        switch (tabName) {
            case 'categories':
                return (<TabComponentNoUrlUpdate
                    tabname="categories" searchTerm={state.query.term} title={'Categories Results'}
                    containerClass={'categories'} ListingComponent={CategorySearchListing}/>)
            case 'category_concepts':
                return (<TabComponentNoUrlUpdate
                    tabname="category_concepts" searchTerm={state.query.term} title={'Theoretical Concepts Results'}
                    containerClass={'category_concepts'} ListingComponent={CategoryConceptSearchListing}/>)
            case 'technology_concepts':
                return (<TabComponentNoUrlUpdate
                    tabname="technology_concepts" searchTerm={state.query.term}
                    title={'Implementation Concepts Results'}
                    containerClass={'technology_concepts'} ListingComponent={TechnologyConceptSearchListing}/>)
            case 'resources':
                return (<TabComponentNoUrlUpdate
                    tabname="resources" searchTerm={state.query.term} title={'Resources Results'}
                    containerClass={'resources'} ListingComponent={StudyResourceSearchListing}/>)
            case 'collections':
                return (<TabComponentNoUrlUpdate
                    tabname="collections" searchTerm={state.query.term} title={'Collections Results'}
                    containerClass={'collections'} ListingComponent={CollectionSearchListing}/>)
            case 'technologies':
                return (<TabComponentNoUrlUpdate
                    tabname="technologies" searchTerm={state.query.term} title={'Technologies Results'}
                    containerClass={'technologies'} ListingComponent={TechnologySearchListing}/>)
            default:
                alert('current tab value not recognized:' + tabName);
        }
    }

    function headerClass(tabname) {
        return tabname === state.currentTab ? 'active' : '';
    }

    function changeTab(tabname) {
        dispatch({type: CHANGE_TAB, payload: tabname});
    }

    if (state.open) {
        return (
            <div className="search-app-overlay">
                <div className="close-search" onClick={e => dispatch({type: CLOSE})}>
                        <p>CLOSE SEARCH</p>
                        <span className="icon-exit"></span>
                </div>
                <section className="tab-navigation search">
                    <SearchBarComponent placeholder="Search for anything..."
                                        searchTerm={state.query.term}
                                        setSearchTerm={term => dispatch({type: SET_QUERY, payload: {term: term}})}
                    />
                    <div className="tab-headers">
                        <h4 onClick={e => changeTab('categories')}
                            className={headerClass('categories')}>Categories</h4>
                        <h4 onClick={e => changeTab('category_concepts')}
                            className={headerClass('category_concepts')}>Theory Concepts</h4>
                        <h4 onClick={e => changeTab('technology_concepts')}
                            className={headerClass('technology_concepts')}>Implementation Concepts</h4>
                        <h4 onClick={e => changeTab('technologies')}
                            className={headerClass('technologies')}>Technologies</h4>
                        <h4 onClick={e => changeTab('resources')}
                            className={headerClass('resources')}>Resources</h4>
                        <h4 onClick={e => changeTab('collections')}
                            className={headerClass('collections')}>Collections</h4>
                    </div>
                    {getTabContent(state.currentTab)}
                </section>
            </div>
        )
    }

    return (
        <Fragment>
            <div className="navbar-input-container">
                <input type="text"
                    placeholder="Search for anything..."
                    className="navbar-search-input"
                    // onClick={e => dispatch({type: OPEN})}
                    onChange={handleSearch}
                />
                <span className="icon-search"></span>
            </div>
        </Fragment>
    )
}

ReactDOM.render(<NavbarSearchApp/>, document.getElementById('search-bar-app'));