import React, {useState, useEffect, Fragment} from "react"

import apiPost from "../../../src/api_interface/apiPost";
import Alert from "../../../src/components/Alert";
import {Input, Textarea, SelectReact} from "../../../src/components/form";

export default function CreateFormStep3({data, options, submit, waiting}) {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState('');

    function validate(formData, callback) {
        let vErrors = {}
        if (formData.name.length < 5) vErrors.name = 'Title is too short. It has to be at least 5 characters';
        if (formData.published_by.length < 3) vErrors.author = 'Author name is too short. It has to be at least 3 characters';
        if (formData.summary.length < 30) vErrors.summary = 'Summary is too short. It has to be at least 30 characters';
        if (!formData.type) vErrors.type = 'Required';
        if (!formData.experience_level) vErrors.experience_level = 'Required';
        if (!formData.media) vErrors.media = 'Required';
        if (Object.keys(vErrors).length > 0) {
            setAlert(<Alert text="Please fix the form errors" type="danger"/>)
            setErrors(vErrors);
        } else callback(formData);
    }

    function getOptions(name) {
        return options[name].map(o => {
            return {value: o[0], label: o[1]}
        });
    }

    return (
        <div className="form-container">
            <form action="#" onSubmit={e => {
                e.preventDefault();
                validate(formData, submit);
            }}>
                <Input
                    id={'name'}
                    label="Title"
                    inputProps={{
                        disabled: Boolean(waiting),
                        type: 'text',
                        required: true,
                        value: formData.name,
                        onChange: e => setFormData({...formData, name: e.target.value})
                    }}
                    smallText="Resource name"
                    error={errors.name}
                />
                <div className="row">
                    <Input
                        id={'publication_date'}
                        label="Publishing Date"
                        inputProps={{
                            disabled: Boolean(waiting),
                            type: 'date',
                            required: true,
                            value: formData.publication_date,
                            onChange: e => setFormData({...formData, publication_date: e.target.value})
                        }}
                        smallText="Date the resource was published"
                        error={errors.publication_date}
                    />
                    <Input
                        id={'published_by'}
                        label="Author"
                        inputProps={{
                            disabled: Boolean(waiting),
                            type: 'text',
                            required: true,
                            value: formData.published_by,
                            onChange: e => setFormData({...formData, published_by: e.target.value})
                        }}
                        smallText="Who is the author of the resource"
                        error={errors.published_by}
                    />
                </div>
                <div className="row">
                    <SelectReact label='Type'
                                 value={formData.type}
                                 error={errors.type}
                                 options={getOptions('type')}
                                 onChange={sel => setFormData({...formData, type: sel})}
                                 props={{disabled:Boolean(waiting)}}
                                 smallText="Free or paid"
                    />
                    <SelectReact label='Media'
                                 value={formData.media}
                                 error={errors.media}
                                 options={getOptions('media')}
                                 onChange={sel => setFormData({...formData, media: sel})}
                                 props={{disabled:Boolean(waiting)}}
                                 smallText="Media type"
                    />
                    <SelectReact label='Experience level'
                                 value={formData.experience_level}
                                 error={errors.experience_level}
                                 options={getOptions('experience_level')}
                                 onChange={sel => setFormData({...formData, experience_level: sel})}
                                 props={{disabled:Boolean(waiting)}}
                                 smallText="Experience level required"
                    />
                </div>
                <Textarea
                    id={'summary'}
                    label="Summary"
                    inputProps={{
                        disabled: Boolean(waiting),
                        required: true,
                        value: formData.summary,
                        onChange: e => setFormData({...formData, summary: e.target.value})
                    }}
                    smallText="What is it about"
                    error={errors.summary}
                />
                { alert }
                {waiting
                    ? waiting
                    : <button className="btn submit" type="submit">Publish</button>
                }
            </form>
        </div>
    )
}