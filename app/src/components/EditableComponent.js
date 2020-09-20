import React, {useState, Fragment} from 'react';
import apiDelete from "../api_interface/apiDelete";
import apiUpdate from "../api_interface/apiUpdate";
import Alert from "./Alert";
import {makeId} from "./utils";
import Modal from "./Modal";

export default function EditableComponent({endpoint, data, DisplayViewComponent, FormViewComponent, callback, deleteCallback, customUpdateFunction = false}) {
    const [showForm, setShowForm] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [waiting, setWaiting] = useState(false);
    const [responseAlertUpdate, setResponseAlertUpdate] = useState(false);
    const [responseAlertDisplay, setResponseAlertDisplay] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    function deleteElement() {
        apiDelete(endpoint + data.pk + '/',
            setWaiting,
            msg => {
                setResponseAlertDisplay(<Alert key={makeId()} text={msg} type={'success'} stick={false} hideable={false}
                                               close={e => setResponseAlertDisplay(null)}/>)
                deleteCallback();
            },
            result => setResponseAlertDisplay(<Alert key={makeId()} text={result.statusText} type={'danger'}
                                                     stick={true}
                                                     hideable={false}
                                                     close={e => setResponseAlertDisplay(null)}/>)
        )
    }

    function updateElement(updatedData) {
        if (customUpdateFunction) {
            customUpdateFunction(updatedData);
        } else {
            apiUpdate(
                endpoint, data.pk, updatedData,
                data => {
                    setResponseAlertDisplay(<Alert key={makeId()} text="Updated successfully!" type={'success'}
                                                   stick={false}
                                                   close={e => setResponseAlertDisplay(null)}/>);
                    setShowForm(false);
                    callback(data);
                    document.body.classList.remove('modal-open');
                },
                setWaiting,
                result => {
                    result.json().then(errors => {
                        if (errors) {
                            let flattenedErrors = {};
                            Object.keys(errors).map(k => {
                                flattenedErrors[k] = [k].join('</br>');
                            })
                            setFormErrors(flattenedErrors);
                            setResponseAlertUpdate(<Alert key={makeId()}
                                                          text="Please check the field errors and try again."
                                                          type="danger" stick={false}
                                                          hideable={false} close={e => setResponseAlertUpdate(null)}/>)
                        } else {
                            setResponseAlertUpdate(<Alert key={makeId()} text={result.statusText} type="danger"
                                                          stick={false}
                                                          hideable={false} close={e => setResponseAlertUpdate(null)}/>)
                        }
                    })
                }
            )
        }
    }

    function toggleShowForm() {
        setShowForm(!showForm);
        setResponseAlertUpdate(false);
        setResponseAlertDisplay(false);
        setFormErrors({});
        setConfirmDelete(false)
    }

    function displayFormModal() {
        return (
            <Modal close={toggleShowForm}>
                <FormViewComponent data={data}
                                   updateElement={updateElement}
                                   waiting={waiting}
                                   responseAlert={responseAlertUpdate}
                                   formErrors={formErrors}
                />
            </Modal>
        )
    }

    return (
        <Fragment>
            {responseAlertDisplay}
            <span className="toolbar">
                {confirmDelete
                    ? <div className="confirm">
                        <span className="text">Are you sure?</span>
                        <span className="option delete" onClick={e => deleteElement(data.pk)}>yes</span>
                        <span className="option" onClick={e => setConfirmDelete(false)}>cancel</span>
                    </div>
                    :
                    <Fragment>
                        <span className="icon-pencil edit" onClick={toggleShowForm}/>
                        <span className="icon-close delete" onClick={e => setConfirmDelete(true)}/>
                    </Fragment>
                }
            </span>
            <DisplayViewComponent data={data} waiting={waiting}/>
            {showForm ? displayFormModal() : ''}
        </Fragment>
    )
}