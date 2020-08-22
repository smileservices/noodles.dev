import React, {useState, useEffect, Fragment} from "react"

import Alert from "../../../src/components/Alert";
import {Input} from "../../../src/components/form";
import {SelectReactCreatable} from "../../../src/components/form";
import {Textarea} from "../../../src/components/form";
import apiCreate from "../../../src/api_interface/apiCreate";
import apiPost from "../../../src/api_interface/apiPost";

export default function CreateTech({techs, createdCallback, cancel}) {
    const emptyForm = {
        name: false,
        description: '',
        version: '',
        url: ''
    };
    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');

    function createTech(formData) {
        apiCreate(
            TECH_ENDPOINT,
            formData,
            data => createdCallback(data),
            setWaiting,
            result => result.json().then(data => {
                let errsCopy = {...errors};
                Object.keys(data).map(field => {
                    errsCopy[field] = data[field];
                })
                let alertContent = '';
                if (errsCopy.non_field_errors) {
                    alertContent = errsCopy.non_field_errors.map(err => (<p>{err}</p>));
                } else {
                    alertContent = "Something went wrong. Please check the error messages.";
                }
                if (alertContent) setAlert(<Alert text={alertContent} type="danger"/>);
                setErrors(errsCopy);
            })
        )
    }

    function validate(formData, callback) {
        if (formData.description.length < 30) {
            setErrors({...errors, description: "Should have at least 30 characters"});
            return false;
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
                setAlert(<Alert text="Could not validate" type="danger"/>)
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
            if (valid) callback({...formData, name: formData.name.value});
        })
    }

    function makeTechsOptions() {
        let names = Array.from(new Set(techs.map(tech => tech.name.toLowerCase())));
        return names.map(tech => {
            return {value: tech, label: tech}
        });
    }

    return (
        <div className="create-tech-container">
            <div className="toolbar">
                <span className="icon-close" onClick={cancel}/>
            </div>
            <h3>Add new technology</h3>
            {alert ? alert : ''}
            <form action="#" onSubmit={e => {
                e.preventDefault();
                validate(formData, createTech);
            }}>
                <div className="row">
                    <SelectReactCreatable
                        id="select-name"
                        label="Name"
                        smallText="Can choose one name or add a new one if necessary."
                        error={errors.name}
                        value={formData['name']}
                        onChange={selected => setFormData({...formData, name: selected})}
                        options={makeTechsOptions()}
                    />
                    <Input id="version" label="Version" inputProps={{
                        required: true,
                        type: 'text',
                        value: formData['version'],
                        onChange: e => setFormData({...formData, version: e.target.value})
                    }}
                           smallText="The version of tech"
                           error={errors.version}
                    />
                </div>
                <Textarea id="description" label={false}
                          inputProps={{
                              placeholder: "Description",
                              required: true,
                              value: formData.description,
                              onChange: e => setFormData({...formData, description: e.target.value}),
                          }}
                          smallText="Write about release date, what it is about or notable changes versus previous versions."
                          error={errors.description}
                />
                <Input id="url" label="Url" inputProps={{
                    required: true,
                    type: 'text',
                    value: formData['url'],
                    onChange: e => setFormData({...formData, url: e.target.value})
                }}
                       smallText="Url of docs or version page"
                       error={errors.url}
                />
                {waiting
                    ? waiting
                    : <button className="btn submit" type="submit">Add</button>
                }
            </form>
        </div>
    )
}