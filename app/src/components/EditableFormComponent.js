import React, {useState} from 'react';
import apiUpdate from "../api_interface/apiUpdate";
import Alert from "./Alert";
import {makeId} from "./utils";

export default function EditableFormComponent({endpoint, data, extraData, FormViewComponent, successCallback}) {
    const [waiting, setWaiting] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState(data);

    function updateElement(updatedData) {
        apiUpdate(
            endpoint, data.pk, updatedData,
            data => {
                successCallback(data);
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
            }, FormViewComponent.contentType)
    }

    return (
        <FormViewComponent
            formData={formData}
            setFormData={setFormData}
            extraData={extraData}
            submitCallback={updateElement}
            waiting={waiting}
            alert={alert}
            errors={errors}
            setAlert={setAlert}
            setErrors={setErrors}
            setWaiting={setWaiting}
        />
    )
}