import React, {useState, useEffect, Fragment} from "react";
import ReactDOM from "react-dom";

import StudyResourceSearchListing from "../../study_resource/src/StudyResourceSearchListing";
import CollectionSearchListing from "../../study_collection/src/CollectionSearchListing";
import TechnologySearchListing from "../../technology/src/TechnologySearchListing";

import {FilterComponent} from "../../src/components/FilterComponent";
import SearchBarComponent from "../../search/src/SearchBarComponent";
import RelatedComponent from "../../search/src/RelatedComponent";


import {codeParamsToUrl, getAvailableFilters} from "../../src/components/utils";

const url_aggregations = '/api/aggregations';
const url_aggr_filters_resources = 'api/aggregations/study-resources';
const url_aggr_filters_collections = '/api/aggregations/collections';
const url_aggr_filters_technologies = '/api/aggregations/technologies';

function HomepageApp() {

    /*
    *   Homepage App is a gateway to search page
    *
    *   Search Section:
    *       - show count of total available resources
    *       - show total aggregates for filters
    *       - can filter/search
    *       - have to set Apply search or press enter in the search bar
    *
    *   Featured content based on the selected tab in the search section
    *       - resources - get latest/most reviewed
    *       - collections - latest/most voted
    *       - technologies - latest/most voted
    *
    * */

    const SEARCH_URL = '/search/'

    const defaultTabState = {
        rated_highest: {},
        latest: {},
        waiting: false,
        filters: {},
        availableFilters: {},
    };

    const [currentTab, setCurrentTab] = useState('resources');

    const [resources, setResources] = useState(defaultTabState);
    const [collections, setCollections] = useState(defaultTabState);
    const [technologies, setTechnologies] = useState(defaultTabState);

    function setSearch(term) {
        // this gets all search params (tab, term, filters) and redirects to the search page
        const [tabState, setTabState] = getTabState(currentTab);
        let params = new URLSearchParams();
        params.set('tab', currentTab);
        if (term) {
            params.set('search', term);
        }
        codeParamsToUrl(params, tabState.filters);
        window.location = SEARCH_URL+'?'+params.toString();
    }


    useEffect(e => {
        //get aggregated results data
        fetch(url_aggr_filters_resources, {
            method: 'GET'
        }).then(result => {
            if (result.ok) {
                result.json().then(data => setResources({
                    rated_highest: data.rated_highest,
                    filters: {},
                    availableFilters: getTabFilters('resources', data.all_filters)
                }));
            } else {
                alert('Could not read resources data: ' + result.statusText)
            }
        })

        fetch(url_aggr_filters_collections, {
            method: 'GET'
        }).then(result => {
            if (result.ok) {
                result.json().then(data => setCollections({
                    rated_highest: data.rated_highest,
                    latest: data.latest,
                    filters: {},
                    availableFilters: getTabFilters('collections', data.all_filters)
                }));
            } else {
                alert('Could not read collections data: ' + result.statusText)
            }
        })
        fetch(url_aggr_filters_technologies, {
            method: 'GET'
        }).then(result => {
            if (result.ok) {
                result.json().then(data => setTechnologies({
                    rated_highest: data.rated_highest,
                    latest: data.latest,
                    filters: {},
                    availableFilters: getTabFilters('technologies', data.all_filters)
                }));
            } else {
                alert('Could not read technologies data: ' + result.statusText)
            }
        })
    }, []);

    function getTabFilters(tabname, resultsFilters) {
        // sets the available filters
        // used when populating filter component
        if (!Object.keys(resultsFilters).length) return {};
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

    function changeTab(tabname) {
        setCurrentTab(tabname);
    }

    function addFilterfactory(tab) {
        return (name, value) => window.location = '/search/?tab=' + tab + '&' + name + '=' + value;
    }

    function showCurrentTab(currentTab) {
        switch (currentTab) {
            case 'resources':
                return (
                    <div className="resources">
                        <FilterComponent
                            key="resources-filters"
                            fields={resources.availableFilters}
                            queryFilter={resources.filters}
                            setQueryFilter={filter => setResources({...resources, filters: filter})}
                            applyButtonAction={e=>setSearch(false)} //because we have to bind data to searchBar 2way
                        />
                        {resources.rated_highest.items?.length > 0 ?
                            <div className="most-voted">
                                <h4>Best Reviewed Resources</h4>
                                <div className="results">
                                    {resources.rated_highest.items.map(resource =>
                                        <StudyResourceSearchListing key={"rated-resource"+resource.pk} data={resource}
                                                                    addFilter={addFilterfactory('resources')}/>
                                    )}
                                </div>
                            </div>
                            : ''}
                    </div>
                );
            case 'collections':
                return (
                    <div className="collections">
                        <FilterComponent
                            key="collections-filters"
                            fields={collections.availableFilters}
                            queryFilter={collections.filters}
                            setQueryFilter={filter => setCollections({...collections, filters: filter})}
                            applyButtonAction={e=>setSearch(false)}//because we have to bind data to searchBar 2way
                        />
                        {collections.rated_highest.items?.length > 0 ?
                            <div className="most-voted">
                                <h4>Most Up Voted Collections</h4>
                                <div className="results">
                                    {collections.rated_highest.items.map(resource =>
                                        <CollectionSearchListing key={"rated-collection"+resource.pk} data={resource}
                                                                    addFilter={addFilterfactory('collections')}/>
                                    )}
                                </div>
                            </div>
                            : ''}
                            {collections.latest.items?.length > 0 ?
                            <div className="latest">
                                <h4>Latest Added Collections</h4>
                                <div className="results">
                                    {collections.latest.items.map(resource =>
                                        <CollectionSearchListing key={"latest-collection"+resource.pk} data={resource}
                                                                    addFilter={addFilterfactory('collections')}/>
                                    )}
                                </div>
                            </div>
                            : ''}
                    </div>
                );
            case 'technologies':
                return (
                    <div className="technologies">
                        <FilterComponent
                            key="technologies-filters"
                            fields={technologies.availableFilters}
                            queryFilter={technologies.filters}
                            setQueryFilter={filter => setTechnologies({...technologies, filters: filter})}
                            applyButtonAction={e=>setSearch(false)}//because we have to bind data to searchBar 2way
                        />
                        {technologies.rated_highest.items?.length > 0 ?
                            <div className="most-voted">
                                <h4>Most Up Voted Technologies</h4>
                                <div className="results">
                                    {technologies.rated_highest.items.map(resource =>
                                        <TechnologySearchListing key={"rated-tech"+resource.pk} data={resource}
                                                                    addFilter={addFilterfactory('technologies')}/>
                                    )}
                                </div>
                            </div>
                            : ''}
                            {technologies.latest.items?.length > 0 ?
                            <div className="latest">
                                <h4>Latest Added Technologies</h4>
                                <div className="results">
                                    {technologies.latest.items.map(resource =>
                                        <TechnologySearchListing key={"latest-tech"+resource.pk} data={resource}
                                                                    addFilter={addFilterfactory('technologies')}/>
                                    )}
                                </div>
                            </div>
                            : ''}
                    </div>
                );
        }
    }

    function getAggregationsCounter(state) {
        if (state.rated_highest.stats?.total) {
            return (<span className="aggregation">{state.rated_highest.stats.total}</span>);
        } else {
            return '';
        }
    }

    function headerClass(tabname) {
        return tabname === currentTab ? 'active' : '';
    }

    return (
        <Fragment>
            <section className="tab-navigation" id="search">
                <div className="tab-headers">
                    <h4 onClick={e => changeTab('resources')} className={headerClass('resources')}>Resources
                        {getAggregationsCounter(resources)}</h4>
                    <h4 onClick={e => changeTab('collections')} className={headerClass('collections')}>Collections
                        {getAggregationsCounter(collections)}</h4>
                    <h4 onClick={e => changeTab('technologies')}
                        className={headerClass('technologies')}>Technologies
                        {getAggregationsCounter(technologies)}</h4>
                </div>
                <SearchBarComponent search={setSearch} state={{placeholder: 'Search For Something Specific',q: ''}}/>
                {showCurrentTab(currentTab)}
            </section>
            <section id="related" className="column-container">
                <RelatedComponent/>
            </section>
        </Fragment>
    );
}

ReactDOM.render(<HomepageApp/>, document.getElementById('homepage-app'));