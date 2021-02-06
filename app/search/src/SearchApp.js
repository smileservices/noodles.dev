import React, {useState, useEffect, Fragment} from "react";
import ReactDOM from "react-dom";
import apiList from "../../src/api_interface/apiList";
import StarRating from "../../src/components/StarRating";
import ResourceRating from "../../study_resource/src/ResourceRating";
import {makeId, extractURLParams} from "../../src/components/utils";

import SearchBarComponent from "./SearchBarComponent";

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

    const urlParams = new URLSearchParams(document.location.search);

    const defaultTab = urlParams.get('tab') ? urlParams.get('tab') : 'resources';
    const defaultTabState = {
        filters: [],
        results: [],
        waiting: false
    };

    const [searchbarState, setSearchbarState] = useState({
        placeholder: 'Search For Resources',
        q: urlParams.get('search') ? urlParams.get('search').split('+').join(' ') : '',
    });

    const [currentTab, setCurrentTab] = useState(defaultTab);
    const [resources, setResources] = useState(defaultTabState);
    const [collections, setCollections] = useState(defaultTabState);
    const [technologies, setTechnologies] = useState(defaultTabState);

    function filtersFromUrl() {
        const urlParams = new URLSearchParams(document.location.search);
        urlParams.delete('search');
        urlParams.delete('tab');
        return Array.from(urlParams, ([key, value]) => {
            const f = {};
            f[key] = value;
            return f;
        });
    }

    function addFiltersToParams(params, filters) {
        filters.map(f => {
            params.append(Object.keys(f)[0], Object.values(f)[0]);
        })
    }

    function setSearch(term) {
        let params = new URLSearchParams(location.search);
        params.set('search', term);
        history.pushState(null, 'Search for ' + term, '?' + params.toString())
        setSearchbarState({
            ...searchbarState,
            q: term.split('+').join(' '),
            showSuggestions: false
        })
        search(term, getTabState(currentTab).filters);
    }

    function search(term, filters) {
        const url = '/search/api/' + currentTab + '?';
        let params = new URLSearchParams();
        if (term !== '') {
            params.set('search', term);
        }
        const [tabState, setTabState] = getTabState(currentTab);
        addFiltersToParams(params, filters)
        fetch(url + params.toString(), {
            method: 'GET',
        }).then(result => {
            if (result.ok) {
                return result.json();
            }
        }).then(data => {
            setTabState({...tabState, filters: filters, results: data});
        })
    }

    function getTabState(tabname) {
        switch (tabname) {
            case 'resources':
                return [resources, setResources]
            case 'collections':
                return [collections, setCollections]
            case 'technologies':
                return [technologies, setTechnologies]
        }
    }

    useEffect(e => {
        /*
        *   RUNS FIRST: get filters from url, initates search
        *
        * */
        // we parse the url and set the state: current tab, search term, filters
        const filters = filtersFromUrl();
        const [tabState, setTabState] = getTabState(currentTab);
        setTabState({...tabState, filters: filters});
        search(searchbarState.q, filters);
    }, []);

    function changeTab(tabname) {
        setCurrentTab(tabname);
        const [tabState, setTabState] = getTabState(tabname);
        let params = new URLSearchParams();
        params.set('tab', tabname);
        if (searchbarState.q !== '') {
            params.set('search', searchbarState.q);
        }
        addFiltersToParams(params, tabState.filters)
        history.pushState(null, 'Search for ' + tabname, '?' + params.toString())
    }

    function showCurrentTab(currentTab) {
        switch (currentTab) {
            case 'resources':
                return (
                    <div className="results resources">
                        <h1>res</h1>
                        {resources.results.items?.map(i => <p key={i.pk}>{i.name}</p>)}
                    </div>
                );
            case 'collections':
                return (
                    <div className="results resources">
                        <h1>col</h1>
                        {collections.results.items?.map(i => <p key={i.pk}>{i.name}</p>)}
                    </div>
                );
            case 'technologies':
                return (
                    <div className="results resources">
                        <h1>tec</h1>
                        {technologies.results.items?.map(i => <p key={i.pk}>{i.name}</p>)}
                    </div>
                );
        }
    }

    return (
        <div className="container">
            <div className="tab-select">
                <span onClick={e => changeTab('resources')}>Resources ({resources.results.stats?.total})</span>
                <span onClick={e => changeTab('collections')}>Collections ({collections.results.stats?.total})</span>
                <span onClick={e => changeTab('technologies')}>Technologies ({technologies.results.stats?.total})</span>
            </div>
            <SearchBarComponent search={setSearch} state={searchbarState}/>
            {showCurrentTab(currentTab)}
        </div>
    );
}

ReactDOM.render(<SearchApp/>, document.getElementById('search-app'));