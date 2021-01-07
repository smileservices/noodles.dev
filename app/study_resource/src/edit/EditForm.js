import React, {useState, useEffect, Fragment} from "react";
import Alert from "../../../src/components/Alert";
import {Input, SelectReact, SelectReactCreatable, Textarea} from "../../../src/components/form";
import apiPost from "../../../src/api_interface/apiPost";
import apiUpdate from "../../../src/api_interface/apiUpdate";
import CreateTech from "../create/CreateTech";

import StudyResourceImageUpdateForm from "./StudyResourceImageUpdateForm";
import StudyResourceImageCreateForm from "./StudyResourceImageCreateForm";

import TechnologySelect from "../TechnologySelect";

export default function EditDetailForm({addEditSuggestion}) {

    /*
    *   TODO refactor using the reusable FormElement + ResourceForm paradigm
    *   TODO handle images
    *
    *
    * */

    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [tags, setTags] = useState({});
    const [techs, setTechs] = useState({});
    const [options, setOptions] = useState({});

    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [techForm, setTechForm] = useState(false);

    function resetForm() {
        setFormData({
            ...originalData,
            'edit_suggestion_reason': ''
        });

    }


    useEffect(() => {
        //get tags and technologies
        let tagsPromise = fetch(
            TAG_OPTIONS_ENDPOINT, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve tags" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) setTags(data);
        })

        let techsPromise = fetch(
            TECH_OPTIONS_ENDPOINT, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve tags" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) setTechs(data);
        })

        let optionsPromise = fetch(
            STUDY_RESOURCE_ENDPOINT + 'options/', {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve options" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) setOptions(data);
        })

        fetch(
            RESOURCE_DETAIL, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve study resource" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setFormData(data);
                setOriginalData(data);
            }
        })
    }, []);

    function validate(formData, callback) {
        let vErrors = {};
        apiPost(
            STUDY_RESOURCE_ENDPOINT + 'validate_url/',
            {
                url: formData.url,
                pk: formData.pk
            },
            setWaiting,
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert text="Could not validate url" type="danger" close={e => setAlert(null)}
                                hideable={false}/>)
                return false;
            }
        }).then(data => {
            if (data.error) {
                vErrors.url = data.message
                return false;
            } else return data;
        }).then(valid => {
            if (formData.name.length < 5) vErrors.name = 'Title is too short. It has to be at least 5 characters';
            if (formData.published_by.length < 3) vErrors.published_by = 'Author name is too short. It has to be at least 3 characters';
            if (formData.summary.length < 30) vErrors.summary = 'Summary is too short. It has to be at least 30 characters';

            if (typeof formData.price !== 'number') vErrors.type = 'Required';
            if (typeof formData.experience_level !== 'number') vErrors.experience_level = 'Required';
            if (typeof formData.media !== 'number') vErrors.media = 'Required';

            if (!formData.tags || formData.tags.length === 0) vErrors.tags = 'Choose at least one tag';
            if (!formData.technologies || formData.technologies.length === 0) vErrors.technologies = 'Choose at least one technology';
            if (!formData.edit_suggestion_reason) vErrors.edit_suggestion_reason = 'Please write a reason for editing the current resource.';
            if (!valid || Object.keys(vErrors).length > 0) {
                setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"
                                hideable={false}/>)
                setErrors({...vErrors});
                return false
            } else {
                setErrors({});
                return true;
            }
        }).then(valid => {
            if (valid) callback(formData);
        })
    }

    function normalizeData(data) {
        let cpd = {...data};
        cpd.tags = data.tags.map(t => {
            return t.value
        });
        cpd.technologies = data.technologies.map(t => {
            return {pk: t.technology_id, version: t.version};
        });
        cpd.publication_date = formatDate(data.publication_date);
        return cpd;
    }

    function submit(formData) {
        setAlert('');
        apiUpdate(
            STUDY_RESOURCE_ENDPOINT,
            formData.pk,
            normalizeData(formData),
            data => {
                // handle differently if it's edit suggestion or direct update
                if (data['edit_suggestion_author']) {
                    setAlert(<Alert close={e => setAlert(null)} text="Successfully created an edit suggestion"
                                    type="success"
                                    hideable={false}/>)
                    resetForm();
                    addEditSuggestion(data);
                } else {
                    setAlert(<Alert close={e => setAlert(null)} text="Successfully edited the resource" type="success"
                                    hideable={false}/>)
                    setFormData(data);
                }
            },
            setWaiting,
            result => {
                result.json().then(
                    body => setAlert(<Alert close={e => setAlert(null)} text={body.detail} type="danger"
                                            hideable={false}
                                            stick={true}/>)
                )
            }
        )
    }

    function formatDate(dateStr) {
        let d = new Date(dateStr);
        return d.toISOString().substr(0, 10);
    }

    if (techForm) return <CreateTech
        techs={techs} cancel={e => setTechForm(false)}
        createdCallback={tech => {
            addTech(tech);
            setTechForm(false);
        }}/>

    return (
        <form onSubmit={e => {
                e.preventDefault();
                validate(formData, submit);
            }}>
            <div className="header"><h3>Edit resource</h3></div>
                <Input
                    name={'name'}
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

                <Input
                    type="text"
                    name='inputurl'
                    label="URL"
                    inputProps={{
                        disabled: Boolean(waiting),
                        onChange: e => setFormData({...formData, url: e.target.value}),
                        value: formData.url,
                        required: true,
                        placeholder: "url"
                    }}
                    smallText="Resource source url"
                    error={errors.url}
                />

                <div className="row">
                    <Input
                        name={'publication_date'}
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
                        name={'published_by'}
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
                <SelectReactCreatable name="select-tags" label="Choose tags"
                                      smallText="Can choose one or multiple or add a new one if necessary."
                                      onChange={selectedOptions => setFormData({...formData, tags: selectedOptions})}
                                      options={tags}
                                      value={formData.tags}
                                      props={{isMulti: true}}
                                      error={errors.tags}
                                      isDisabled={Boolean(waiting)}
                />

                <TechnologySelect techs={techs}
                                  values={formData.technologies}
                                  setTechnologies={techs => setFormData({...formData, technologies: techs})}
                                  addNewTech={data => setTechs([...techs, {value: data.pk, label: data.name}])}
                                  waiting={waiting}
                                  errors={errors}
                />

                <div className="row">
                    <SelectReact label='Type'
                                 name='price-type'
                                 value={options['price'] ? options['price'].filter(i => i.value === formData.price) : {}}
                                 error={errors.type}
                                 options={options['price']}
                                 onChange={sel => setFormData({...formData, price: sel.value})}
                                 smallText="Free or paid"
                                 isDisabled={Boolean(waiting)}
                    />
                    <SelectReact label='Media'
                                 name='media'
                                 value={options['media'] ? options['media'].filter(i => i.value === formData.media) : {}}
                                 error={errors.media}
                                 options={options['media']}
                                 onChange={sel => setFormData({...formData, media: sel.value})}
                                 smallText="Media type"
                                 isDisabled={Boolean(waiting)}
                    />
                    <SelectReact label='Experience level'
                                 name='experience-level'
                                 value={options['experience_level'] ? options['experience_level'].filter(i => i.value === formData.experience_level) : {}}
                                 error={errors.experience_level}
                                 options={options['experience_level']}
                                 onChange={sel => setFormData({...formData, experience_level: sel.value})}
                                 smallText="Experience level required"
                                 isDisabled={Boolean(waiting)}
                    />
                </div>
                <Textarea
                    name={'summary'}
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

                <Textarea
                    name={'edit_suggestion_reason'}
                    label="Edit Reason"
                    inputProps={{
                        disabled: Boolean(waiting),
                        required: true,
                        value: formData.edit_suggestion_reason,
                        onChange: e => setFormData({...formData, edit_suggestion_reason: e.target.value})
                    }}
                    smallText="Short reason of why create this edit"
                    error={errors.edit_suggestion_reason}
                />

                {alert ? alert : ''}
                {waiting
                    ? waiting
                    : <button className="btn submit" type="submit">Update</button>
                }
        </form>
    )
}