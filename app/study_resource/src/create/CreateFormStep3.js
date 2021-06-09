import React, {useState, useEffect, Fragment} from "react"
import Alert from "../../../src/components/Alert";
import {
    Input,
    Checkbox,
    Textarea,
    SelectReact,
    FormElement,
    SelectReactCreatable,
    ImageInputComponent
} from "../../../src/components/form";
import {makeId} from "../../../src/components/utils";

export default function CreateFormStep3({data, options, categories, submit, waiting}) {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState('');

    function validate(formData) {
        let vErrors = {}
        if (formData.name.length < 5) vErrors.name = 'Title is too short. It has to be at least 5 characters';
        if (formData.published_by.length < 3) vErrors.author = 'Author name is too short. It has to be at least 3 characters';
        if (formData.summary.length < 30) vErrors.summary = 'Summary is too short. It has to be at least 30 characters';
        if (!formData.type) vErrors.type = 'Required';
        if (!formData.category) vErrors.category = 'Required';
        if (!formData.experience_level) vErrors.experience_level = 'Required';
        if (!formData.media) vErrors.media = 'Required';
        if (Object.keys(vErrors).length > 0) {
            setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"/>)
            setErrors(vErrors);
        } else submit(formData);
    }

    return (
        <div className="form-container">
            <FormElement
                data={formData}
                callback={validate}
                alert={alert}
                waiting={waiting}>

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
                <SelectReactCreatable name="select-category" label="Choose Category"
                                      smallText="Can choose or add a new one if necessary."
                                      onChange={selectedOptions => setFormData({
                                          ...formData,
                                          category: selectedOptions
                                      })}
                                      options={categories}
                                      value={formData.category}
                                      props={{isMulti: false, required: true}}
                                      error={errors.category}
                />
                <div className="row">
                    <SelectReact label='Type'
                                 value={formData.type}
                                 error={errors.type}
                                 options={options.type}
                                 onChange={sel => setFormData({...formData, type: sel})}
                                 isDisabled={Boolean(waiting)}
                                 smallText="Free or paid"
                    />
                    <SelectReact label='Media'
                                 value={formData.media}
                                 error={errors.media}
                                 options={options.media}
                                 onChange={sel => setFormData({...formData, media: sel})}
                                 isDisabled={Boolean(waiting)}
                                 smallText="Media type"
                    />
                    <SelectReact label='Experience level'
                                 value={formData.experience_level}
                                 error={errors.experience_level}
                                 options={options.experience_level}
                                 onChange={sel => setFormData({...formData, experience_level: sel})}
                                 isDisabled={Boolean(waiting)}
                                 smallText="Experience level required"
                    />
                </div>
                <div className="primary-image-container">
                    <Checkbox label="Use Screenshot as Primary Image" name="image_screenshot"
                              smallText="If checked, we will use as Primary Image a screenshot of the resource url.
                              Otherwise please either upload an image or choose an image url"
                              inputProps={{
                                  checked: formData.image_screenshot,
                                  onChange: e => setFormData({...formData, image_screenshot: e.target.checked})
                              }}
                    />
                    {formData.image_screenshot ? '' :
                        <ImageInputComponent
                            data={formData.image_file}
                            setValue={valueObj => setFormData({...formData, image_file: valueObj})}
                            inputProps={{
                                'name': 'image_file',
                                'label': 'Primary Image',
                                'error': errors.image_file,
                                'smallText': 'Primary image of the resource',
                                'originalImage': false
                            }}
                            disabled={Boolean(waiting)}
                        />
                    }
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
            </FormElement>
        </div>
)
}