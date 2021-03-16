import React, {useState, useEffect, createContext} from "react"
import Alert from "../../components/Alert";
import apiList from "../../api_interface/apiList";
import PaginatedLayout from "../../components/PaginatedLayout";
import EditSuggestionListing from "../../components/edit_suggestion/EditSuggestionListing";
import {remove_modal_class_from_body} from "../../vanilla/modal";

import EditSuggestionForm from "./EditSuggestionForm";

/*
*  Displays the edit form for resource and the paginated edit suggestion listings
*
*  it receives the resource form and the api_urls obj
*
* */

export default function EditApp({ResourceForm, api_urls}) {

    // ResourceForm -> standardized resource form
    // api_urls -> must have keys for
    //                      resource_detail,
    //                      resource_api,
    //                      edit_suggestions_api,
    //                      publish,
    //                      reject,


    const [editSuggestions, setEditSuggestions] = useState([]);
    const [editSuggestionsPagination, setEditSuggestionsPagination] = useState({
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });
    const [editSuggestionsWaiting, setEditSuggestionsWaiting] = useState(false);
    const [editSuggestionsAlert, setEditSuggestionsAlert] = useState(false);

    const [reloadResourceForm, setReloadResourceForm] = useState(false);


    useEffect(() => {
        //get edit suggestions
        apiList(
            api_urls['edit_suggestions_list'],
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
            <div className="form-container">
                <EditSuggestionForm addEditSuggestionCallback={resetEditSuggestionPagination}
                                    ResourceForm={ResourceForm}
                                    api_urls={api_urls}
                                    mustReload={reloadResourceForm}
                />
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
                                         api_urls={api_urls}
                                         publishCallback={() => {
                                             setReloadResourceForm(true)
                                         }}
                                     />
                                 }
                />
            </section>
        </div>
    );
}