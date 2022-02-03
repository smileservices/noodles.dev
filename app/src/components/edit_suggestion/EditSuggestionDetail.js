import React, {Fragment, useState, useEffect} from "react"
import FormatDate from "../../vanilla/date";
import Alert from "../Alert";
import {apiDetail} from "../../api_interface/apiDetail";
import VotableComponent from "../VotableComponent";
import apiDelete from "../../api_interface/apiDelete";
import apiPost from "../../api_interface/apiPost";
import {makeId} from "../utils";
import {Input} from "../form";
import diff_match_patch from "diff-match-patch";

export default function EditSuggestionDetail({pk, api_urls, deleteCallback, publishCallback}) {
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

    function is_owner(data) {
        if (!IS_AUTHENTICATED) return false;
        return data.edit_suggestion_author.id === get_user_data().pk;
    }

    // get data from ed sug endpoint and populate the body
    useEffect(e => {
        // get data from ed sug endpoint and populate the body
        apiDetail(
            api_urls['edit_suggestions_api'], pk,
            data => {
                setData(data);
                setIsOwner(is_owner(data));
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
        apiDelete(api_urls['edit_suggestions_api'] + pk + '/',
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
        if (type === 'reject') data['edit_suggestion_reject_reason'] = rejectReason;

        await apiPost(url, data, wait => wait ? setWaiting('Processing your action') : setWaiting(false))
            .then(result => {
                if (result.ok) {
                    result.json().then(data => {
                            setAlertDisplay((
                                <div className="success-card column-container ">
                                    <header>Thank you!</header>
                                    <div className="body">{data.message}</div>
                                    <div className="buttons-container">
                                        <button className="btn" onClick={e => {
                                            e.preventDefault();
                                            if (type === 'publish') publishCallback();
                                            deleteCallback();
                                        }}>Ok
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    );
                } else {
                    result.json().then(data =>
                        setAlertDisplay((
                            <div className="success-card column-container error">
                                <header>Something is wrong :(</header>
                                <div className="body">{data.message}</div>
                                <div className="buttons-container">
                                    <button className="btn" onClick={e => setAlertDisplay(false)}>Ok</button>
                                </div>
                            </div>
                        ))
                    );
                }
            })
    }

    function EditSuggestionModeratorAction({isOwner}) {
        return (
            <div className="edit-actions toolbar">
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
            </div>
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

    function ChangeComponent({c}) {
        const [showNew, setShowNew] = useState(true);

        function displayChange(change, type) {
            if (change && type === 'image') return (<img className="changed" src={change.small} alt=""/>);
            if (!change) return (<span className="changed empty">empty</span>);
            if (change) return (<span className="changed">{change}</span>)
        }

        return (
            <div key={"change" + c.field} className="edit-change">
                <div className="field-name">
                    <span className={showNew ? "active" : ''} onClick={e => setShowNew(true)}>New {c.field}</span>
                    <span className={showNew ? '' : "active"} onClick={e => setShowNew(false)}>Old</span>
                </div>
                {showNew
                    ? displayChange(c.new, c.type)
                    : displayChange(c.old, c.type)
                }
            </div>
        )
    }

    const dmp = new diff_match_patch();
    function DiffChangeComponent({c}) {
        // c.new c.old c.type
        function handleText(text) {
            if (text) return String(text);
            return '';
        }
        function displayChange() {
            if (c.type === 'image') return (<img className="changed" src={c.small} alt=""/>);
            let diff = dmp.diff_main(handleText(c.old), handleText(c.new));
            dmp.diff_cleanupSemantic(diff);
            const result = dmp.diff_prettyHtml(diff);
            return (<span className="changed" dangerouslySetInnerHTML={{__html:result}}/>);
        }
        return (
            <div key={"change" + c.field} className="edit-change">
                <div className="field-name">
                    <span className="">{c.field}</span>
                </div>
                {displayChange()}
            </div>
        )
    }

    return (
        <div className="modal-content">
            {Object.keys(data).length
                ?
                <div className="edit-suggestion-details">
                    <header>
                        <h3>Suggested Edit</h3>
                        <p>By <a
                            href={'/users/profile/' + data.edit_suggestion_author.username}>{data.edit_suggestion_author.username}</a> on {FormatDate(data.edit_suggestion_date_created, 'datetime')}
                        </p>
                        <EditSuggestionModeratorAction isOwner={isOwner}/>
                    </header>
                    <div className="changes-container">
                        <h4 className="changes-title">Changes ({data.changes.length}):</h4>
                        <div className="changes-list">
                            {data.changes.map(c => <DiffChangeComponent c={c} key={makeId(3)}/>)}
                        </div>
                    </div>
                    <div className="edit-reason">
                        <h4>Edit Reason</h4>
                        <p>{data.edit_suggestion_reason}</p>
                    </div>
                    <div className="thumbs">
                        <VotableComponent
                            thumbs_obj={{up: data.thumbs_up_array, down: data.thumbs_down_array}}
                            url_endpoint={api_urls['edit_suggestions_api'] + pk + '/vote/'}
                        />
                    </div>
                </div>
                : ''}
        </div>
    )
}