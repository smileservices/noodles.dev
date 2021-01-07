import React, {useState, useEffect, Fragment} from "react"
import ReactDOM from "react-dom";
import Alert from "../../../src/components/Alert";
import apiList from "../../../src/api_interface/apiList";
import PaginatedLayout from "../../../src/components/PaginatedLayout";
import EditSuggestionListing from "../../../src/components/edit_suggestion/EditSuggestionListing";
import {remove_modal_class_from_body} from "../../../src/vanilla/modal";

import EditForm from "./EditForm";

function EditApp() {
    const [editSuggestions, setEditSuggestions] = useState([]);
    const [editSuggestionsPagination, setEditSuggestionsPagination] = useState({
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });
    const [editSuggestionsWaiting, setEditSuggestionsWaiting] = useState(false);
    const [editSuggestionsAlert, setEditSuggestionsAlert] = useState(false);


    useEffect(() => {
        //get edit suggestions
        apiList(
            EDIT_SUGGESTION_LIST,
            editSuggestionsPagination,
            setEditSuggestions,
            setEditSuggestionsWaiting,
            err => setEditSuggestionsAlert(<Alert close={e => setEditSuggestionsAlert(null)} text={err}
                                                  type="danger"/>),
            {'status': 0}
        )
    }, [editSuggestionsPagination,]);

    function resetEditSuggestionPagination() {
        setEditSuggestionsPagination({...editSuggestionsPagination, current: 1});
    }

    return (
        <div className="detail-page">
            <div className="column-container card">
                <EditForm addEditSuggestion={resetEditSuggestionPagination}/>
            </div>
            <section className="related column-container">
                <h3>Edit Suggestions</h3>
                {editSuggestionsWaiting}
                {editSuggestionsAlert}
                <PaginatedLayout data={editSuggestions.results} resultsCount={editSuggestions.count}
                                 pagination={editSuggestionsPagination}
                                 setPagination={setEditSuggestionsPagination}
                                 resultsContainerClass="tile-container"
                                 mapFunction={
                                     (item, idx) => <EditSuggestionListing
                                         key={"edit_suggestion_" + item.pk}
                                         data={item}
                                         deleteCallback={() => {
                                             resetEditSuggestionPagination();
                                             remove_modal_class_from_body();
                                         }}
                                         api_urls={{
                                             detail: EDIT_SUGGESTIONS_API,
                                             publish: EDIT_SUGGESTION_PUBLISH,
                                             reject: EDIT_SUGGESTION_REJECT,
                                             vote: EDIT_SUGGESTIONS_API + item.pk + '/vote/'
                                         }}
                                     />
                                 }
                />
            </section>
        </div>
    );
}

ReactDOM.render(<EditApp/>, document.getElementById('edit-app'));