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

const OPEN = 'OPEN';
const CLOSE = 'CLOSE';
const WAIT = 'WAIT';
const SET_QUERY = 'SET_QUERY';
const CHANGE_TAB = 'CHANGE_TAB';

const initialState = {
    open: false,
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
                <div className="toolbar">
                    <span className="icon-close" onClick={e => dispatch({type: CLOSE})}/>
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
                    onClick={e => dispatch({type: OPEN})}
                />
                <span className="icon-search"></span>
            </div>
        </Fragment>
    )
}

ReactDOM.render(<NavbarSearchApp/>, document.getElementById('search-bar-app'));