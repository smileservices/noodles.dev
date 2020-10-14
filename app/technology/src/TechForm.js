import React, {useState, useEffect, Fragment} from "react"

import {Input, Textarea, SelectReactCreatable} from "../../src/components/form";
import apiPost from "../../src/api_interface/apiPost";
import {FormElement} from "../../src/components/form";
import Alert from "../../src/components/Alert";

export default function TechForm({data, extraData, submitCallback, waiting, alert, errors, setAlert, setErrors, setWaiting}) {
    const emptyForm = {
        name: false,
        description: '',
        version: '',
        url: '',
        owner: '',
        pros: '',
        cons: '',
        limitations: '',
    };
    const [formData, setFormData] = useState(Object.assign(emptyForm, data));
    const [technologies, setTechnologies] = useState([]);

    useEffect(() => {
        //get technologies options
        fetch(
            TECH_OPTIONS_ENDPOINT, {method: 'GET'}
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

    function validate(formData, callback) {
        let vErr = {};
        if (formData.description.length < 30) vErr.description = 'Description is too short. It has to be at least 30 characters';
        if (formData.pros.length < 5) vErr.pros = 'Good points cannot be empty. Add at least 5 characters';
        if (formData.cons.length < 5) vErr.cons = 'Bad points cannot be empty. Add at least 5 characters';
        if (formData.limitations.length < 30) vErr.limitations = 'Limitations cannot be empty. Add at least 30 characters';
        if (formData.owner.length < 5) vErr.owner = 'Owner/Maintainer name is too short, has to be at least 5 characters';
        setErrors(vErr);
        if (Object.keys(vErr).length > 0) {
            setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"/>)
            return false;
        } else {
            setAlert('');
        }
        apiPost(
            TECH_ENDPOINT + 'validate_url/',
            {
                url: formData.url
            },
            setWaiting,
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not validate url" type="danger"/>)
                return false;
            }
        }).then(data => {
            if (!data) return false;
            if (data.error) {
                setErrors({...errors, url: data.message})
                return false;
            } else {
                setErrors({});
                return true;
            }
        }).then(valid => {
            if (valid) callback({...formData, name: formData.name.label});
        })
    }

    function getOptionFromTech() {
        let names = Array.from(new Set(technologies.map(tech => tech.name.toLowerCase())));
        return names.map(tech => {
            return {value: tech, label: tech}
        });
    }

    return (
        <FormElement
            data={formData}
            callback={
                formData => validate(formData, submitCallback)
            }
            alert={alert}
            waiting={waiting}
        >
            <h3>{extraData.formTitle}</h3>
            <div className="row">
                <SelectReactCreatable
                    id="select-name"
                    label="Name"
                    smallText="Can choose one name or add a new one if necessary."
                    value={formData['name']}
                    onChange={selected => setFormData({...formData, name: selected})}
                    options={getOptionFromTech()}
                    error={errors.name}
                />
                <Input id="version" label="Version" inputProps={{
                    ...makeStateProps('version'),
                    type: 'text',
                    disabled: Boolean(waiting)
                }}
                       smallText="The version of tech. Leave empty if it refers to all versions or not sure."
                       error={errors.version}
                />
            </div>
            <Textarea id="description" label={false}
                      inputProps={{
                          ...makeStateProps('description'),
                          placeholder: "Description",
                          required: true,
                          disabled: Boolean(waiting)
                      }}
                      smallText="Write about release date, what it is about or notable changes versus previous versions."
                      error={errors.description}
            />
            <Input id="url" label="Url" inputProps={{
                ...makeStateProps('url'),
                required: true,
                type: 'text',
                disabled: Boolean(waiting)
            }}
                   smallText="Url of docs or version page"
                   error={errors.url}
            />
            <Input id="owner" label="Tech Owner/Maintainer" inputProps={{
                ...makeStateProps('owner'),
                required: true,
                type: 'text',
                disabled: Boolean(waiting)
            }}
                   smallText="Who is owning or developing the tech"
                   error={errors.owner}
            />
            <Textarea id="pros" label={false}
                      inputProps={{
                          ...makeStateProps('pros'),
                          placeholder: "Good points",
                          required: true,
                          disabled: Boolean(waiting)
                      }}
                      smallText="What are the good parts of this tech?"
                      error={errors.pros}
            />
            <Textarea id="cons" label={false}
                      inputProps={{
                          ...makeStateProps('cons'),
                          placeholder: "Bad points",
                          required: true,
                          disabled: Boolean(waiting)
                      }}
                      smallText="What are the bad parts of this tech?"
                      error={errors.cons}
            />
            <Textarea id="limitations" label={false}
                      inputProps={{
                          ...makeStateProps('limitations'),
                          placeholder: "Limitations",
                          required: true,
                          disabled: Boolean(waiting)
                      }}
                      smallText="What are the limitations of this tech?"
                      error={errors.limitations}
            />
        </FormElement>
    )
}