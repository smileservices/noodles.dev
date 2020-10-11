import React, {useState} from "react";
import {FormElement, Input, Textarea} from "../../../src/components/form";
import {SelectReactCreatable} from "../../../src/components/form";

export default function ProblemForm({data, tags, callback, alert, waiting, errors}) {
    const emptyData = {
        'name': '',
        'description': '',
        'tags': [],
        'parent': false,
    }
    const [formData, setFormData] = useState(Object.assign({}, emptyData, data));

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

    const getOptionFromTag = data => {
        return {value: data.pk, label: data.name}
    };

    return (
        <FormElement data={formData} callback={callback} alert={alert} waiting={waiting}>
            <Input type="text" name="name" label="Name"
                   inputProps={{...makeStateProps('name'), defaultValue: data['name']}}
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
                                  options={tags.map(tag => getOptionFromTag(tag))}
                                  value={formData.tags}
                                  props={{isMulti: true}}
                                  error={errors.tags}
            />
        </FormElement>
    )
}