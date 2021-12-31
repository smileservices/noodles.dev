import React, {useState, useEffect, useReducer, useCallback, Fragment} from "react";
import ReactDOM from "react-dom";

import SearchBarComponentWithInstantResults from "./SearchBarComponent";
import CategorySearchListing from "../../category/src/CategorySearchListing";
import CategoryConceptSearchListing from "../../concepts/src/category/CategoryConceptSearchListing";
import TechnologyConceptSearchListing from "../../concepts/src/technology/TechnologyConceptSearchListing";
import StudyResourceSearchListing from "../../study_resource/src/StudyResourceSearchListing";
import CollectionSearchListing from "../../study_collection/src/CollectionSearchListing";
import TechnologySearchListing from "../../technology/src/TechnologySearchListing";
import RelatedComponent from "./RelatedComponent";
import TabComponent from "./TabComponent";
import {updateUrl} from "../../src/components/utils";

const urlParams = new URLSearchParams(document.location.search);

function SearchApp() {

    /*
    *   Open url:
    *       . url  : /search?tab=resources&q={search term}&tech_v=python|gte:2&tag=python
    *       . apply filters (if exist) and initiate search for the selected tab & open it
    *       . initiate search with default filters for the other tabs - collections, technologies
    *
    *   Modify search term
    *       . search is initiated for all tabs
    *       . selected filters apply
    *
    *   Save state into the url
    *       . query, filters are saved in url as GET params
    *       . syntax is compatible with apiList component and with django-rest filters
    *       . have index name, pagination, search term, filters
    * */

    const [state, setState] = useState({
        q: urlParams.get('search') ? urlParams.get('search') : '',
        currentTab: urlParams.get('tab') ? urlParams.get('tab') : 'resources',
    })
    const getTabContent = tabName => {
        switch (tabName) {
            // case 'categories':
            //     return (<TabComponent
            //         tabname="categories" searchTerm={state.q} title={'Categories Results'}
            //         containerClass={'categories'} ListingComponent={CategorySearchListing} listType="grid"/>)
            case 'category_concepts':
                return (<TabComponent
                    tabname="category_concepts" searchTerm={state.q} title={'Theoretical Concepts Results'}
                    containerClass={'category_concepts'} ListingComponent={CategoryConceptSearchListing} listType="grid"/>)
            case 'technology_concepts':
                return (<TabComponent
                    tabname="technology_concepts" searchTerm={state.q} title={'Implementation Concepts Results'}
                    containerClass={'technology_concepts'} ListingComponent={TechnologyConceptSearchListing} listType="grid"/>)
            case 'resources':
                return (<TabComponent
                    tabname="resources" searchTerm={state.q} title={'Resources Results'}
                    containerClass={'resources'} ListingComponent={StudyResourceSearchListing} listType="list"/>)
            case 'collections':
                return (<TabComponent
                    tabname="collections" searchTerm={state.q} title={'Collections Results'}
                    containerClass={'collections'} ListingComponent={CollectionSearchListing} listType="grid"/>)
            case 'technologies':
                return (<TabComponent
                    tabname="technologies" searchTerm={state.q} title={'Technologies Results'}
                    containerClass={'technologies'} ListingComponent={TechnologySearchListing} listType="grid"/>)
            default:
                alert('current tab value not recognized:' + tabName);
        }
    }

    function headerClass(tabname) {
        return tabname === state.currentTab ? 'active' : '';
    }

    function changeTab(tabname) {
        updateUrl('/search?', {
            tab: tabname,
        });
        setState({...state, currentTab: tabname});
    }


    return (
        <Fragment>
            <section className="tab-navigation search">
                <div className="tab-headers">
                    <h4 onClick={e => changeTab('resources')} className={headerClass('resources')}>Resources</h4>
                    {/*<h4 onClick={e => changeTab('categories')} className={headerClass('categories')}>Categories</h4>*/}
                    <h4 onClick={e => changeTab('category_concepts')} className={headerClass('category_concepts')}>Theory Concepts</h4>
                    <h4 onClick={e => changeTab('technologies')} className={headerClass('technologies')}>Technologies</h4>
                    <h4 onClick={e => changeTab('technology_concepts')} className={headerClass('technology_concepts')}>Implementation Concepts</h4>
                    <h4 onClick={e => changeTab('collections')} className={headerClass('collections')}>Collections</h4>
                </div>
                <SearchBarComponentWithInstantResults searchTerm={state.q} setSearchTerm={term => setState({...state, q: term})}
                                                      placeholder="Search for something specific"/>
                {getTabContent(state.currentTab)}
            </section>
        </Fragment>
    );
}

ReactDOM.render(<SearchApp/>, document.getElementById('search-app'));