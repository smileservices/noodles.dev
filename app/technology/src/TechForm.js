import React, {useState, useEffect, Fragment} from "react"

import {
    Input,
    Textarea,
    Checkbox,
    SelectReact,
    ImageInputComponent
} from "../../src/components/form";
import apiPost from "../../src/api_interface/apiPost";
import {FormElement} from "../../src/components/form";
import Alert from "../../src/components/Alert";

function TechForm({formData, setFormData, extraData, submitCallback, waiting, alert, errors, setAlert, setErrors, setWaiting}) {

    const [technologies, setTechnologies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [licenseOptions, setLicenseOptions] = useState([]);


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
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve technologies options"
                                type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setTechnologies(data);
            }
        })
        //get license options
        fetch(
            LICENSE_OPTIONS_API, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve license options" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setLicenseOptions(data);
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
        if (normalizedData.description.length > 256) vErr.description = 'Description is too long. It has to be at most 256 characters';
        if (normalizedData.owner.length < 2) vErr.owner = 'Owner/Maintainer name is too short, has to be at least 2 characters';
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
            wait => wait ? setWaiting('Validating URL') : setWaiting(''),
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
        data['meta'] = JSON.stringify(data['meta']);
        Object.keys(data).map(value => packagedData.append(value, data[value]));
        return packagedData;
    }

    function normalizeData(data) {
        let cpd = {...data};
        cpd.ecosystem = data.ecosystem.map(t => {
            return t.value
        });
        cpd.license = data.license_option.value;
        delete data.license_option;
        cpd.category = data.category.map(t => {
            return t.value
        });
        if (cpd.meta === '' || cpd.meta === undefined) {
            cpd.meta = {};
        }
        if (cpd.image_file && !cpd.image_file.url && !cpd.image_file.file) {
            delete cpd.image_file;
            delete cpd.image_url;
        } else {
            if (cpd.image_file.file) {
                cpd.image_file = cpd.image_file.file;
                delete cpd.image_url;
            }
            if (cpd.image_file.url) {
                cpd.image_url = cpd.image_file.url;
                delete cpd.image_file;
            }
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
                    'smallText': 'The logo of the technology',
                    'originalImage': extraData.originalData?.image_file ? extraData.originalData.image_file.small : false
                }}
                disabled={Boolean(waiting)}
            />
            <SelectReact name="select-license" label="License"
                         smallText="Which type of license does it have"
                         onChange={selectedOptions => setFormData({...formData, license_option: selectedOptions})}
                         options={licenseOptions}
                         value={formData.license_option}
                         error={errors.license_option}
                         isDisabled={Boolean(waiting)}
            />
            <Textarea name="description" label="Short Description"
                      inputProps={{
                          ...makeStateProps('description'),
                          placeholder: "Description",
                          required: true,
                          disabled: Boolean(waiting)
                      }}
                      smallText="Write a short description about it (max 256 chars)"
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
            <Input name="url" label="Url" inputProps={{
                ...makeStateProps('url'),
                required: true,
                type: 'text',
                disabled: Boolean(waiting)
            }}
                   smallText="Url of docs or main page"
                   error={errors.url}
            />
            <Checkbox name="featured" label="Is Featured" inputProps={{
                checked: formData.featured,
                onChange: e => setFormData({...formData, 'featured': !formData.featured}),
                disabled: Boolean(waiting)
            }}
                      smallText="Featured technologies appear on the left sidebar. Only admins can set this."
                      error={errors.featured}
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
            <SelectReact name="select-category" label="Choose Category"
                         smallText="Can have one or multiple categories"
                         onChange={selectedOptions => setFormData({...formData, category: selectedOptions})}
                         options={categories}
                         value={formData.category}
                         props={{isMulti: true}}
                         error={errors.category}
                         isDisabled={Boolean(waiting)}
            />
            <SelectReact name="select-ecosystem" label="Ecosystem"
                         smallText="The other technologies it's dependant on."
                         onChange={selectedOptions => setFormData({...formData, ecosystem: selectedOptions})}
                         options={technologies}
                         value={formData.ecosystem}
                         props={{isMulti: true}}
                         error={errors.ecosystem}
                         isDisabled={Boolean(waiting)}
            />
            {extraData.formElements ? extraData.formElements.get_list(waiting, errors) : ''}
        </FormElement>
    )
}

TechForm.contentType = 'multipart';
export default TechForm;