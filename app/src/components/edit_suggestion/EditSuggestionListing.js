import React, {Fragment, useState} from "react"
import FormatDate from "../../vanilla/date";
import Modal from "../Modal";
import EditSuggestionDetail from "./EditSuggestionDetail";

export default function EditSuggestionListing({data, api_urls, deleteCallback, publishCallback}) {
    // this should be used as a composition component where it gets an "edit suggestion form/extended display";
    // once expanded, it should retrieve full edit sugg data from rest endpoint.
    // if the resource is owned, display the form. if the resource is not owned, just extended display
    // owner can delete/edit
    // user can vote/publish/reject

    /*
    *       api_urls => keys: detail, publish, reject, vote
    * */


    const [showModal, setShowModal] = useState(false);

    function displayItemModal() {
        //if edit author, display the EditForm
        //if not edit author, display the ExtendedDisplay
        // const modal_content = data.edit_suggestion_author === USER_ID
        //     ? <EditSuggestionForm api_urls={api_urls} pk={data.pk} deleteCallback={deleteCallback}
        //                           FormElement={FormElement}/>
        //     : <EditSuggestionDetail api_urls={api_urls} pk={data.pk} DisplayElement={DisplayElement}/>
        return (
            <Modal close={e => setShowModal(false)}>
                <EditSuggestionDetail api_urls={api_urls} pk={data.pk} deleteCallback={deleteCallback} publishCallback={publishCallback}/>
            </Modal>
        )
    }

    return (
        <Fragment>
            <span className="card" onClick={e => setShowModal(true)}>
                <div className="result">
                    <p>author: <a href={'/users/profile/'+data.edit_suggestion_author.username}>{data.edit_suggestion_author.username}</a></p>
                    <p>reason: {data.edit_suggestion_reason}</p>
                    <p>{FormatDate(data.edit_suggestion_date_created, 'datetime')}</p>
                    <div className="thumbs">
                        <div className="down"><span className="icon-thumbs-o-down"> </span>{data.thumbs_down}</div>
                        <div className="up"><span className="icon-thumbs-o-up"> </span>{data.thumbs_up}</div>
                    </div>
                </div>
            </span>
            {showModal ? displayItemModal() : ''}
        </Fragment>
    )
}