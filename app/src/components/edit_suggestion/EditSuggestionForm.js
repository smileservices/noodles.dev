import React, {Fragment, useState, useEffect} from "react"
import FormatDate from "../../vanilla/date";
import apiDelete from "../../api_interface/apiDelete";
import Alert from "../Alert";
import {makeId} from "../utils";
import {apiDetail} from "../../api_interface/apiDetail";


export default function EditSuggestionForm({pk, api_urls, deleteCallback, FormElement}) {
    /*
    *   A compositor component for editing edit suggestions
    *   just need the edit suggestion endpoint, the voting endpoint and the body to be populated
    *
    *   get the data from api
    *   populate the body with the data
    *   add voting functionality
    *
    * */

    const [data, setData] = useState({});

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [alertDisplay, setAlertDisplay] = useState(false);

    useEffect(e => {
        // get data from ed sug endpoint and populate the body
        apiDetail(
            api_urls['detail'], pk,
            data => setData(data),
            setWaiting,
            result => setAlertDisplay(<Alert text="Could not retrieve edit suggestion detail :(" stick={true}
                                             type="danger"/>)
        )
    }, [])

    function deleteElement() {
        apiDelete(api_urls['edit_suggestion'] + pk + '/',
            setWaiting,
            msg => {
                setAlertDisplay(<Alert key={makeId()} text={msg} type={'success'} stick={false} hideable={false}
                                       close={e => setAlertDisplay(null)}/>)
                deleteCallback();
            },
            result => setAlertDisplay(<Alert key={makeId()} text={result.statusText} type={'danger'}
                                             stick={true}
                                             hideable={false}
                                             close={e => setAlertDisplay(null)}/>)
        )
    }

    function displayToolbar() {
        if (waiting) return waiting;
        if (alertDisplay) return alertDisplay;

        return (
            <span className="toolbar">
                {confirmDelete
                    ? <div className="confirm">
                        <span className="text">Are you sure?</span>
                        <span className="option delete" onClick={e => deleteElement(data.pk)}>yes</span>
                        <span className="option" onClick={e => setConfirmDelete(false)}>cancel</span>
                    </div>
                    :
                    <Fragment>
                        <span className="icon-close delete" onClick={e => setConfirmDelete(true)}/>
                    </Fragment>
                }
            </span>
        )
    }

    return (
        <Fragment>
            { alertDisplay }
            { waiting }
            { Object.keys(data).length ? <FormElement data={data}/> : ''}
        </Fragment>
    )
}