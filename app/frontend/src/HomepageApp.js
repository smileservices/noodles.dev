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

    const defaultTabState = {
        rated_highest: {},
        waiting: false,
        filters: {},
        availableFilters: {},
    };

    const [searchbarState, setSearchbarState] = useState({
        placeholder: 'Search For Something Specific',
        q: '',
    });

    const [aggregations, setAggregations] = useState(false);
    const [currentTab, setCurrentTab] = useState('resources');

    const [resources, setResources] = useState(defaultTabState);
    const [collections, setCollections] = useState(defaultTabState);
    const [technologies, setTechnologies] = useState(defaultTabState);

    function setSearch(term) {
        //todo get all tab/filters/searchterm and set location to search page with params
        const [tabState, setTabState] = getTabState(currentTab);
        console.log('initating search', currentTab, term, tabState.filters);
    }


    useEffect(e => {

        //get aggregated results data
        fetch(url_aggregations, {
            method: 'GET'
        }).then(result => {
            if (result.ok) {
                result.json().then(data => setAggregations(data));
            } else {
                alert('Could not read data: ' + result.statusText)
            }
        })
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
                        />
                        {resources.rated_highest.items?.length > 0 ?
                            <Fragment>
                                <h4>Best Reviewed Resources</h4>
                                <div className="results">
                                    {resources.rated_highest.items.map(resource =>
                                        <StudyResourceSearchListing data={resource}
                                                                    addFilter={addFilterfactory('resources')}/>
                                    )}
                                </div>
                            </Fragment>
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
                        />
                        {collections.rated_highest.items?.length > 0 ?
                            <Fragment>
                                <h4>Collections</h4>
                            </Fragment>
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
                        />
                        {technologies.rated_highest.items?.length > 0 ?
                            <Fragment>
                                <h4>Technologies</h4>
                            </Fragment>
                            : ''}
                    </div>
                );
        }
    }

    function getAggregationsCounter(name) {
        if (!aggregations) return '';
        if (aggregations[name]) {
            return (<span className="aggregation">{aggregations[name]}</span>);
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
                        {getAggregationsCounter('study_resources')}</h4>
                    <h4 onClick={e => changeTab('collections')} className={headerClass('collections')}>Collections
                        {getAggregationsCounter('collections')}</h4>
                    <h4 onClick={e => changeTab('technologies')}
                        className={headerClass('technologies')}>Technologies
                        {getAggregationsCounter('technologies')}</h4>
                </div>
                <SearchBarComponent search={setSearch} state={searchbarState}/>
                {showCurrentTab(currentTab)}
            </section>
            <section id="related" className="column-container">
                <RelatedComponent/>
            </section>
        </Fragment>
    );
}

ReactDOM.render(<HomepageApp/>, document.getElementById('homepage-app'));