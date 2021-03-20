import React, {useState, Fragment} from 'react';
import apiDelete from "../api_interface/apiDelete";
import Alert from "./Alert";
import {makeId} from "./utils";
import Modal from "./Modal";
import EditableFormComponent from "./EditableFormComponent";

export default function EditableComponent({endpoint, data, extraData, DisplayViewComponent, FormViewComponent, updateCallback, deleteCallback}) {
    const [showForm, setShowForm] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [resourceData, setResourceData] = useState(data);
    const [waiting, setWaiting] = useState(false);
    const [alertDisplay, setAlertDisplay] = useState(false);

    function deleteElement() {
        apiDelete(endpoint + data.pk + '/',
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

    function toggleShowForm() {
        setShowForm(!showForm);
        setAlertDisplay(false);
        setConfirmDelete(false)
    }

    function displayToolbar() {
        if (waiting) return waiting;
        if (alertDisplay) return alertDisplay;
        return (
            <span className="toolbar" onClick={e => {e.preventDefault(); e.stopPropagation();}}>
                {confirmDelete
                    ? <div className="confirm">
                        <span className="text">Are you sure?</span>
                        <span className="option delete" onClick={e => deleteElement(data.pk)}>yes</span>
                        <span className="option" onClick={e => setConfirmDelete(false)}>cancel</span>
                    </div>
                    :
                    <Fragment>
                        <a className="icon-pencil edit" onClick={toggleShowForm}/>
                        <a className="icon-close delete" onClick={e => setConfirmDelete(true)}/>
                    </Fragment>
                }
            </span>
        )
    }

    function displayFormModal() {
        return (
            <Modal close={toggleShowForm}>
                <EditableFormComponent endpoint={endpoint}
                                       data={resourceData}
                                       extraData={extraData}
                                       successCallback={data => {
                                           setShowForm(false);
                                           setResourceData(data);
                                           updateCallback(data);
                                           setAlertDisplay(<Alert text="Successfully updated" type="success"
                                                                  stick={false} hideable={false}
                                                                  close={()=>setAlertDisplay(false)}
                                           />)
                                       }}
                                       FormViewComponent={FormViewComponent}
                />
            </Modal>
        )
    }

    return (
        <Fragment>
            <DisplayViewComponent data={data} extraData={{...extraData, toolbar: displayToolbar()}} />
            {showForm ? displayFormModal() : ''}
        </Fragment>
    )
}