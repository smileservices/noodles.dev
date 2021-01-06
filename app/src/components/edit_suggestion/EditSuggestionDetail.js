import React, {Fragment, useState, useEffect} from "react"
import FormatDate from "../../vanilla/date";
import Alert from "../Alert";
import {apiDetail} from "../../api_interface/apiDetail";
import Thumbs from "../../../study_resource/src/Thumbs";
import apiDelete from "../../api_interface/apiDelete";
import apiPost from "../../api_interface/apiPost";
import {getCsrfToken, makeId} from "../utils";
import {Input} from "../form";

export default function EditSuggestionDetail({pk, api_urls, deleteCallback}) {
    /*
    *   A compositor component for displaying edit suggestions
    *   just need the edit suggestion endpoint, the voting endpoint and the body to be populated
    *
    *   get the data from api
    *   populate the body with the data
    *   add user can vote/publish/reject
    *
    * */

    const [waiting, setWaiting] = useState(false);
    const [alertDisplay, setAlertDisplay] = useState(false);
    const [data, setData] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [rejectForm, setRejectForm] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    // get data from ed sug endpoint and populate the body
    useEffect(e => {
        // get data from ed sug endpoint and populate the body
        apiDetail(
            api_urls['detail'], pk,
            data => {
                setData(data);
                setIsOwner(data.edit_suggestion_author.id === USER_ID);
            },
            setWaiting,
            result => setAlertDisplay(<Alert text="Could not retrieve edit suggestion detail :(" stick={true}
                                             type="danger"/>)
        )
    }, [])

    /*
    * if user is owner, can delete
    * */
    function deleteElement() {
        apiDelete(api_urls['detail'] + pk + '/',
            setWaiting,
            msg => {
                deleteCallback();
            },
            result => setAlertDisplay(<Alert key={makeId()} text={result.statusText} type={'danger'}
                                             stick={true}
                                             hideable={false}
                                             close={e => setAlertDisplay(null)}/>)
        )
    }

    async function edit_suggestion_action(url, type) {
        let data = {'edit_suggestion_id': pk};
        if (type==='reject') data['edit_suggestion_reject_reason'] = rejectReason;

        await apiPost(url, data, setWaiting)
            .then(result => {
                if (result.ok) {
                    result.json().then(data => {
                            let content = (
                                <Fragment>
                                    <p>{data.message}</p>
                                    <button className="btn" onClick={e=>{e.preventDefault(); deleteCallback()}}>Ok</button>
                                </Fragment>
                            );
                            setAlertDisplay(<Alert text={content} type="success" hideable={false}
                                                   close={e => setAlertDisplay('')}/>)
                        }
                    );
                } else {
                    result.json().then(data =>
                        setAlertDisplay(<Alert text={data.message} type="danger" hideable={true}
                                               close={e => setAlertDisplay('')}/>)
                    );
                }
            })
    }

    function EditSuggestionToolbar({isOwner}) {

        return (
            <span className="toolbar">
                {isOwner ?
                    <a href="" onClick={e => {
                        e.preventDefault();
                        setConfirmDelete(true)
                    }}>delete</a> : ''}

                <a href="" onClick={e => {
                    e.preventDefault();
                    edit_suggestion_action(api_urls['publish'], 'publish');
                }}>publish</a>
                <a href="" onClick={e => {
                    e.preventDefault();
                    setRejectForm(true);
                }}>reject</a>
            </span>
        )
    }

    if (waiting) return waiting;
    if (alertDisplay) return alertDisplay;
    if (confirmDelete) return (
        <div className="confirm">
            <span className="text">Are you sure?</span>
            <span className="option delete" onClick={e => deleteElement(data.pk)}>yes</span>
            <span className="option" onClick={e => setConfirmDelete(false)}>cancel</span>
        </div>
    );

    if (rejectForm) return (
        <form className="form-container">
            <div className="header"><h3>Are you sure?</h3></div>
            <Input
                name={'name'}
                label="Reject Reason"
                inputProps={{
                    disabled: Boolean(waiting),
                    type: 'text',
                    required: true,
                    value: rejectReason,
                    onChange: e => setRejectReason(e.target.value)
                }}
                smallText="Why do you reject this edit suggestion?"
                error={''}
            />
            <div className="row">
                <button className="btn submit" type="submit"
                        onClick={e => {
                            edit_suggestion_action(api_urls['reject'], 'reject');
                            setRejectForm(false);
                        }}>
                    Reject
                </button>
                <button className="btn submit" type="submit"
                        onClick={e => setRejectForm(false)}>
                    Cancel
                </button>
            </div>
        </form>
    );

    return (
        <div className="modal-content has-toolbar">
            <EditSuggestionToolbar isOwner={isOwner}/>
            {Object.keys(data).length
                ?
                <div className="edit-suggestion-details">
                    <h4>Changes:</h4>
                    {data.changes.map(c =>
                        <div className="edit-change">
                            <p>Field name: "{c.field}"</p>
                            <p>Old value:</p>
                            <p>"{c.old}"</p>
                            <p>New value:</p>
                            <p>"{c.new}"</p>
                        </div>
                    )}

                    <p>author: {data.edit_suggestion_author.get_full_name}</p>
                    <p>reason: {data.edit_suggestion_reason}</p>
                    <p>created: {FormatDate(data.edit_suggestion_date_created, 'datetime')}</p>

                    <div className="thumbs">
                        <Thumbs
                            thumbs_obj={{up: data.thumbs_up_array, down: data.thumbs_down_array}}
                            user_id={USER_ID}
                            url_endpoint={api_urls.vote}
                        />
                    </div>
                </div>
                : ''}
        </div>
    )
}