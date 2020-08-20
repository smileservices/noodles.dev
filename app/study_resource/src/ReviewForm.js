import React, {Fragment, useState} from "react";
import Alert from "../../src/components/Alert";
import apiCreate from "../../src/api_interface/apiCreate";
import StarRating from "../../src/components/StarRating";
import {Textarea} from "../../src/components/form";

export default function ReviewForm({createReviewCallback}) {
    const emptyForm = {
        'study_resource': RESOURCE_ID,
        'rating': 0,
        'text': ''
    }
    const [formData, setFormData] = useState(emptyForm);
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [errors, setErrors] = useState({})


    function validateForm(formData) {
        let errs = {}
        if (!formData.rating) {
            errs['rating'] = 'Please give the resource a rating score';
        }
        if (formData.text.length < 50) {
            errs['text'] = 'Your review is too short. Please use at least 50 characters.';
        }
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return false;
        }
        return true;
    }

    function handleSuccess(data) {
        createReviewCallback(data);
    }

    function handleError(result) {
        result.json().then(data => {
            if (data.detail) {
                setAlert(<Alert text={data.detail} type={'danger'}/>);
            }
        })
    }

    if (waiting) {
        return waiting;
    }

    return (
        <Fragment>
            {alert}
            <form id="review_form" method="POST" onSubmit={e => {
                e.preventDefault();
                if (validateForm(formData)) {
                    apiCreate(REVIEW_API_ENDPOINT, formData, handleSuccess, setWaiting, handleError);
                }
            }
            }>
                <div className="form-group">
                    <div id="form_rating_stars">
                        <StarRating rating={formData.rating} maxRating={MAX_RATING}
                                    ratingChange={r => setFormData({...formData, rating: r})}/>
                        {errors.rating ? (<div className="invalid-feedback">{errors.rating}</div>) : ''}
                    </div>
                </div>
                <Textarea id="text" label={false}
                          inputProps={{
                              placeholder: "Write your review here",
                              required: true,
                              value: formData.text,
                              onChange: e => setFormData({...formData, text: e.target.value}),
                          }}
                          error={errors.text}
                />
                {USER_ID
                    ? <button type="submit" className="btn submit">Submit</button>
                    : <a className="login" href={LOGIN_URL}>Sign in to write review</a>
                }
            </form>
        </Fragment>
    )
}