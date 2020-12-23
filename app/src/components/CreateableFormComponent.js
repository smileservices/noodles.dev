import React, {Fragment, useState} from 'react';
import apiCreate from "../api_interface/apiCreate";
import Alert from "./Alert";
import {makeId} from "./utils";

export default function CreateableFormComponent({endpoint, data, extraData, FormViewComponent, successCallback}) {
    const [waiting, setWaiting] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errors, setErrors] = useState({});

    function createElement(validatedData) {
        apiCreate(
            endpoint,
            validatedData,
            (data) => {
                let alert_text = (
                    <Fragment>
                        <span>Created successfully! You can see it </span>
                        <a href={data.absolute_url}>here</a>
                    </Fragment>
                )
                setAlert(<Alert text={alert_text} type="success"/>)
                successCallback(data);
            },
            setWaiting,
            result => {
                if (result.status === 500) {
                    setAlert(<Alert key={makeId()} text={result.statusText} type="danger"
                                        stick={true}
                                        hideable={false} close={e => setAlert(null)}/>)
                    return;
                }
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

    return (
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
    )
}