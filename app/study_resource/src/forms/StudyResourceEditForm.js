import React, {useState, useEffect, Fragment} from "react";
import Alert from "../../../src/components/Alert";
import {
    FormElement,
    ImageInputComponent,
    Input,
    SelectReact,
    SelectReactCreatable,
    Textarea
} from "../../../src/components/form";
import apiPost from "../../../src/api_interface/apiPost";
import TechnologySelect from "../forms/TechnologySelect";

function StudyResourceEditForm({formData, setFormData, extraData, submitCallback, waiting, alert, errors, setAlert, setErrors, setWaiting}) {

    const emptyData = {
        'name': '',
        'url': '',
        'image_file': {content: '', name: ''},
        'publication_date': '',
        'published_by': '',
        'summary': '',
        'tags': [],
        'technologies': [],
        'price': 0,
        'media': 0,
        'experience_level': 0,
    }

    const [tags, setTags] = useState({});
    const [techs, setTechs] = useState({});
    const [options, setOptions] = useState({});
    const [categories, setCategories] = useState([]);

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
            if (data) setOptions(data);
        })
    }, []);

    function formatDate(dateStr) {
        let d = new Date(dateStr);
        return d.toISOString().substr(0, 10);
    }

    function makeFormData(data) {
        let packagedData = new FormData();
        data['technologies'] = JSON.stringify(data['technologies']);
        data['tags'] = JSON.stringify(data['tags']);
        Object.keys(data).map(value => packagedData.append(value, data[value]));
        return packagedData;
    }

    function normalizeData(data) {
        let cpd = {...data};
        cpd.tags = data.tags.map(t => {
            return t.value
        });
        cpd.technologies = data.technologies.map(t => {
            return {technology_id: t.technology_id, version: t.version ? t.version : 0};
        });
        cpd.category = data.category.value;
        cpd.publication_date = formatDate(data.publication_date);
        //image validation part
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

    function validate(normalizedData, callback) {
        let vErrors = {};
        apiPost(
            RESOURCE_API + 'validate_url/',
            {
                url: normalizedData.url,
                pk: normalizedData.pk
            },
            setWaiting,
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert text="Could not validate url" type="danger" close={e => setAlert(null)}
                                hideable={false}/>)
                return false;
            }
        }).then(data => {
            if (data.error) {
                vErrors.url = data.message
                return false;
            } else return data;
        }).then(valid => {
            if (normalizedData.name.length < 5) vErrors.name = 'Title is too short. It has to be at least 5 characters';
            if (normalizedData.published_by.length < 3) vErrors.published_by = 'Author name is too short. It has to be at least 3 characters';
            if (normalizedData.summary.length < 30) vErrors.summary = 'Summary is too short. It has to be at least 30 characters';

            if (typeof normalizedData.price !== 'number') vErrors.type = 'Required';
            if (typeof normalizedData.experience_level !== 'number') vErrors.experience_level = 'Required';
            if (typeof normalizedData.media !== 'number') vErrors.media = 'Required';

            if (!normalizedData.tags || normalizedData.tags.length === 0) vErrors.tags = 'Choose at least one tag';
            if (!normalizedData.technologies || normalizedData.technologies.length === 0) vErrors.technologies = 'Choose at least one technology';

            if (extraData.formElements) {
                extraData.formElements.validate(normalizedData, vErrors);
            }

            if (!valid || Object.keys(vErrors).length > 0) {
                setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"
                                hideable={false}/>)
                setErrors({...vErrors});
                return false
            } else {
                setErrors({});
                return true;
            }
        }).then(valid => {
            if (valid) callback(makeFormData(normalizedData));
        })
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
            <h3>{extraData.formTitle}</h3>
            <Input
                name={'name'}
                label="Title"
                inputProps={{...makeStateProps('name')}}
                smallText="Resource name"
                error={errors.name}
            />

            <Input
                type="text"
                name='inputurl'
                label="URL"
                inputProps={{...makeStateProps('url')}}
                smallText="Resource source url"
                error={errors.url}
            />
            <ImageInputComponent
                data={formData.image_file}
                setValue={valueObj => setFormData({...formData, image_file: valueObj})}
                inputProps={{
                    'name': 'image_file',
                    'label': 'Primary Image',
                    'error': errors.image_file,
                    'waiting': waiting,
                    'smallText': 'Primary image of the resource',
                    'originalImage': extraData.originalData?.image_file ? extraData.originalData.image_file.small : false
                }}
            />
            <div className="row">
                <Input
                    name={'publication_date'}
                    label="Publishing Date"
                    inputProps={{...makeStateProps('publication_date')}}
                    smallText="Date the resource was published"
                    error={errors.publication_date}
                />
                <Input
                    name={'published_by'}
                    label="Author"
                    inputProps={{...makeStateProps('published_by')}}
                    smallText="Who is the author of the resource"
                    error={errors.published_by}
                />
            </div>
            <SelectReactCreatable name="select-tags" label="Choose tags"
                                  smallText="Can choose one or multiple or add a new one if necessary."
                                  onChange={selectedOptions => setFormData({...formData, tags: selectedOptions})}
                                  options={tags}
                                  value={formData.tags}
                                  props={{isMulti: true}}
                                  error={errors.tags}
                                  isDisabled={Boolean(waiting)}
            />

            <TechnologySelect techs={techs}
                              values={formData.technologies}
                              setValues={techs => setFormData({...formData, technologies: techs})}
                              addNewTech={data => setTechs([...techs, {value: data.pk, label: data.name}])}
                              waiting={waiting}
                              errors={errors}
            />

            <SelectReactCreatable name="select-category" label="Choose Category"
                                  smallText="Can choose or add a new one if necessary."
                                  onChange={selectedOptions => setFormData({...formData, category: selectedOptions})}
                                  options={categories}
                                  value={formData.category}
                                  props={{isMulti: false, required: true}}
                                  error={errors.category}
            />

            <div className="row">
                <SelectReact label='Type'
                             name='price-type'
                             value={options['price'] ? options['price'].filter(i => i.value === formData.price) : {}}
                             error={errors.type}
                             options={options['price']}
                             onChange={sel => setFormData({...formData, price: sel.value})}
                             smallText="Free or paid"
                             isDisabled={Boolean(waiting)}
                />
                <SelectReact label='Media'
                             name='media'
                             value={options['media'] ? options['media'].filter(i => i.value === formData.media) : {}}
                             error={errors.media}
                             options={options['media']}
                             onChange={sel => setFormData({...formData, media: sel.value})}
                             smallText="Media type"
                             isDisabled={Boolean(waiting)}
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
            </div>
            <Textarea
                name={'summary'}
                label="Summary"
                inputProps={{...makeStateProps('summary')}}
                smallText="What is it about"
                error={errors.summary}
            />
            {extraData.formElements ? extraData.formElements.get_list(waiting, errors) : ''}
        </FormElement>
    )
}

StudyResourceEditForm.contentType = 'multipart';
export default StudyResourceEditForm