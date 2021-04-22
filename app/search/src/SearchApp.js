import React, {useState, useEffect, useReducer, useCallback, Fragment} from "react";
import ReactDOM from "react-dom";

import SearchBarComponent from "./SearchBarComponent";
import StudyResourceSearchListing from "../../study_resource/src/StudyResourceSearchListing";
import CollectionSearchListing from "../../study_collection/src/CollectionSearchListing";
import TechnologySearchListing from "../../technology/src/TechnologySearchListing";
import RelatedComponent from "./RelatedComponent";
import TabComponent from "./TabComponent";

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

    function headerClass(tabname) {
        return tabname === state.currentTab ? 'active' : '';
    }

    function changeTab(tabname) {
        setState({...state, currentTab: tabname});
    }

    function getTabContent(state) {
        switch (state.currentTab) {
            case 'resources':
                return (<TabComponent
                    tabname="resources" searchTerm={state.q} title={'Resources Results'}
                    containerClass={'resources'} ListingComponent={StudyResourceSearchListing}/>)
            case 'collections':
                return (<TabComponent
                    tabname="collections" searchTerm={state.q} title={'Collections Results'}
                    containerClass={'collections'} ListingComponent={CollectionSearchListing}/>)
            case 'technologies':
                return (<TabComponent
                    tabname="technologies" searchTerm={state.q} title={'Technologies Results'}
                    containerClass={'technologies'} ListingComponent={TechnologySearchListing}/>)
            default:
                alert('current tab value not recognized:' + state.currentTab);
        }
    }

    return (
        <Fragment>
            <section className="tab-navigation search">
                <div className="tab-headers">
                    <h4 onClick={e => changeTab('resources')} className={headerClass('resources')}>Resources</h4>
                    <h4 onClick={e => changeTab('collections')} className={headerClass('collections')}>Collections</h4>
                    <h4 onClick={e => changeTab('technologies')}
                        className={headerClass('technologies')}>Technologies</h4>
                </div>
                <SearchBarComponent searchTerm={state.q} setSearchTerm={term => setState({...state, q: term})}
                                    placeholder="Search for something specific"/>
                {getTabContent(state)}
            </section>
            <section id="related" className="column-container">
                <RelatedComponent />
            </section>
        </Fragment>
    );
}

ReactDOM.render(<SearchApp/>, document.getElementById('search-app'));