import React, {Fragment, useState} from "react";
import PostForm from "./PostForm";
import apiCreate from "../../../src/api_interface/apiCreate";
import Alert from "../../../src/components/Alert";

export default function PostCreateController({parent, successCallback, cancel = false}) {
    const emptyForm = {
        'text': '',
        'meta': {},
        'parent': parent
    }
    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const errorLogin = (<span>To create a discussion post you need to <a href={URLS.login}>Login or Register</a></span>);

    if (!IS_AUTHENTICATED) return errorLogin;

    function handleError(result) {
        if (result.status === 403) {
            setAlert(<Alert close={e => setAlert(null)} text={errorLogin} type={'danger'}/>);
        }
        result.json().then(data => {
            setAlert(<Alert close={e => setAlert(null)}
                            text={data.detail ? data.detail : "Could not submit post because we encountered an error"}
                            type={'danger'}/>);
        })
    }

    return (
        <PostForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            alert={alert}
            setAlert={setAlert}
            waiting={waiting}
            setWaiting={setWaiting}
            submitCallback={
                data => apiCreate(
                    RESOURCE_DISCUSSION_API_URL, data,
                    data => {
                        setFormData(emptyForm);
                        successCallback(data)
                    },
                    setWaiting, handleError, PostForm.contentType
                )
            }
            cancel={cancel}
        />
    )
}