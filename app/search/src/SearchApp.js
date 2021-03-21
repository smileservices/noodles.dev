import React, {useState, useEffect, Fragment} from "react";
import ReactDOM from "react-dom";
import PaginatedLayout from "../../src/components/PaginatedLayout";
import {FilterComponent} from "../../src/components/FilterComponent";

import SearchBarComponent from "./SearchBarComponent";
import StudyResourceSearchListing from "../../study_resource/src/StudyResourceSearchListing";
import CollectionSearchListing from "../../study_collection/src/CollectionSearchListing";
import TechnologySearchListing from "../../technology/src/TechnologySearchListing";
import RelatedComponent from "./RelatedComponent";
import {SkeletonLoadingResults} from "../../src/components/skeleton/SkeletonLoadingResults";
import {codeParamsToUrl, decodeParamsFromUrl, updateUrl, getAvailableFilters} from "../../src/components/utils";


const NoResultsElement = (
    <div className="no-results">
        <h2>Too picky maybe?</h2>
        <p>Try to broaden your filters.</p>
    </div>
)

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
        waiting: true,
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
        setTabState({...tabState, waiting: true});
        codeParamsToUrl(params, filters);
        codeParamsToUrl(params, paginationList);
        fetch(url + params.toString(), {
            method: 'GET',
        }).then(result => {
            if (result.ok) {
                return result.json();
            }
        }).then(data => {
            setTabState({...tabState, availableFilters: getTabFilters(tab, data.filters), waiting:false, results: data});
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
        // sets the available filters
        // used when populating filter component
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
        searchInTab(searchbarState.q, currentTab);
    }, [resourcesResultsPagination, collectionsResultsPagination, technologiesResultsPagination])

    useEffect(e => {
        const [tab, setTabstate, pagination, setPagination, filters] = getTabState(currentTab);
        updateUrl('/search/?', {
            search: searchbarState.q,
            tab: currentTab,
            filters: filters
        });
        searchInTab(searchbarState.q, currentTab)
    }, [resourcesFilters, collectionsFilters, technologiesFilters])

    useEffect(e => {
        searchInTab(searchbarState.q, currentTab);
        getOtherTabs(currentTab).map(
            tab => searchInTab(searchbarState.q, tab)
        );
    }, []);


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
        // created the addFilter function used by
        // clickable tags/technologies
        return (name, value) => {
            const [state, setState, pagination, setPagination, filters, setFilters] = getTabState(tab);
            let newFilters = {...filters};
            setCurrentTab(tab);
            newFilters[name] = value;
            setFilters(newFilters);
        }
    }

    function showCurrentTab(currentTab) {
        switch (currentTab) {
            case 'resources':
                if (resources.waiting) return SkeletonLoadingResults;
                return (
                    <div className="resources">
                        <FilterComponent
                            key="resources-filters"
                            fields={resources.availableFilters}
                            queryFilter={resourcesFilters}
                            setQueryFilter={filter => {
                                setResourcesResultsPagination(defaultPagination);
                                setResourcesFilters(filter)
                            }}
                        />
                        {resources.results.items?.length > 0 ?
                            <Fragment>
                                <h4>Resources Results</h4>
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
                                />
                            </Fragment>
                            : NoResultsElement}
                    </div>
                );
            case 'collections':
                if (collections.waiting) return SkeletonLoadingResults;
                return (
                    <div className="collections">
                        <FilterComponent
                            key="collections-filters"
                            fields={collections.availableFilters}
                            queryFilter={collectionsFilters}
                            setQueryFilter={filter => {
                                setCollectionsResultsPagination(defaultPagination);
                                setCollectionsFilters(filter)
                            }}
                        />
                        {collections.results.items?.length > 0 ?
                            <Fragment>
                                <h4>Collections Results</h4>
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
                                />
                            </Fragment>
                            : NoResultsElement}
                    </div>
                );
            case 'technologies':
                if (technologies.waiting) return SkeletonLoadingResults;
                return (
                    <div className="technologies">
                        <FilterComponent
                            key="technologies-filters"
                            fields={technologies.availableFilters}
                            queryFilter={technologiesFilters}
                            setQueryFilter={filter => {
                                setTechnologiesResultsPagination(defaultPagination);
                                setTechnologiesFilters(filter)
                            }}
                        />
                        {technologies.results.items?.length > 0 ?
                            <Fragment>
                                <h4>Technologies Results</h4>
                                <PaginatedLayout
                                    pagination={technologiesResultsPagination}
                                    resultsCount={technologies.results.stats.total}
                                    data={technologies.results.items}
                                    resultsContainerClass="results"
                                    setPagination={setTechnologiesResultsPagination}
                                    mapFunction={(item, idx) => <TechnologySearchListing
                                        key={item.pk}
                                        data={item}
                                        addFilter={factoryAddFilter('technologies')}
                                    />}
                                />
                            </Fragment>
                            : NoResultsElement}
                    </div>
                );
        }
    }

    function getAggregationsCounter(state) {
        if (state.results.stats?.total) {
            return (<span className="aggregation">{state.results.stats.total}</span>);
        } else {
            return '';
        }
    }

    function headerClass(tabname) {
        return tabname === currentTab ? 'active' : '';
    }

    return (
        <Fragment>
            <section className="tab-navigation search">
                <div className="tab-headers">
                    <h4 onClick={e => changeTab('resources')} className={headerClass('resources')}>Resources
                        {getAggregationsCounter(resources)}</h4>
                    <h4 onClick={e => changeTab('collections')} className={headerClass('collections')}>Collections
                        {getAggregationsCounter(collections)}</h4>
                    <h4 onClick={e => changeTab('technologies')} className={headerClass('technologies')}>Technologies
                        {getAggregationsCounter(technologies)}</h4>
                </div>
                <SearchBarComponent search={setSearch} state={searchbarState}/>
                {showCurrentTab(currentTab)}
            </section>
            <section id="related" className="column-container">
                <RelatedComponent addFilter={factoryAddFilter('resources')}/>
            </section>
        </Fragment>
    );
}

ReactDOM.render(<SearchApp/>, document.getElementById('search-app'));