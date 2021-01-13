import React, {useState, useEffect, Fragment} from "react"

import {Input, Textarea, SelectReact} from "../../src/components/form";
import apiPost from "../../src/api_interface/apiPost";
import {FormElement} from "../../src/components/form";
import Alert from "../../src/components/Alert";

export default function TechForm({formData, setFormData, extraData, submitCallback, waiting, alert, errors, setAlert, setErrors, setWaiting}) {
    const emptyForm = {
        name: '',
        description: '',
        url: '',
        owner: '',
        pros: '',
        cons: '',
        limitations: '',
    };
    const [technologies, setTechnologies] = useState([]);

    useEffect(() => {
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

    function validate(formData, callback) {
        let vErr = {};
        if (formData.description.length < 30) vErr.description = 'Description is too short. It has to be at least 30 characters';
        if (formData.pros.length < 5) vErr.pros = 'Good points cannot be empty. Add at least 5 characters';
        if (formData.cons.length < 5) vErr.cons = 'Bad points cannot be empty. Add at least 5 characters';
        if (formData.limitations.length < 30) vErr.limitations = 'Limitations cannot be empty. Add at least 30 characters';
        if (formData.owner.length < 5) vErr.owner = 'Owner/Maintainer name is too short, has to be at least 5 characters';
        if (extraData.formElements) {
            extraData.formElements.validate(formData, vErr);
        }
        setErrors(vErr);
        if (Object.keys(vErr).length > 0) {
            setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"/>)
            return false;
        } else {
            setAlert('');
        }
        apiPost(
            TECH_API + 'validate_url/',
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
            if (valid) callback(formData);
        })
    }

    function normalizeData(data) {
        let cpd = {...data};
        cpd.ecosystem = data.ecosystem.map(t => {
            return t.value
        });
        return cpd
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
            <Input id="name" label="Name" inputProps={{
                ...makeStateProps('name'),
                type: 'text',
                disabled: Boolean(waiting)
            }}
                   smallText="The name of the technology. Don't add version."
                   error={errors.version}
            />
            <Textarea id="description" label={false}
                      inputProps={{
                          ...makeStateProps('description'),
                          placeholder: "Description",
                          required: true,
                          disabled: Boolean(waiting)
                      }}
                      smallText="Write about release date, what problem it solves, how it does it"
                      error={errors.description}
            />
            <Input id="url" label="Url" inputProps={{
                ...makeStateProps('url'),
                required: true,
                type: 'text',
                disabled: Boolean(waiting)
            }}
                   smallText="Url of docs or main page"
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
            <SelectReact name="select-tags" label="Ecosystem"
                         smallText="The other technologies it's dependant on."
                         onChange={selectedOptions => setFormData({...formData, ecosystem: selectedOptions})}
                         options={technologies}
                         value={formData.ecosystem}
                         props={{isMulti: true}}
                         error={errors.ecosystem}
            />
            {extraData.formElements ? extraData.formElements.get_list(waiting, errors) : ''}
        </FormElement>
    )
}