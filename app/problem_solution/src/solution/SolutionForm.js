import React, {useEffect, useState} from "react";
import {FormElement, Input, Textarea, SelectReact, SelectReactCreatable} from "../../../src/components/form";
import Alert from "../../../src/components/Alert";
import TechForm from "../../../technology/src/TechForm";
import CreateableComponent from "../../../src/components/CreateableComponent";

export default function SolutionForm({formData, setFormData, extraData, submitCallback, waiting, alert, errors, setAlert, setErrors}) {
    const emptyData = {
        'name': '',
        'description': '',
        'tags': [],
        'technologies': [],
        'parent': null,
    }

    const [tags, setTags] = useState([]);
    const [technologies, setTechnologies] = useState([]);

    useEffect(() => {
        //get tags options
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
            if (data) {
                setTags(data);
            }
        })
        //get technologies options
        fetch(
            TECH_OPTIONS_API, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve technologies" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setTechnologies(data);
            }
        })
    }, []);

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

    function normalizeData(data) {
        let cpd = {...data};
        cpd.tags = data.tags.map(t => {
            return t.value
        });
        cpd.technologies = data.technologies.map(t => {
            return t.value
        });
        if (data.parent && data.parent.pk) {
            cpd.parent = data.parent.pk
        }
        return cpd
    }

    function validate(normalizedData) {
        let vErr = {};
        if (normalizedData.name.length < 5) vErr.name = 'Title is too short. It has to be at least 5 characters';
        if (normalizedData.description.length < 30) vErr.description = 'Description is too short. It has to be at least 30 characters';
        if (normalizedData.tags.length === 0) vErr.tags = 'Choose at least one tag';
        if (normalizedData.technologies.length === 0) vErr.tags = 'Choose at least one technology';
        if (extraData.formElements) {
            extraData.formElements.validate(normalizedData, vErr);
        }
        setErrors(vErr);
        if (Object.keys(vErr).length > 0) {
            setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"/>)
            return false;
        } else return true;
    }

    return (
        <FormElement
            data={formData}
            callback={
                formData => validate(normalizeData(formData))
                    ? submitCallback(normalizeData(formData))
                    : () => {}
            }
            alert={alert}
            waiting={waiting}>
            <Input type="text" name="name" label="Name"
                   inputProps={{...makeStateProps('name')}}
                   smallText="A title for the solution"
                   error={errors['name']}
            />
            <Textarea name="description" label="Description"
                      inputProps={{...makeStateProps('description')}}
                      smallText="A short description"
                      error={errors['description']}
            />
            <SelectReactCreatable name="select-tags" label="Choose tags"
                                  smallText="Can choose one or multiple or add a new one if necessary."
                                  onChange={selectedOptions => setFormData({...formData, tags: selectedOptions})}
                                  options={tags}
                                  value={formData.tags}
                                  props={{isMulti: true}}
                                  error={errors.tags}
            />
            <SelectReact name="select-techs" label="Choose technologies"
                         smallText="Can choose one or multiple."
                         onChange={selectedOptions => setFormData({...formData, technologies: selectedOptions})}
                         options={technologies}
                         value={formData.technologies}
                         props={{isMulti: true}}
                         error={errors.technologies}
            />
            <CreateableComponent
                endpoint={TECH_API}
                data={{}}
                extraData={{addButtonText: 'create technology', formTitle: 'Create New Technology'}}
                FormViewComponent={TechForm}
                successCallback={data=>setTechnologies([...technologies, {value: data.pk, label: data.name}])}
            />
            {extraData.formElements ? extraData.formElements.get_list(waiting, errors) : ''}
        </FormElement>
    )
}