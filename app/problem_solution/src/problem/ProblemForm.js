import React, {useState, useEffect} from "react";
import {FormElement, Input, Textarea} from "../../../src/components/form";
import {SelectReactCreatable} from "../../../src/components/form";
import Alert from "../../../src/components/Alert";

export default function ProblemForm({data, extraData, submitCallback, waiting, alert, errors, setAlert, setErrors, setWaiting}) {

    //todo add PARENT dropdown

    const emptyData = {
        'name': '',
        'description': '',
        'tags': [],
        'parent': false,
    }

    const [formData, setFormData] = useState(Object.assign({}, emptyData, data));
    const [tags, setTags] = useState([]);

    useEffect(() => {
        //get tags options
        fetch(
            TAGS_OPTIONS_ENDPOINT, {method: 'GET'}
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
        cpd.parent_id = data.parent.pk
        delete cpd.parent;
        return cpd
    }

    function validate(normalizedData) {
        let vErr = {};
        if (normalizedData.name.length < 5) vErr.name = 'Title is too short. It has to be at least 5 characters';
        if (normalizedData.description.length < 30) vErr.description = 'Description is too short. It has to be at least 30 characters';
        if (normalizedData.tags.length === 0) vErr.tags = 'Choose at least one tag';
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
        <FormElement data={formData}
                     callback={formData => validate(normalizeData(formData))
                         ? submitCallback(normalizeData(formData))
                         : formData => {}}
                     alert={alert}
                     waiting={waiting}
        >
            <Input type="text" name="name" label="Name"
                   inputProps={{...makeStateProps('name')}}
                   smallText="A title for the problem"
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
            { extraData.formElements ? extraData.formElements.get_list(formData, setFormData, waiting, errors) : '' }
        </FormElement>
    )
}