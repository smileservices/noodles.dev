import React, {Fragment, useState} from "react";
import ReviewForm from "./ReviewForm";
import apiCreate from "../../../src/api_interface/apiCreate";

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

    function handleError(result) {
        result.json().then(data => {
            if (data.detail) {
                setAlert(<Alert close={e=>setAlert(null)} text={data.detail} type={'danger'}/>);
            }
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