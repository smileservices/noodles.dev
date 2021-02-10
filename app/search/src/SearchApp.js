import React, {useState, useEffect, Fragment} from "react";
import ReactDOM from "react-dom";
import apiList from "../../src/api_interface/apiList";
import {makeId, extractURLParams, whatType} from "../../src/components/utils";
import StarRating from "../../src/components/StarRating";
import ResourceRating from "../../study_resource/src/ResourceRating";
import PaginatedLayout from "../../src/components/PaginatedLayout";
import {FilterComponent} from "../../src/components/FilterComponent";

import SearchBarComponent from "./SearchBarComponent";
import StudyResourceSearchListing from "../../study_resource/src/StudyResourceSearchListing";
import CollectionSearchListing from "../../study_collection/src/CollectionSearchListing";

function codeParamsToUrl(params, data) {
    switch (whatType(data)) {
        case 'object':
            return Object.keys(data).map(name => params.append(name, data[name]));
        case 'array':
            return data.map(f => {
                params.append(Object.keys(f)[0], Object.values(f)[0]);
            })
    }
}

function updateUrl(params) {
    /*
    * params = {search: searchTerm, tab: tabName, filters: filters,...}
    * */
    let url = '/search/?';                   //the url root
    let paramsObj = new URLSearchParams();  // this is to be populated from scratch
    if (params['tab'] !== '') {
        paramsObj.set('tab', params['tab']);
        // process filters per tab only!
        if (Object.keys(params['filters']).length > 0) {
            codeParamsToUrl(paramsObj, params['filters'])
        }
    }
    if (params['search'] !== '') {
        paramsObj.set('search', params['search']);
    }
    history.pushState(null, 'Search', url + paramsObj.toString())
}

function decodeParamsFromUrl() {
    let filters = {};
    let sorting = '';
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
            filters[key] = value;
        }
    });
    return [filters, sorting, pagination]
}

function getAvailableFilters(aggregated, label, type) {
    if (!aggregated) return {};
    /*
    * filtername: string
    * aggregated: [{value: itemsCount}, ...]
    *
    * returns {label: string, type: string, options: [[value, text],...]}, ...}
    * */
    return {
        label: label,
        type: type,
        options: Object.keys(aggregated).map(value => [value, value + '(' + aggregated[value] + ')'])
    };
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
        availableFilters: {},
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
            paginationState = {...paginationState, ...pagination}
            return [state, paginationState, filters, sorting];
        }
        return [state, paginationState, {}, {}];
    }

    const [initialResources, initialResourcesPagination, resourcesFilterInitial, resourcesSortInitial] = initialTabState('resources')
    const [initialCollections, initialCollectionsPagination, collectionsFilterInitial, collectionsSortInitial] = initialTabState('colections')
    const [initialTechnologies, initialTechnologiesPagination, technologiesFilterInitial, technologiesSortInitial] = initialTabState('technologies')

    const [currentTab, setCurrentTab] = useState(defaultTab);

    const [resources, setResources] = useState(initialResources);
    const [resourcesResultsPagination, setResourcesResultsPagination] = useState(initialResourcesPagination);
    const [resourcesFilters, setResourcesFilters] = useState(resourcesFilterInitial);

    const [collections, setCollections] = useState(initialCollections);
    const [collectionsResultsPagination, setCollectionsResultsPagination] = useState(initialCollectionsPagination);
    const [collectionsFilters, setCollectionsFilters] = useState(collectionsFilterInitial);

    const [technologies, setTechnologies] = useState(initialTechnologies);
    const [technologiesResultsPagination, setTechnologiesResultsPagination] = useState(initialTechnologiesPagination);
    const [technologiesFilters, setTechnologiesFilters] = useState(technologiesFilterInitial);

    let firstRun = true;


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
        const [tabState, setTabState, pagination, setPagination, filters] = getTabState(tab);
        const paginationList = Object.keys(pagination).map(k => {
            let d = {};
            d[k] = pagination[k];
            return d
        });
        codeParamsToUrl(params, filters);
        codeParamsToUrl(params, paginationList);
        fetch(url + params.toString(), {
            method: 'GET',
        }).then(result => {
            if (result.ok) {
                return result.json();
            }
        }).then(data => {
            setTabState({...tabState, availableFilters: getTabFilters(tab, data.filters), results: data});
        })
    }

    function getOtherTabs(tabname) {
        return ['resources', 'collections', 'technologies'].filter(i => i !== tabname);
    }

    function getTabState(tabname) {
        switch (tabname) {
            case 'resources':
                return [resources, setResources, resourcesResultsPagination, setResourcesResultsPagination, resourcesFilters, setResourcesFilters]
            case 'collections':
                return [collections, setCollections, collectionsResultsPagination, setCollectionsResultsPagination, collectionsFilters, setCollectionsFilters]
            case 'technologies':
                return [technologies, setTechnologies, technologiesResultsPagination, setTechnologiesResultsPagination, technologiesFilters, setTechnologiesFilters]
        }
    }

    function getTabFilters(tabname, resultsFilters) {
        switch (tabname) {
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
                    'ecosystem': getAvailableFilters(resultsFilters['ecosystem'], 'Technology Ecosystem', 'simple-select'),
                    'category': getAvailableFilters(resultsFilters['category'], 'Category', 'simple-select'),
                }
        }
    }

    useEffect(e => {
        const [tab, setTabstate, pagination, setPagination, filters] = getTabState(currentTab);
        updateUrl({
           search: searchbarState.q,
           tab: currentTab,
           filters: filters
        });
        searchInTab(searchbarState.q, currentTab)
    }, [resourcesFilters, collectionsFilters, technologiesFilters])

    // useEffect(e => {
    //     searchInTab(searchbarState.q, 'collections')
    // }, [collectionsFilters,])
    //
    // useEffect(e => {
    //     searchInTab(searchbarState.q, 'technologies')
    // }, [technologiesFilters,])

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

    function factoryAddFilter(tab) {
        return (name, value) => {
            const [state, setState, pagination, setPagination, filters, setFilters] = getTabState(tab);
            let newFilters = {...filters};
            newFilters[name] = value;
            setFilters(newFilters);
        }
    }

    function showCurrentTab(currentTab) {
        switch (currentTab) {
            case 'resources':
                return (
                    <div className="resources">
                        <FilterComponent
                            key="resources-filters"
                            fields={resources.availableFilters}
                            queryFilter={resourcesFilters}
                            setQueryFilter={setResourcesFilters}
                        />
                        <h1>res</h1>
                        {resources.results.items ?
                            <PaginatedLayout
                                pagination={resourcesResultsPagination}
                                resultsCount={resources.results.stats.total}
                                data={resources.results.items}
                                resultsContainerClass="results"
                                setPagination={setResourcesResultsPagination}
                                mapFunction={(item, idx) => <StudyResourceSearchListing
                                    key={item.pk}
                                    data={item}
                                    addFilter={factoryAddFilter('resources')}
                                />}
                            /> : ''}
                    </div>
                );
            case 'collections':
                return (
                    <div className="collections">
                        <FilterComponent
                            key="collections-filters"
                            fields={collections.availableFilters}
                            queryFilter={collectionsFilters}
                            setQueryFilter={setCollectionsFilters}
                        />
                        <h1>col</h1>
                        {collections.results.items ?
                            <PaginatedLayout
                                pagination={collectionsResultsPagination}
                                resultsCount={collections.results.stats.total}
                                data={collections.results.items}
                                resultsContainerClass="results"
                                setPagination={setCollectionsResultsPagination}
                                mapFunction={(item, idx) => <CollectionSearchListing
                                    key={item.pk}
                                    data={item}
                                    addFilter={factoryAddFilter('collections')}
                                />}
                            /> : ''}
                    </div>
                );
            case 'technologies':
                return (
                    <div className="technologies">
                        <FilterComponent
                            key="technologies-filters"
                            fields={technologies.availableFilters}
                            queryFilter={technologiesFilters}
                            setQueryFilter={setTechnologiesFilters}
                        />
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