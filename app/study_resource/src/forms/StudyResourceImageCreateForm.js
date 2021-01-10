import React, {useState, useEffect, Fragment} from "react";
import {Input} from "../../../src/components/form";

export default function StudyResourceImageCreateForm({data, createElement, waiting, responseAlert, formErrors}) {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState(formErrors);
    const [alert, setAlert] = useState(responseAlert);

    useEffect(e=> {
        setAlert(responseAlert);
        setErrors(formErrors);
    }, [responseAlert, formErrors]);

    function validate(formData) {
        let validated_data = {...formData};
        delete validated_data.image_file;
        createElement(validated_data)
    }

    return (
        <form onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            validate(formData);
        }}>
            <img src={formData.image_url} alt=""/>
            <Input
                id={'image_url'}
                label="Image Url"
                inputProps={{
                    disabled: Boolean(waiting),
                    type: 'text',
                    value: formData.image_url,
                    onChange: e => setFormData({...formData, image_url: e.target.value})
                }}
                smallText="The main image url. Can be empty"
                error={errors.image_url}
            />
            {alert}
            {waiting
                ? waiting
                : <button className="btn submit" type="submit">Create</button>
            }
        </form>
    )
}