import React, {useState, useEffect, Fragment} from "react";
import ReactDOM from "react-dom";
import apiList from "../../src/api_interface/apiList";
import StarRating from "../../src/components/StarRating";
import ResourceRating from "../../study_resource/src/ResourceRating";
import PaginatedLayout from "../../src/components/PaginatedLayout";
import {FilterComponent} from "../../src/components/FilterComponent";

import {makeId, extractURLParams} from "../../src/components/utils";

import SearchBarComponent from "./SearchBarComponent";

function codeParamsToUrl(params, data) {
    data.map(f => {
        params.append(Object.keys(f)[0], Object.values(f)[0]);
    })
}

function decodeParamsFromUrl() {
    let filters = [];
    let sorting = [];
    let pagination = {};
    const paginationParamNames = ['resultsPerPage', 'current', 'offset'];
    const urlParams = new URLSearchParams(document.location.search);
    urlParams.delete('search');
    urlParams.delete('tab');
    sorting = urlParams.get('sort_by')
    urlParams.delete('sort_by');
    Array.from(urlParams, ([key, value]) => {
        const f = {};
        if (paginationParamNames.indexOf(key) > -1) {
            pagination[key] = Number(value);
        } else {
            let filter = {}
            filter[key] = value;
            filters.push(filter);
        }
    });
    return [filters, sorting, pagination]
}


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
        results: [],
        waiting: false,
        filters: [],
        sorting: [],
    };
    const defaultPagination = {
        resultsPerPage: 10,
        current: 1,
        offset: 0
    }

    const [searchbarState, setSearchbarState] = useState({
        placeholder: 'Search For Something Specific',
        q: urlParams.get('search') ? urlParams.get('search').split('+').join(' ') : '',
    });

    function initialTabState(tabname) {
        let state = JSON.parse(JSON.stringify(defaultTabState));
        let paginationState = JSON.parse(JSON.stringify(defaultPagination));
        if (tabname === defaultTab) {
            const [filters, sorting, pagination] = decodeParamsFromUrl();
            state.filters = filters;
            state.sorting = sorting;
            paginationState = {...paginationState, ...pagination}
        }
        return [state, paginationState];
    }

    const [initiaResources, initialResourcesPagination] = initialTabState('resources')
    const [initiaCollections, initialCollectionsPagination] = initialTabState('colections')
    const [initiaTechnologies, initialTechnologiesPagination] = initialTabState('technologies')

    const [currentTab, setCurrentTab] = useState(defaultTab);

    const [resources, setResources] = useState(initiaResources);
    const [resourcesResultsPagination, setResourcesResultsPagination] = useState(initialResourcesPagination);

    const [collections, setCollections] = useState(initiaCollections);
    const [collectionsResultsPagination, setCollectionsResultsPagination] = useState(initialCollectionsPagination);

    const [technologies, setTechnologies] = useState(initiaTechnologies);
    const [technologiesResultsPagination, setTechnologiesResultsPagination] = useState(initialTechnologiesPagination);


    function setSearch(term) {
        let params = new URLSearchParams(location.search);
        if (term !== '') {
            params.set('search', term);
        } else {
            params.delete('search');
        }

        history.pushState(null, 'Search', '?' + params.toString())
        setSearchbarState({
            ...searchbarState,
            q: term.split('+').join(' '),
            showSuggestions: false
        })
        searchInTab(term, currentTab);
        getOtherTabs(currentTab).map(
            tab => searchInTab(term, tab)
        );
    }

    function searchInTab(term, tab) {
        const url = '/search/api/' + tab + '?';
        let params = new URLSearchParams();
        if (term !== '') {
            params.set('search', term);
        }
        const [tabState, setTabState, pagination] = getTabState(tab);
        const paginationList = Object.keys(pagination).map(k => {
            let d = {};
            d[k] = pagination[k];
            return d
        });
        codeParamsToUrl(params, tabState.filters)
        codeParamsToUrl(params, paginationList)
        fetch(url + params.toString(), {
            method: 'GET',
        }).then(result => {
            if (result.ok) {
                return result.json();
            }
        }).then(data => {
            setTabState({...tabState, results: data});
        })
    }

    function getOtherTabs(tabname) {
        return ['resources', 'collections', 'technologies'].filter(i => i !== tabname);
    }

    function getTabState(tabname) {
        switch (tabname) {
            case 'resources':
                return [resources, setResources, resourcesResultsPagination, setResourcesResultsPagination]
            case 'collections':
                return [collections, setCollections, collectionsResultsPagination, setCollectionsResultsPagination]
            case 'technologies':
                return [technologies, setTechnologies, technologiesResultsPagination, setTechnologiesResultsPagination]
        }
    }

    useEffect(e => {
        searchInTab(searchbarState.q, currentTab);
        getOtherTabs(currentTab).map(
            tab => searchInTab(searchbarState.q, tab)
        );
    }, []);

    useEffect(e => {
        searchInTab(searchbarState.q, currentTab);
    }, [resourcesResultsPagination, collectionsResultsPagination, technologiesResultsPagination])

    function changeTab(tabname) {
        setCurrentTab(tabname);
        const [tabState, setTabState, pagination, setPagination] = getTabState(tabname);
        let params = new URLSearchParams();
        params.set('tab', tabname);
        if (searchbarState.q !== '') {
            params.set('search', searchbarState.q);
        }
        codeParamsToUrl(params, tabState.filters)
        history.pushState(null, 'Search for ' + tabname, '?' + params.toString())
    }

    function showCurrentTab(currentTab) {
        switch (currentTab) {
            case 'resources':
                return (
                    <div className="resources">
                        <h1>res</h1>
                        {resources.results.items ?
                            <PaginatedLayout
                                pagination={resourcesResultsPagination}
                                resultsCount={resources.results.stats.total}
                                data={resources.results.items}
                                resultsContainerClass="results"
                                setPagination={setResourcesResultsPagination}
                                mapFunction={(item, idx) => <p key={item.pk}>{item.name}</p>}
                            /> : ''}
                    </div>
                );
            case 'collections':
                return (
                    <div className="collections">
                        <h1>col</h1>
                        {collections.results.items ?
                            <PaginatedLayout
                                pagination={collectionsResultsPagination}
                                resultsCount={collections.results.stats.total}
                                data={collections.results.items}
                                resultsContainerClass="results"
                                setPagination={setCollectionsResultsPagination}
                                mapFunction={(item, idx) => <p key={item.pk}>{item.name}</p>}
                            /> : ''}
                    </div>
                );
            case 'technologies':
                return (
                    <div className="technologies">
                        <h1>tec</h1>
                        {technologies.results.items ?
                            <PaginatedLayout
                                pagination={technologiesResultsPagination}
                                resultsCount={technologies.results.stats.total}
                                data={technologies.results.items}
                                resultsContainerClass="results"
                                setPagination={setTechnologiesResultsPagination}
                                mapFunction={(item, idx) => <p key={item.pk}>{item.name}</p>}
                            /> : ''}
                    </div>
                );
        }
    }

    function getCounter(state) {
        if (state.waiting) return 'wait..';
        if (state.results.stats) {
            return state.results.stats.total;
        } else {
            return 'error';
        }
    }

    return (
        <div className="container">
            <div className="tab-select">
                <span onClick={e => changeTab('resources')}>Resources ({getCounter(resources)})</span>
                <span onClick={e => changeTab('collections')}>Collections ({getCounter(collections)})</span>
                <span onClick={e => changeTab('technologies')}>Technologies ({getCounter(technologies)})</span>
            </div>
            <SearchBarComponent search={setSearch} state={searchbarState}/>
            {showCurrentTab(currentTab)}
        </div>
    );
}

ReactDOM.render(<SearchApp/>, document.getElementById('search-app'));