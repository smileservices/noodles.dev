import React, {useState, useEffect, Fragment} from "react"

import {
    Input,
    Textarea,
    SelectReact,
} from "../../../src/components/form";
import {FormElement} from "../../../src/components/form";
import Alert from "../../../src/components/Alert";

function ConceptTechnologyForm({formData, setFormData, extraData, submitCallback, waiting, alert, errors, setAlert, setErrors, setWaiting}) {
    const [options, setOptions] = useState([]);
    const [concepts, setConcepts] = useState([]);

    useEffect(() => {
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

    useEffect(e => {
        if (!formData.technology.value) return false;
        fetch(
            '/categories/api/' + formData.technology.value + '/technology_higher_concepts_options/', {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve technology category concepts"
                                type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                if (formData.pk) {
                    //we filter out current concept (if editing)
                    data = data.filter(opt => opt['value'] !== formData.pk)
                }
                setConcepts(data);
            }
        })
    }, [formData.technology])

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

    function validate(normalizedData, callback) {
        let vErr = {};
        if (normalizedData.description.length < 30) vErr.description = 'Description is too short. It has to be at least 30 characters';
        if (extraData.formElements) {
            extraData.formElements.validate(normalizedData, vErr);
        }
        setErrors(vErr);
        if (Object.keys(vErr).length > 0) {
            setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"/>)
            return false;
        } else {
            setAlert('');
        }
        callback(normalizedData);
    }

    function normalizeData(data) {
        let cpd = {...data};
        cpd.technology = data.technology.value
        if (cpd.parent) {
            cpd.parent = data.parent.value
        }
        return cpd;
    }

    return (
        <FormElement
            data={formData}
            callback={
                formData => validate(normalizeData(formData), submitCallback)
            }
            alert={alert}
            waiting={waiting}
        >
            {extraData.formTitle ? <h3>{extraData.formTitle}</h3> : ''}
            <Input name="name" label="Name" inputProps={{
                ...makeStateProps('name'),
                type: 'text',
                disabled: Boolean(waiting)
            }}
                   smallText="The name of the concept"
                   error={errors.name}
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
            <SelectReact name="select-technology" label="Technology"
                         smallText="This is a technology concept. It relates to a specific technology. Please choose one."
                         onChange={selectedOption => setFormData({...formData, technology: selectedOption})}
                         options={options.technologies}
                         value={formData.technology}
                         props={{isMulti: false}}
                         error={errors.technology}
                         isDisabled={Boolean(waiting)}
            />
            <Textarea name="description" label={false}
                      inputProps={{
                          ...makeStateProps('description'),
                          placeholder: "Description",
                          required: true,
                          disabled: Boolean(waiting)
                      }}
                      smallText="Write a simple description of the concept"
                      error={errors.description}
            />
            <SelectReact name="select-parent" label="Parent Concept (optional)"
                         smallText="A parent concept is a higher level category concept."
                         onChange={selectedOption => setFormData({...formData, parent: selectedOption})}
                         options={concepts}
                         value={formData.parent}
                         props={{isMulti: false}}
                         error={errors.parent}
                         isDisabled={Boolean(waiting)}
            />
            {extraData.formElements ? extraData.formElements.get_list(waiting, errors) : ''}
        </FormElement>
    )
}

ConceptTechnologyForm.contentType = 'json';
export default ConceptTechnologyForm;