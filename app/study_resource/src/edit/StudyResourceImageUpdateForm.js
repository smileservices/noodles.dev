import React, {useState, useEffect, Fragment} from "react";
import {Input} from "../../../src/components/form";

export default function StudyResourceImageUpdateForm({data, updateElement, waiting, responseAlert, formErrors}) {
    const [imageFormData, setImageFormData] = useState(data);
    const [errors, setErrors] = useState(formErrors);
    const [alert, setAlert] = useState(responseAlert);

    useEffect(e=> {
        setAlert(responseAlert);
        setErrors(formErrors);
    }, [responseAlert, formErrors]);

    function validate(imageFormData) {
        let validated_data = {...imageFormData};
        validated_data.image_file = false;
        updateElement(validated_data)
    }

    return (
        <form onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            validate(imageFormData);
        }}>
            <img src={imageFormData.image_url} alt=""/>
            <Input
                id={'image_url'}
                label="Image Url"
                inputProps={{
                    disabled: Boolean(waiting),
                    type: 'text',
                    value: imageFormData.image_url,
                    onChange: e => setImageFormData({...imageFormData, image_url: e.target.value})
                }}
                smallText="The main image url. Can be empty"
                error={errors.image_url}
            />
            {alert}
            {waiting
                ? waiting
                : <button className="btn submit" type="submit">Update</button>
            }
        </form>
    )
}