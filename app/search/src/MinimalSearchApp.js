import React from "react";
import ReactDOM from "react-dom";
import SearchBarComponent from "../../search/src/SearchBarComponent";
import {codeParamsToUrl} from "../../src/components/utils";


function MinimalSearchApp() {

    /*
    *   Just a minimal searchbar
    */

    const SEARCH_URL = '/search/'

    function setSearch(term) {
        // this gets all search params (tab, term, filters) and redirects to the search page
        let params = new URLSearchParams();
        params.set('tab', 'resources');
        if (term) {
            params.set('search', term);
        } else {
            alert('Please Write Something!');
            return false;
        }
        codeParamsToUrl(params);
        window.location = SEARCH_URL + '?' + params.toString();
    }

    return (<SearchBarComponent search={setSearch} state={{placeholder: 'Search For Something Specific', q: ''}}/>)
}

ReactDOM.render(<MinimalSearchApp/>, document.getElementById('minimal-search-app'));