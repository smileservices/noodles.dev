import React, {useState, useEffect, Fragment} from "react"

import {
    Input,
    Textarea,
    SelectReact,
} from "../../../src/components/form";
import {FormElement} from "../../../src/components/form";
import Alert from "../../../src/components/Alert";

function ConceptCategoryForm({formData, setFormData, extraData, submitCallback, waiting, alert, errors, setAlert, setErrors, setWaiting}) {
    const [categories, setCategories] = useState([]);
    const [options, setOptions] = useState([]);
    const [concepts, setConcepts] = useState([]);

    useEffect(() => {
        //get categories options
        fetch(
            CATEGORIES_OPTIONS_API, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve categories" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setCategories(data);
            }
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
            if (data) {
                if (formData.pk) {
                    //we filter out current concept (if editing)
                    data.concepts = data.concepts.filter(opt => opt['value'] !== formData.pk)
                }
                setOptions(data);
            }
        })
    }, []);

    // useEffect(e=>{
    //     if (!formData.category.value) return ()=>{};
    //     fetch(
    //         '/categories/api/' + formData.category['value'] + '/higher_concepts_options/', {method: 'GET'}
    //     ).then(result => {
    //         if (result.ok) {
    //             return result.json();
    //         } else {
    //             setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve parent category concepts" type="danger"/>);
    //             return false;
    //         }
    //     }).then(data => {
    //         if (data) {
    //             if (formData.pk) {
    //                 //we filter out current concept (if editing)
    //                 data = data.filter(opt => opt['value'] !== formData.pk)
    //             }
    //             setConcepts(data);
    //         }
    //     })
    // }, [formData.category])

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
        cpd.category = data.category.value
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
            <SelectReact name="select-category" label="Choose Category"
                         smallText="Choose a category"
                         onChange={selectedOption => setFormData({...formData, category: selectedOption})}
                         options={categories}
                         value={formData.category}
                         props={{isMulti: false}}
                         error={errors.category}
                         isDisabled={Boolean(waiting)}
            />
            <SelectReact name="select-parent" label="Choose Parent Concept (if any)"
                         smallText="A parent concept is a higher level category concept"
                         onChange={selectedOption => setFormData({...formData, parent: selectedOption})}
                         options={options.concepts}
                         value={formData.parent}
                         props={{isMulti: false}}
                         error={errors.parent}
                         isDisabled={Boolean(waiting)}
            />
            <Textarea name="description" label="Short Description"
                      inputProps={{
                          ...makeStateProps('description'),
                          placeholder: "Description",
                          required: true,
                          disabled: Boolean(waiting)
                      }}
                      smallText="Write a simple description of the concept"
                      error={errors.description}
            />
            <Textarea name="description-long" label="Long Description"
                      inputProps={{
                          ...makeStateProps('description_long'),
                          placeholder: "Long Description (use markdown)",
                          required: true,
                          disabled: Boolean(waiting),
                          rows: 25
                      }}
                      smallText="Write a long description using markdown."
                      error={errors.description_long}
            />
            {extraData.formElements ? extraData.formElements.get_list(waiting, errors) : ''}
        </FormElement>
    )
}

ConceptCategoryForm.contentType = 'json';
export default ConceptCategoryForm;