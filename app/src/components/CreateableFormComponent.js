import React, {Fragment, useState} from 'react';
import apiCreate from "../api_interface/apiCreate";
import Alert from "./Alert";
import {makeId} from "./utils";

export default function CreateableFormComponent({endpoint, data, extraData, FormViewComponent, successCallback}) {
    const [waiting, setWaiting] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState(data);

    function createElement(validatedData) {
        apiCreate(
            endpoint,
            validatedData,
            successCallback,
            setWaiting,
            result => {
                if (result.status === 500) {
                    setAlert(<Alert key={makeId()} text={result.statusText} type="danger"
                                        stick={true}
                                        hideable={false} close={e => setAlert(null)}/>)
                    return;
                }
                result.json().then(data => {
                    if (data.error) {
                        let flattenedErrors = {};
                        Object.keys(data.error).map(k => {
                            flattenedErrors[k] = data.error[k];
                        })
                        setErrors(flattenedErrors);
                        let errorMessage = 'Please check the field errors and try again';
                        setAlert(<Alert key={makeId()}
                                        text={data.error.detail ? `${errorMessage}: ${data.error.detail}` : errorMessage}
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
            submitCallback={createElement}
            waiting={waiting}
            alert={alert}
            errors={errors}
            setAlert={setAlert}
            setErrors={setErrors}
            setWaiting={setWaiting}
        />
    )
}