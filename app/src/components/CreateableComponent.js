import React, {useState, Fragment} from 'react';
import apiCreate from "../api_interface/apiCreate";
import Alert from "./Alert";
import {makeId} from "./utils";
import Modal from "./Modal";

export default function CreateableComponent({endpoint, data, extraData, FormViewComponent, successCallback}) {
    const [showForm, setShowForm] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errors, setErrors] = useState({});

    function toggleShowForm() {
        setAlert(false);
        setErrors({});
        setShowForm(!showForm);
    }

    function createElement(validatedData) {
        apiCreate(
            endpoint,
            validatedData,
            (data) => {
                successCallback(data);
                document.body.classList.remove('modal-open');
                toggleShowForm();
            },
            setWaiting,
            result => {
                result.json().then(errors => {
                    if (errors) {
                        let flattenedErrors = {};
                        Object.keys(errors).map(k => {
                            flattenedErrors[k] = [k].join('</br>');
                        })
                        setErrors(flattenedErrors);
                        setAlert(<Alert key={makeId()}
                                        text="Please check the field errors and try again."
                                        type="danger" stick={false}
                                        hideable={false} close={e => setAlert(null)}/>)
                    } else {
                        setAlert(<Alert key={makeId()} text={result.statusText} type="danger"
                                        stick={false}
                                        hideable={false} close={e => setAlert(null)}/>)
                    }
                })
            })
    }

    function displayFormModal() {
        return (
            <Modal close={toggleShowForm}>
                <FormViewComponent
                    data={data}
                    extraData={extraData}
                    submitCallback={createElement}
                    waiting={waiting}
                    alert={alert}
                    errors={errors}
                    setAlert={setAlert}
                    setErrors={setErrors}
                    setWaiting={setWaiting}
                />
            </Modal>
        )
    }

    return (
        <Fragment>
            <button type="button" className="btn" onClick={e => toggleShowForm()}>{extraData.addButtonText}</button>
            {showForm ? displayFormModal() : ''}
        </Fragment>
    )
}