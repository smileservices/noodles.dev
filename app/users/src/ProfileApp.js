import React, {useState, useEffect, Fragment} from "react";
import ReactDOM from "react-dom";
import StudyResourceSearchListing from "../../study_resource/src/StudyResourceSearchListing";
import CollectionSearchListing from "../../study_collection/src/CollectionSearchListing";
import TechnologySearchListing from "../../technology/src/TechnologySearchListing";
import PaginatedLayout from "../../src/components/PaginatedLayout";

const NoResultsElement = (
    <div className="no-results">
        <h2>None Added</h2>
        <p>Nothing added by this user.</p>
    </div>
)


function ProfileApp() {
    const SEARCH_URL = '/search/';
    const SEARCH_API_URL = '/users/api/' + USER.pk + '/';
    const defaultTabState = {
        rated_highest: {},
        latest: {},
        waiting: false,
        filters: {},
        availableFilters: {},
    };
    const defaultPagination = {
        resultsPerPage: 10,
        current: 1,
        offset: 0
    }

    const [currentTab, setCurrentTab] = useState('resources');

    const [resources, setResources] = useState(defaultTabState);
    const [collections, setCollections] = useState(defaultTabState);
    const [technologies, setTechnologies] = useState(defaultTabState);

    const [paginationResources, setPaginationResources] = useState(defaultPagination);
    const [paginationCollections, setPaginationCollections] = useState(defaultPagination);
    const [paginationTechnologies, setPaginationTechnologies] = useState(defaultPagination);

    async function getResource(tab, pagination, setResults) {
        const paginationParams = new URLSearchParams();
        paginationParams.set('resultsPerPage', pagination.resultsPerPage);
        paginationParams.set('offset', pagination.offset);
        await fetch(SEARCH_API_URL + tab + '?' + paginationParams.toString(), {
            method: 'GET'
        }).then(result => {
            if (result.ok) {
                result.json().then(data => setResults(data));
            } else {
                alert('Could not read '+tab+' data: ' + result.statusText)
            }
        })
    }

    //listeners to pagination change for every resource type
    useEffect(e=>{
        getResource('resources', paginationResources, setResources);
    }, [paginationResources,]);
    useEffect(e=>{
        getResource('collections', paginationCollections, setCollections);
    }, [paginationCollections,]);
    useEffect(e=>{
        getResource('technologies', paginationTechnologies, setTechnologies);
    }, [paginationTechnologies,]);

    function changeTab(tabname) {
        setCurrentTab(tabname);
    }

    function addFilterfactory(tab) {
        return (name, value) => window.location = SEARCH_URL + '?tab=' + tab + '&' + name + '=' + value;
    }

    function showCurrentTab(currentTab) {
        switch (currentTab) {
            case 'resources':
                return (
                    <div className="resources">
                        {resources.items?.length > 0 ?
                            <div className="most-voted">
                                <h4>Best Reviewed Resources</h4>
                                <PaginatedLayout
                                    pagination={paginationResources}
                                    resultsCount={resources.stats.total}
                                    data={resources.items}
                                    resultsContainerClass="results"
                                    setPagination={setPaginationResources}
                                    mapFunction={(resource, idx) => <StudyResourceSearchListing
                                        key={"user-resource" + resource.pk} data={resource}
                                        addFilter={addFilterfactory('resources')}
                                    />}
                                />
                            </div>
                            : NoResultsElement}
                    </div>
                );
            case 'collections':
                return (
                    <div className="collections">
                        {collections.items?.length > 0 ?
                            <div className="most-voted">
                                <h4>Most Up Voted Collections</h4>
                                <PaginatedLayout
                                    pagination={paginationCollections}
                                    resultsCount={collections.stats.total}
                                    data={collections.items}
                                    resultsContainerClass="results"
                                    setPagination={setPaginationCollections}
                                    mapFunction={(resource, idx) => <CollectionSearchListing
                                        key={"user-collection" + resource.pk} data={resource}
                                        addFilter={addFilterfactory('collections')}
                                    />}
                                />
                            </div>
                            : NoResultsElement}
                    </div>
                );
            case 'technologies':
                return (
                    <div className="technologies">
                        {technologies.items?.length > 0 ?
                            <div className="most-voted">
                                <h4>Most Up Voted Technologies</h4>
                                <PaginatedLayout
                                    pagination={paginationTechnologies}
                                    resultsCount={technologies.stats.total}
                                    data={technologies.items}
                                    resultsContainerClass="results"
                                    setPagination={setPaginationTechnologies}
                                    mapFunction={(resource, idx) => <TechnologySearchListing
                                        key={"rated-tech" + resource.pk} data={resource}
                                        addFilter={addFilterfactory('technologies')}
                                    />}
                                />
                            </div>
                            : NoResultsElement}
                    </div>
                );
        }
    }

    function getAggregationsCounter(state) {
        if (state.stats?.total) {
            return (<span className="aggregation">{state.stats.total}</span>);
        } else {
            return '';
        }
    }

    function headerClass(tabname) {
        return tabname === currentTab ? 'active' : '';
    }

    return (
        <Fragment>
            <div className="detail">
                <div className="breadcrumbs">
                    <a href="/">Homepage</a> / Users / {USER.username}
                </div>
                <h1>{USER.username}</h1>
                <p className="about">{USER.about ? USER.about : 'No Info'}</p>
            </div>
            <section className="tab-navigation search">
                <div className="tab-headers">
                    <h4 onClick={e => changeTab('resources')} className={headerClass('resources')}>Resources
                        {getAggregationsCounter(resources)}</h4>
                    <h4 onClick={e => changeTab('collections')} className={headerClass('collections')}>Collections
                        {getAggregationsCounter(collections)}</h4>
                    <h4 onClick={e => changeTab('technologies')}
                        className={headerClass('technologies')}>Technologies
                        {getAggregationsCounter(technologies)}</h4>
                </div>
                {showCurrentTab(currentTab)}
            </section>
        </Fragment>
    )
}

ReactDOM.render(<ProfileApp/>, document.getElementById('profile-app'));


