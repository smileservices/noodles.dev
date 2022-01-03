import React, {useState, useEffect, Fragment} from "react"
import Alert from "../../src/components/Alert";
import {Input, Checkbox, SelectReact, SelectReactCreatable, Textarea, FormElement} from "../../src/components/form";

function CollectionForm({formData, setFormData, extraData, submitCallback, waiting, alert, errors, setAlert, setErrors, setWaiting}) {

    const [tags, setTags] = useState({});
    const [techs, setTechs] = useState({});

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
    }, []);

    function validate(normalizedData, callback) {
        let vErrors = {};
        if (normalizedData.name.length < 5) vErrors.name = 'Name is too short. It has to be at least 5 characters';
        if (normalizedData.description.length < 20) vErrors.description = 'Description is too short. It has to be at least 20 characters';
        if (!normalizedData.tags || normalizedData.tags.length === 0) vErrors.tags = 'Choose at least one tag';
        if (Object.keys(vErrors).length > 0) {
            setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"/>)
            setErrors({...vErrors});
            if (extraData.formElements) {
                extraData.formElements.validate(normalizedData, vErrors);
            }
        } else {
            submitCallback(normalizedData);
        }
    }

    function normalizeData(data) {
        let cpd = {...data};
        cpd.tags = data.tags.map(t => {
            return t.value
        });
        cpd.technologies = data.technologies ? data.technologies.map(t => {
            return t.value
        }) : [];
        return cpd;
    }

    return (
        <FormElement
            data={formData}
            callback={
                formData => validate(normalizeData(formData))
            }
            alert={alert}
            waiting={waiting}
        >
            <h3>{extraData.formTitle}</h3>
            <Input
                name={'name'}
                label="Name"
                inputProps={{...makeStateProps('name')}}
                error={errors.name}
            />
            <Checkbox name="is_public" label="Is Public" inputProps={{
                checked: formData.is_public,
                onChange: e => setFormData({...formData, 'is_public': !formData.is_public}),
                disabled: Boolean(waiting)
            }}
                   smallText="Public collections are searchable and open to anyone to receive edit suggestions"
                   error={errors.is_public}
            />
            <Textarea
                name={'description'}
                label="Description"
                inputProps={{...makeStateProps('description')}}
                error={errors.description}
            />
            <SelectReactCreatable id="select-tags" label="Choose tags"
                                  smallText="Can choose one or multiple or add a new one if necessary."
                                  onChange={selectedOptions => setFormData({...formData, tags: selectedOptions})}
                                  options={tags}
                                  value={formData.tags}
                                  props={{
                                      isMulti: true,
                                      disabled: Boolean(waiting),
                                  }}
                                  error={errors.tags}
            />
            <SelectReact id="select-techs" label="Choose technologies"
                         smallText={<span>Choose one or more technologies. </span>}
                         onChange={selectedOptions => setFormData({...formData, technologies: selectedOptions})}
                         options={techs}
                         value={formData.technologies}
                         props={{
                             isMulti: true,
                             disabled: Boolean(waiting),
                         }}
                         error={errors.technologies}
            />
            {extraData.formElements ? extraData.formElements.get_list(waiting, errors) : ''}
        </FormElement>
    );
}

CollectionForm.contentType = 'json';
export default CollectionForm;