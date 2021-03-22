import React, {useState, useEffect, Fragment} from "react"

import apiPost from "../../../src/api_interface/apiPost";
import Alert from "../../../src/components/Alert";
import {FormElement, Input} from "../../../src/components/form";

export default function CreateFormStep1({data, submit}) {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState(false);
    const [alert, setAlert] = useState('');

    function validate(formData) {
        apiPost(
            STUDY_RESOURCE_API + 'validate_url/',
            {
                url: formData.url
            },
            wait => wait ? setWaiting('Validating and extracting data from the URL') : setWaiting(false),
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not validate" type="danger"/>)
                return false;
            }
        }).then(data => {
            if (!data) return false;
            if (data.error) {
                setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"/>)
                setErrors({...errors, url: data.message})
                return false;
            } else return data;
            //    return parsed data from url and pass it to big formdata
        }).then(data => {
            if (data) submit(formData, data);
        })
    }

    return (
        <div className="form-container">
            <FormElement
                data={formData}
                callback={validate}
                alert={alert}
                waiting={waiting}>
                <Input
                    type="text"
                    id='inputurl'
                    label="URL"
                    inputProps={{
                        onChange: e => setFormData({...formData, url: e.target.value}),
                        value: formData.url,
                        required: true,
                        placeholder: "url",
                        disabled: Boolean(waiting)
                    }}
                    smallText="Resource source url"
                    error={errors.url}
                />
            </FormElement>
        </div>
    )
}