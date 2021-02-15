import React, {useState, useEffect, Fragment} from "react"

import {Input, Textarea, SelectReact, SelectReactCreatable, ImageInputComponent} from "../../src/components/form";
import apiPost from "../../src/api_interface/apiPost";
import {FormElement, ImageInput} from "../../src/components/form";
import Alert from "../../src/components/Alert";

function TechForm({formData, setFormData, extraData, submitCallback, waiting, alert, errors, setAlert, setErrors, setWaiting}) {

    const [technologies, setTechnologies] = useState([]);
    const [categories, setCategories] = useState([]);


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

    function validate(normalizedData, callback) {
        let vErr = {};
        if (normalizedData.description.length < 30) vErr.description = 'Description is too short. It has to be at least 30 characters';
        if (normalizedData.pros.length < 5) vErr.pros = 'Good points cannot be empty. Add at least 5 characters';
        if (normalizedData.cons.length < 5) vErr.cons = 'Bad points cannot be empty. Add at least 5 characters';
        if (normalizedData.limitations.length < 30) vErr.limitations = 'Limitations cannot be empty. Add at least 30 characters';
        if (normalizedData.owner.length < 5) vErr.owner = 'Owner/Maintainer name is too short, has to be at least 5 characters';
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
        apiPost(
            TECH_API + 'validate_url/',
            {
                url: normalizedData.url
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
            if (valid) callback(makeFormData(normalizedData));
        })
    }

    function makeFormData(data) {
        let packagedData = new FormData();
        Object.keys(data).map(value => packagedData.append(value, data[value]));
        return packagedData;
    }

    function normalizeData(data) {
        let cpd = {...data};
        cpd.ecosystem = data.ecosystem.map(t => {
            return t.value
        });
        cpd.category = data.category.value;
        if (cpd.image_file.file) {
            cpd.image_file = cpd.image_file.file;
            delete cpd.image_url;
        }
        if (cpd.image_file.url) {
            cpd.image_url = cpd.image_file.url;
            delete cpd.image_file;
        }
        if (cpd.image_file === {}) {
            delete cpd.image_file;
            delete cpd.image_url;
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
                   smallText="The name of the technology. Don't add version."
                   error={errors.name}
            />

            <ImageInputComponent
                data={formData.image_file}
                setValue={valueObj => setFormData({...formData, image_file: valueObj})}
                inputProps={{
                    'name': 'image_file',
                    'label': 'Logo',
                    'error': errors.image_file,
                    'waiting': waiting,
                    'smallText': 'The logo of the technology',
                    'originalImage': extraData.originalData?.image_file ? extraData.originalData.image_file.small : false
                }}
            />

            <Textarea name="description" label={false}
                      inputProps={{
                          ...makeStateProps('description'),
                          placeholder: "Description",
                          required: true,
                          disabled: Boolean(waiting)
                      }}
                      smallText="Write about release date, what problem it solves, how it does it"
                      error={errors.description}
            />
            <Input name="url" label="Url" inputProps={{
                ...makeStateProps('url'),
                required: true,
                type: 'text',
                disabled: Boolean(waiting)
            }}
                   smallText="Url of docs or main page"
                   error={errors.url}
            />
            <Input name="owner" label="Tech Owner/Maintainer" inputProps={{
                ...makeStateProps('owner'),
                required: true,
                type: 'text',
                disabled: Boolean(waiting)
            }}
                   smallText="Who is owning or developing the tech"
                   error={errors.owner}
            />
            <Textarea name="pros" label={false}
                      inputProps={{
                          ...makeStateProps('pros'),
                          placeholder: "Good points",
                          required: true,
                          disabled: Boolean(waiting)
                      }}
                      smallText="What are the good parts of this tech?"
                      error={errors.pros}
            />
            <Textarea name="cons" label={false}
                      inputProps={{
                          ...makeStateProps('cons'),
                          placeholder: "Bad points",
                          required: true,
                          disabled: Boolean(waiting)
                      }}
                      smallText="What are the bad parts of this tech?"
                      error={errors.cons}
            />
            <Textarea name="limitations" label={false}
                      inputProps={{
                          ...makeStateProps('limitations'),
                          placeholder: "Limitations",
                          required: true,
                          disabled: Boolean(waiting)
                      }}
                      smallText="What are the limitations of this tech?"
                      error={errors.limitations}
            />
            <SelectReactCreatable name="select-category" label="Choose Category"
                                  smallText="Can choose or add a new one if necessary."
                                  onChange={selectedOptions => setFormData({...formData, category: selectedOptions})}
                                  options={categories}
                                  value={formData.category}
                                  props={{isMulti: false, required: true}}
                                  error={errors.category}
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

TechForm.contentType = 'multipart';
export default TechForm;