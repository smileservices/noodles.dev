import React, {Fragment, useState} from "react";
import ReviewForm from "./ReviewForm";
import apiCreate from "../../../src/api_interface/apiCreate";
import Alert from "../../../src/components/Alert";

export default function ReviewCreateController({data, successCallback}) {
    const emptyForm = {
        'study_resource': data.resource_id,
        'rating': 0,
        'text': ''
    }
    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const errorLogin = (<span>To submit review you need to <a href={LOGIN_URL}>Login or Register</a></span>);

    if (!IS_AUTHENTICATED) return errorLogin;

    function handleError(result) {
        if (result.status === 403) {
            setAlert(<Alert close={e=>setAlert(null)} text={errorLogin} type={'danger'}/>);
        }
        result.json().then(data => {
            setAlert(<Alert close={e=>setAlert(null)} text={data.detail ? data.detail : "Could not submit review because we encountered an error"} type={'danger'}/>);
        })
    }

    return (
        <ReviewForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            alert={alert}
            setAlert={setAlert}
            waiting={waiting}
            setWaiting={setWaiting}
            submitCallback={data => apiCreate(REVIEW_API, data, successCallback, setWaiting, handleError, ReviewForm.contentType)}
        />
    )

}