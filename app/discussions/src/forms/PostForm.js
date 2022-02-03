import React, {Fragment, useState} from "react";
import Alert from "../../../src/components/Alert";
import {Textarea, FormElement} from "../../../src/components/form";

function PostForm({formData, setFormData, submitCallback, waiting, alert, errors, setAlert, setErrors, cancel=false}) {

    function validateForm(formData) {
        let vErrors = {}
        if (formData.text.length < 16 && !formData.parent) {
            vErrors['text'] = 'Your post is too short. Please use at least 16 characters.';
        }
        if (Object.keys(vErrors).length > 0) {
            setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"
                            hideable={false}/>)
            setErrors({...vErrors});
        } else {
            submitCallback(formData)
        }
    }


    return (
        <FormElement
            data={formData}
            callback={validateForm}
            alert={alert}
            waiting={waiting}
            cancel={cancel}
        >
            <Textarea id="text" label={false}
                      inputProps={{
                          placeholder: "Your post content here",
                          required: true,
                          value: formData.text,
                          onChange: e => setFormData({...formData, text: e.target.value}),
                          disabled: Boolean(waiting),
                      }}
                      error={errors.text}
            />
            <input type="hidden" name="parent" value={formData.parent}/>
        </FormElement>
    )
}

PostForm.contentType = 'json';
export default PostForm;