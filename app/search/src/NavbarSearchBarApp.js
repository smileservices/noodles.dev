import React, {useState, useEffect, Fragment} from "react";
import ReactDOM from "react-dom";
import apiList from "../../src/api_interface/apiList";
import StarRating from "../../src/components/StarRating";
import ResourceRating from "../../study_resource/src/ResourceRating";
import {makeId, extractURLParams} from "../../src/components/utils";

function NavbarSearchBarApp() {

    const [formData, setFormData] = useState('');
    const [results, setResults] = useState([]);
    const [waiting, setWaiting] = useState('');

    const [showSearchWindow, setShowSearchWindow] = useState(false);

    const controller = new AbortController();

    function redirectToSearchPage(term) {
        document.location = '/search/?q=' + term;
    }

    useEffect(e => {
        if (formData.length > 1) {
            fetch('/search/api/autocomplete/' + formData + '/', {
                method: "GET",
                signal: controller.signal
            }).then(result => {
                setWaiting('');
                if (result.ok) {
                    return result.json();
                } else {
                    alert('Could not read data: ' + result.statusText)
                }
            }).then(data => {
                if (data && data.length > 0) {
                    setResults(data);
                    setShowSearchWindow(true)
                } else {
                    setShowSearchWindow(false)
                }
            }).catch(err => {
                if (err.name === 'AbortError') {
                    console.log('Fetch was aborted');
                }
            });
            return e => controller.abort();
        } else {
            setShowSearchWindow(false);
        }
    }, [formData])

    function handleClickOnSuggestion(r) {
        return e => {
            redirectToSearchPage(r);
        }
    }

    function SearchWindow({results}) {
        return (
            <div id="search-window">
                <div className="results">
                    {results.map(r => <p key={r} onClick={handleClickOnSuggestion(r)}>{r}</p>)}
                </div>
            </div>
        )
    }

    return (
        <Fragment>
            <form onSubmit={e => {
                e.preventDefault();
                redirectToSearchPage(formData);
            }}>
                <input type="text"
                       placeholder="Search for a tutorial or course..."
                       value={formData}
                       onChange={e => {
                           setFormData(e.target.value)
                       }}
                />
                <button type="submit"><span className="icon-search"> </span></button>
            </form>
            {showSearchWindow ? <SearchWindow results={results}/> : ''}
        </Fragment>
    )
}

ReactDOM.render(<NavbarSearchBarApp/>, document.getElementById('search-bar-app'));