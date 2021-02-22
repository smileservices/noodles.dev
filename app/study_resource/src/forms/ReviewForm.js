import React, {Fragment, useState} from "react";
import Alert from "../../../src/components/Alert";
import StarRating from "../../../src/components/StarRating";
import {Textarea, FormElement} from "../../../src/components/form";

function ReviewForm({formData, setFormData, extraData, submitCallback, waiting, alert, errors, setAlert, setErrors, setWaiting}) {

    function validateForm(formData) {
        let vErrors = {}
        if (!formData.rating) {
            vErrors['rating'] = 'Please give the resource a rating score';
        }
        if (formData.text.length < 50) {
            vErrors['text'] = 'Your review is too short. Please use at least 50 characters.';
        }
        if (Object.keys(vErrors).length > 0) {
            setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"
                            hideable={false}/>)
            setErrors({...vErrors});
        }
        submitCallback(formData)
    }


    return (
        <FormElement
            data={formData}
            callback={validateForm}
            alert={alert}
            waiting={waiting}
        >
            <div className="form-group">
                <div id="form_rating_stars">
                    <StarRating rating={formData.rating} maxRating={MAX_RATING}
                                ratingChange={r => setFormData({...formData, rating: r})}
                                isDisabled={Boolean(waiting)}
                    />
                    {errors.rating ? (<div className="invalid-feedback">{errors.rating}</div>) : ''}
                </div>
            </div>
            <Textarea id="text" label={false}
                      inputProps={{
                          placeholder: "Write your review here",
                          required: true,
                          value: formData.text,
                          onChange: e => setFormData({...formData, text: e.target.value}),
                          disabled: Boolean(waiting),
                      }}
                      error={errors.text}
            />
        </FormElement>
    )
}

ReviewForm.contentType = 'json';
export default ReviewForm;