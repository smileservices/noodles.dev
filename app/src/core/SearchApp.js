import React, {useState, useEffect, Fragment} from "react";
import ReactDOM from "react-dom";
import apiList from "../api_interface/apiList";
import StarRating from "../components/StarRating";
import ResourceRating from "../../study_resource/src/ResourceRating";
import {makeId} from "../components/utils";

function SearchApp() {

    const [formData, setFormData] = useState({
        'term': ''
    })

    const [pagination, setPagination] = useState({
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });

    const [resultsCollections, setResultsCollections] = useState([]);
    const [resultsTutorials, setResultsTutorials] = useState([]);
    const [resultsTechnologies, setResultsTechnologies] = useState([]);

    const [waitingCollections, setWaitingCollections] = useState('');
    const [waitingTutorials, setWaitingTutorials] = useState('');
    const [waitingTechnologies, setWaitingTechnologies] = useState('');

    const [errorCollections, setErrorCollections] = useState('');
    const [errorTutorials, setErrorTutorials] = useState('');
    const [errorTechnologies, setErrorTechnologies] = useState('');

    const [showSearchWindow, setShowSearchWindow] = useState(false);

    const controller = new AbortController();

    useEffect(e => {
        if (formData.term.length > 3) {
            if (!showSearchWindow) setShowSearchWindow(true);
            apiList(
                STUDY_COLLECTION_FILTER_URL,
                pagination,
                setResultsCollections,
                setWaitingCollections, setErrorCollections,
                false, false, formData.term,
                controller.signal
            );
            apiList(
                STUDY_RESOURCE_FILTER_URL,
                pagination,
                setResultsTutorials,
                setWaitingTutorials, setErrorTutorials,
                false, false, formData.term,
                controller.signal
            );
            apiList(
                TECHNOLOGIES_FILTER_URL,
                pagination,
                setResultsTechnologies,
                setWaitingTechnologies, setErrorTechnologies,
                false, false, formData.term,
                controller.signal
            );
            return e => controller.abort();
        } else {
            setShowSearchWindow(false);
        }
    }, [formData])

    function SearchWindow({dataCollection, dataTutorial, dataTechnologies}) {

        function showResults(title, dataContainer, ListingElement) {
            if (!dataContainer.results || dataContainer.results.length === 0) return '';
            if (dataContainer.wait) return dataContainer.wait;
            return (
                <Fragment>
                    <h4>{title}</h4>
                    {dataContainer.results.map(item => <ListingElement key={makeId(5)} data={item}/>)}
                </Fragment>
            )
        }

        const CollectionListing = ({data}) => {
            return (
                <p><a className="result" href={data.absolute_url}>{data.name} | {data.items_count} items</a></p>)
        };
        const TutorialListing = ({data}) => {
            return (
                <p>
                    <a className="result" href={data.absolute_url}>
                        <span className="rating">
                            <ResourceRating rating={data.rating} maxRating={5} reviewsCount={data.reviews_count}/>
                        </span>
                        {data.name}
                    </a>
                </p>
            )
        }
        const TechnologyListing = ({data}) => {
            return (
                <p><a className="result" href={data.absolute_url}>{data.name}</a></p>)
        };

        if (
            dataCollection.results && dataTutorial.results && dataTechnologies.results &&
            dataCollection.results.length === 0 &&
            dataTutorial.results.length === 0 &&
            dataTechnologies.results.length === 0
        ) return (
            <div id="search-window">
                <div className="results">
                    <h3>No results for this term</h3>
                </div>
            </div>
        )

        return (
            <div id="search-window">
                <div className="results">
                    <section className="collections">{showResults(
                        'Collections', dataCollection, CollectionListing
                    )}</section>
                    <section className="tutorials">{showResults(
                        'Tutorials/Courses', dataTutorial, TutorialListing
                    )}</section>
                    <section className="technologies">{showResults(
                        'Technologies', dataTechnologies, TechnologyListing
                    )}</section>
                </div>
            </div>
        );
    }

    return (
        <Fragment>
            <form onSubmit={e => console.log(formData)}>
                <input type="text"
                       placeholder="Search for a tutorial or course..."
                       value={formData.term}
                       onChange={e => setFormData({...formData, term: e.target.value})}
                />
                <button type="submit"><span className="icon-search"> </span></button>
            </form>
            {showSearchWindow ? <SearchWindow
                dataCollection={{
                    wait: waitingCollections,
                    error: errorCollections,
                    results: resultsCollections.results
                }}
                dataTutorial={{wait: waitingTutorials, error: errorTutorials, results: resultsTutorials.results}}
                dataTechnologies={{
                    wait: waitingTechnologies,
                    error: errorTechnologies,
                    results: resultsTechnologies.results
                }}
            /> : ''}
        </Fragment>
    )
}

ReactDOM.render(<SearchApp/>, document.getElementById('search-app'));