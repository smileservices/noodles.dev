import React, {useState, useEffect, Fragment} from "react";
import Alert from "../../../src/components/Alert";
import {FormElement, Input, SelectReact, SelectReactCreatable, Textarea} from "../../../src/components/form";
import apiPost from "../../../src/api_interface/apiPost";
import CreateTech from "../create/CreateTech";

import TechnologySelect from "../forms/TechnologySelect";

export default function StudyResourceEditForm({formData, setFormData, extraData, submitCallback, waiting, alert, errors, setAlert, setErrors, setWaiting}) {

    const emptyData = {
        'name': '',
        'url': '',
        'publication_date': '',
        'published_by': '',
        'summary': '',
        'tags': [],
        'technologies': [],
        'price': 0,
        'media': 0,
        'experience_level': 0,
    }

    const [tags, setTags] = useState({});
    const [techs, setTechs] = useState({});
    const [options, setOptions] = useState({});

    const [techForm, setTechForm] = useState(false);

    function makeStateProps(name) {
        function updateValue(name) {
            return e => {
                let clonedFormData = {...formData};
                clonedFormData[name] = e.target.value;
                setFormData(clonedFormData);
            }
        }

        return {
            onChange: updateValue(name),
            value: formData[name]
        }
    }


    useEffect(() => {
        //get tags, technologies and learning resource options (price/media/experience)
        fetch(
            TAGS_OPTIONS_API, {method: 'GET'}
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

        fetch(
            TECH_OPTIONS_API, {method: 'GET'}
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

        fetch(
            RESOURCE_API + 'options/', {method: 'GET'}
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
    }, []);

    function formatDate(dateStr) {
        let d = new Date(dateStr);
        return d.toISOString().substr(0, 10);
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

    function validate(normalizedData, callback) {
        let vErrors = {};
        apiPost(
            RESOURCE_API + 'validate_url/',
            {
                url: normalizedData.url,
                pk: normalizedData.pk
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
            if (normalizedData.name.length < 5) vErrors.name = 'Title is too short. It has to be at least 5 characters';
            if (normalizedData.published_by.length < 3) vErrors.published_by = 'Author name is too short. It has to be at least 3 characters';
            if (normalizedData.summary.length < 30) vErrors.summary = 'Summary is too short. It has to be at least 30 characters';

            if (typeof normalizedData.price !== 'number') vErrors.type = 'Required';
            if (typeof normalizedData.experience_level !== 'number') vErrors.experience_level = 'Required';
            if (typeof normalizedData.media !== 'number') vErrors.media = 'Required';

            if (!normalizedData.tags || normalizedData.tags.length === 0) vErrors.tags = 'Choose at least one tag';
            if (!normalizedData.technologies || normalizedData.technologies.length === 0) vErrors.technologies = 'Choose at least one technology';

            if (extraData.formElements) {
                extraData.formElements.validate(normalizedData, vErrors);
            }

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
            if (valid) callback(normalizedData);
        })
    }

    if (techForm) return <CreateTech
        techs={techs} cancel={e => setTechForm(false)}
        createdCallback={tech => {
            addTech(tech);
            setTechForm(false);
        }}/>

    return (
        <FormElement
            data={formData}
            callback={
                formData => validate(normalizeData(formData), submitCallback)
            }
            alert={alert}
            waiting={waiting}
        >
            <h3>{extraData.formTitle}</h3>
            <Input
                name={'name'}
                label="Title"
                inputProps={{...makeStateProps('name')}}
                smallText="Resource name"
                error={errors.name}
            />

            <Input
                type="text"
                name='inputurl'
                label="URL"
                inputProps={{...makeStateProps('url')}}
                smallText="Resource source url"
                error={errors.url}
            />

            <div className="row">
                <Input
                    name={'publication_date'}
                    label="Publishing Date"
                    inputProps={{...makeStateProps('publication_date')}}
                    smallText="Date the resource was published"
                    error={errors.publication_date}
                />
                <Input
                    name={'published_by'}
                    label="Author"
                    inputProps={{...makeStateProps('published_by')}}
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
                inputProps={{...makeStateProps('summary')}}
                smallText="What is it about"
                error={errors.summary}
            />
            {extraData.formElements ? extraData.formElements.get_list(waiting, errors) : ''}
        </FormElement>
    )
}