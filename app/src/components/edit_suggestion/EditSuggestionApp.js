import React, {useState, useEffect, createContext} from "react"
import Alert from "../../components/Alert";
import apiList from "../../api_interface/apiList";
import PaginatedLayout from "../../components/PaginatedLayout";
import EditSuggestionListing from "../../components/edit_suggestion/EditSuggestionListing";
import {remove_modal_class_from_body} from "../../vanilla/modal";

import EditSuggestionForm from "./EditSuggestionForm";
import {SkeletonLoadingEdits} from "../skeleton/SkeletonLoadingEdits";
import Modal from "../Modal";

import confettiFactory from "../../vanilla/confetti";
const startConfetti = confettiFactory(100, 1);

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
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    useEffect(() => {
        if (showSuccessModal) startConfetti('confetti-canvas');
    }, [showSuccessModal]);

    function displaySuccessModal() {
        return (
            <Modal close={e => {
                setShowSuccessModal(false);
            }}>
                <div className="success-card column-container card full-page-sm">
                    <canvas id="confetti-canvas" key="confetti-canvas"/>
                    <header>Thank you!</header>
                    <div className="body">
                        Thanks for helping improve the content! <br/>
                        Your edit suggestion can be voted by other users <br/>
                        A moderator will publish or reject it
                    </div>
                    <div className="buttons-container">
                        <a className="btn" href={showSuccessModal.detail_url}>Resource Detail</a>
                        <a className="btn dark" href="/">Back to Homepage</a>
                    </div>
                </div>
            </Modal>
        )
    }

    function resetEditSuggestionPagination() {
        setEditSuggestionsPagination({...editSuggestionsPagination, current: 1});
    }

    return (
        <div className="detail-page">
            <div className="form-container">
                <EditSuggestionForm addEditSuggestionCallback={(data)=>{
                    resetEditSuggestionPagination();
                    setShowSuccessModal(data);
                }}
                                    ResourceForm={ResourceForm}
                                    api_urls={api_urls}
                                    mustReload={reloadResourceForm}
                />
            </div>
            <section className="related column-container">
                <h3>Edit Suggestions</h3>
                {editSuggestionsWaiting ? <div className="tile-container">{SkeletonLoadingEdits}</div> : ''}
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
                                             setReloadResourceForm(true);
                                         }}
                                     />
                                 }
                />
            </section>
            {showSuccessModal ? displaySuccessModal() : ''}
        </div>
    );
}