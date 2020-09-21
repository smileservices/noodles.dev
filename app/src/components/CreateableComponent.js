import React, {useState, Fragment} from 'react';
import apiCreate from "../api_interface/apiCreate";
import Alert from "./Alert";
import {makeId} from "./utils";
import Modal from "./Modal";

export default function CreateableComponent({endpoint, data, FormViewComponent, callback, customCreateFunction = false}) {
    const [showForm, setShowForm] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [responseAlert, setResponseAlert] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    function createElement(validatedData) {
        apiCreate(
            endpoint,
            validatedData,
            (data) => {
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
                        setResponseAlert(<Alert key={makeId()}
                                                      text="Please check the field errors and try again."
                                                      type="danger" stick={false}
                                                      hideable={false} close={e => setResponseAlert(null)}/>)
                    } else {
                        setResponseAlert(<Alert key={makeId()} text={result.statusText} type="danger"
                                                      stick={false}
                                                      hideable={false} close={e => setResponseAlert(null)}/>)
                    }
                })
            })
    }

    function toggleShowForm() {
        setShowForm(!showForm);
        setResponseAlert(false);
        setFormErrors({});
    }

    function displayFormModal() {
        return (
            <Modal close={toggleShowForm}>
                <FormViewComponent
                    data={data}
                    createElement={createElement}
                    waiting={waiting}
                    responseAlert={responseAlert}
                    formErrors={formErrors}
                />
            </Modal>
        )
    }

    return (
        <Fragment>
            <button type="button" className="btn" onClick={e => toggleShowForm()}>add image</button>
            {showForm ? displayFormModal() : ''}
        </Fragment>
    )
}