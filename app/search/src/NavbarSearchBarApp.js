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
import InstantSearchComponent from "./InstantSearchComponent";

const CLOSE = 'CLOSE';
const SET_QUERY = 'SET_QUERY';
const CHANGE_TAB = 'CHANGE_TAB';

const initialState = {
    open: false,
    query: false,
    currentTab: 'resources'
}

const reducer = (state, {type, payload}) => {
    switch (type) {
        case CLOSE:
            return {
                ...state,
                open: false,
            }
        case SET_QUERY:
            return {
                ...state,
                open: true,
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
    /*
    * Shows a search bar
    * When user types something inside the search bar, the instant search results dropdown opens and queries for the incomplete query.
    * If the user hits enter or clicks the search icon, the search app opens up as an overlay
    *
    * */

    const [state, dispatch] = useReducer(reducer, {...initialState});

    const getTabContent = tabName => {
        if (!state.query.term) {
            return (
                <div className="no-results">
                    <img src="/static/imgs/img_empty.png"/>
                    <h2>Please set a search term and then press enter</h2>
                    <h2>What are you looking for?</h2>
                </div>
            )
        }
        switch (tabName) {
            case 'categories':
                return (<TabComponentNoUrlUpdate
                    tabname="categories" searchTerm={state.query.term} title={'Categories Results'} listType="grid"
                    containerClass={'categories'} ListingComponent={CategorySearchListing}/>)
            case 'category_concepts':
                return (<TabComponentNoUrlUpdate
                    tabname="category_concepts" searchTerm={state.query.term} title={'Theoretical Concepts Results'}
                    listType="grid"
                    containerClass={'category_concepts'} ListingComponent={CategoryConceptSearchListing}/>)
            case 'technology_concepts':
                return (<TabComponentNoUrlUpdate
                    tabname="technology_concepts" searchTerm={state.query.term}
                    title={'Implementation Concepts Results'} listType="grid"
                    containerClass={'technology_concepts'} ListingComponent={TechnologyConceptSearchListing}/>)
            case 'resources':
                return (<TabComponentNoUrlUpdate
                    tabname="resources" searchTerm={state.query.term} title={'Resources Results'}
                    containerClass={'resources'} ListingComponent={StudyResourceSearchListing}/>)
            case 'collections':
                return (<TabComponentNoUrlUpdate
                    tabname="collections" searchTerm={state.query.term} title={'Collections Results'} listType="grid"
                    containerClass={'collections'} ListingComponent={CollectionSearchListing}/>)
            case 'technologies':
                return (<TabComponentNoUrlUpdate
                    tabname="technologies" searchTerm={state.query.term} title={'Technologies Results'} listType="grid"
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
            <div className="search-page search-app-overlay">
                <div className="top-menu">
                    <div>
                        <a href="/search">Open Search Page <span className="icon-search"/></a>
                    </div>
                    <div onClick={e => dispatch({type: CLOSE})}>
                        <a href="#" onClick={e=>e.preventDefault()}>Close Search <span className="icon-close"/> </a>
                    </div>
                </div>
                <section className="tab-navigation search">
                    <SearchBarComponent placeholder="Search for anything and press Enter..."
                                        searchTerm={state.query.term}
                                        setSearchTerm={term => dispatch({type: SET_QUERY, payload: {term: term}})}
                    />
                    <div className="tab-headers">
                        <h4 onClick={e => changeTab('resources')}
                            className={headerClass('resources')}>Resources</h4>
                        <h4 onClick={e => changeTab('category_concepts')}
                            className={headerClass('category_concepts')}>Theory Concepts</h4>
                        <h4 onClick={e => changeTab('technologies')}
                            className={headerClass('technologies')}>Technologies</h4>
                        <h4 onClick={e => changeTab('technology_concepts')}
                            className={headerClass('technology_concepts')}>Implementation Concepts</h4>
                        <h4 onClick={e => changeTab('collections')}
                            className={headerClass('collections')}>Collections</h4>
                        <h4 onClick={e => changeTab('categories')}
                            className={headerClass('categories')}>Categories</h4>
                    </div>
                    {getTabContent(state.currentTab)}
                </section>
            </div>
        )
    }

    return (<InstantSearchComponent setSearchTerm={term => dispatch({type: SET_QUERY, payload: {term: term}})}/>)
}

ReactDOM.render(<NavbarSearchApp/>, document.getElementById('search-bar-app'));