import React, {useState, useEffect, Fragment} from "react";
import Alert from "../../../src/components/Alert";
import {Input, SelectReact, SelectReactCreatable, Textarea} from "../../../src/components/form";
import apiPost from "../../../src/api_interface/apiPost";
import apiUpdate from "../../../src/api_interface/apiUpdate";
import CreateTech from "../create/CreateTech";
import EditableComponent from "../../../src/components/EditableComponent";
import StudyResourceImageUpdateForm from "./StudyResourceImageUpdateForm";
import StudyResourceImageCreateForm from "./StudyResourceImageCreateForm";
import CreateableComponent from "../../../src/components/CreateableComponent";

export default function EditDetailForm({data, tags, techs, addTech, options, setData, cancel}) {

    function getLabelSingleFromArray(optionsArr, id) {
        // optionsArr [ [val, name], ... ]
        let el = optionsArr.filter(e => e[0] === id)[0];
        return {value: el[0], label: el[1]};
    }

    function getLabelMultiFromArrayDicts(arr, selArr) {
        // optionsArr [ {pk: , name: }, ... ]
        return selArr.map(id => {
            let el = arr.filter(e => e.pk === id)[0];
            return {value: el.pk, label: el.name};
        })
    }

    function getTechLabelMultiFromArrayDicts(arr, selArr) {
        // optionsArr [ {pk: , name: }, ... ]
        return selArr.map(id => {
            let el = arr.filter(e => e.pk === id)[0];
            return {value: el.pk, label: el.name + ' ' + el.version};
        })
    }


    const [formData, setFormData] = useState({
        ...data,
        tags: getLabelMultiFromArrayDicts(tags, data.tags),
        technologies: getTechLabelMultiFromArrayDicts(techs, data.technologies),
        type: getLabelSingleFromArray(options.type, data.type),
        media: getLabelSingleFromArray(options.media, data.media),
        experience_level: getLabelSingleFromArray(options.experience_level, data.experience_level),
    });

    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [techForm, setTechForm] = useState(false);

    const imageData = {
        'image_file': data.image_file,
        'pk': data.image_pk,
        'image_url': data.image_url,
        'study_resource': data.study_resource,
    }

    const getOptionFromTech = data => {
        return {value: data.pk, label: data.name + " " + data.version}
    };

    const getOptionFromTag = data => {
        return {value: data.pk, label: data.name}
    };

    function getOptions(name) {
        return options[name].map(o => {
            return {value: o[0], label: o[1]}
        });
    }

    function validate(formData, callback) {
        let vErrors = {};
        apiPost(
            STUDY_RESOURCE_ENDPOINT + 'validate_url/',
            {
                url: formData.url,
                pk: RESOURCE_ID
            },
            setWaiting,
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert text="Could not validate url" type="danger" close={e => setAlert(null)} hideable={false} />)
                return false;
            }
        }).then(data => {
            if (data.error) {
                vErrors.url = data.message
                return false;
            } else return data;
        }).then(valid => {
            if (formData.name.length < 5) vErrors.name = 'Title is too short. It has to be at least 5 characters';
            if (formData.published_by.length < 3) vErrors.published_by = 'Author name is too short. It has to be at least 3 characters';
            if (formData.summary.length < 30) vErrors.summary = 'Summary is too short. It has to be at least 30 characters';
            if (!formData.type) vErrors.type = 'Required';
            if (!formData.experience_level) vErrors.experience_level = 'Required';
            if (!formData.media) vErrors.media = 'Required';
            if (!formData.tags || formData.tags.length === 0) vErrors.tags = 'Choose at least one tag';
            if (!formData.technologies || formData.technologies.length === 0) vErrors.technologies = 'Choose at least one technology';
            if (!valid || Object.keys(vErrors).length > 0) {
                setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger" hideable={false} />)
                console.log(vErrors);
                setErrors({...vErrors});
                return false
            } else return true
        }).then(valid => {
            if (valid) callback(formData);
        })
    }

    function normalizeData(data) {
        let cpd = {...data};
        cpd.tags = data.tags.map(t => {
            return t.value
        });
        cpd.technologies = data.technologies.map(t => {
            return t.value
        });
        cpd.type = data.type.value;
        cpd.media = data.media.value;
        cpd.experience_level = data.experience_level.value;
        cpd.publication_date = formatDate(data.publication_date);
        delete cpd.creation_date;
        return cpd;
    }

    function submit(formData) {
        setAlert('');
        apiUpdate(
            STUDY_RESOURCE_ENDPOINT,
            RESOURCE_ID,
            normalizeData(formData),
            data => {
                setData(normalizeData(formData));
            },
            setWaiting,
            result => {
                setAlert(<Alert close={e => setAlert(null)} text={"Could not update."} type="danger" hideable={false} stick={false}/>);
            }
        )
    }

    function formatDate(dateStr) {
        let d = new Date(dateStr);
        return d.toISOString().substr(0, 10);
    }

    if (techForm) return <CreateTech
        techs={techs} cancel={e => setTechForm(false)}
        createdCallback={tech => {
            addTech(tech);
            setTechForm(false);
        }}/>

    return (
        <div className="form-container">
            <div className="toolbar">
                <span className="icon-close" onClick={cancel}/>
            </div>
            <div className="header"><h3>Edit resource</h3></div>

            <form action="#" onSubmit={e => {
                e.preventDefault();
                validate(formData, submit);
            }}>
                <Input
                    id={'name'}
                    label="Title"
                    inputProps={{
                        disabled: Boolean(waiting),
                        type: 'text',
                        required: true,
                        value: formData.name,
                        onChange: e => setFormData({...formData, name: e.target.value})
                    }}
                    smallText="Resource name"
                    error={errors.name}
                />

                <Input
                    type="text"
                    id='inputurl'
                    label="URL"
                    inputProps={{
                        disabled: Boolean(waiting),
                        onChange: e => setFormData({...formData, url: e.target.value}),
                        value: formData.url,
                        required: true,
                        placeholder: "url"
                    }}
                    smallText="Resource source url"
                    error={errors.url}
                />

                <div className="row">
                    <Input
                        id={'publication_date'}
                        label="Publishing Date"
                        inputProps={{
                            disabled: Boolean(waiting),
                            type: 'date',
                            required: true,
                            value: formatDate(formData.publication_date),
                            onChange: e => setFormData({...formData, publication_date: e.target.value})
                        }}
                        smallText="Date the resource was published"
                        error={errors.publication_date}
                    />
                    <Input
                        id={'published_by'}
                        label="Author"
                        inputProps={{
                            disabled: Boolean(waiting),
                            type: 'text',
                            required: true,
                            value: formData.published_by,
                            onChange: e => setFormData({...formData, published_by: e.target.value})
                        }}
                        smallText="Who is the author of the resource"
                        error={errors.published_by}
                    />
                </div>
                <SelectReactCreatable id="select-tags" label="Choose tags"
                                      smallText="Can choose one or multiple or add a new one if necessary."
                                      onChange={selectedOptions => setFormData({...formData, tags: selectedOptions})}
                                      options={tags.map(tag => getOptionFromTag(tag))}
                                      value={formData.tags}
                                      props={{isMulti: true}}
                                      error={errors.tags}
                                      isDisabled={Boolean(waiting)}
                />
                <SelectReact id="select-techs" label="Choose technologies"
                             smallText={
                                 <span>
                                 <span>Choose one or more technologies. </span>
                                 <a href="" onClick={e => {
                                     e.preventDefault();
                                     setTechForm(true)
                                 }}>
                                     Add new
                                 </a>
                             </span>
                             }
                             onChange={selectedOptions => setFormData({...formData, technologies: selectedOptions})}
                             options={techs.map(tech => getOptionFromTech(tech))}
                             value={formData.technologies}
                             props={{isMulti: true}}
                             error={errors.technologies}
                             isDisabled={Boolean(waiting)}
                />
                <div className="row">
                    <SelectReact label='Type'
                                 value={formData.type}
                                 error={errors.type}
                                 options={getOptions('type')}
                                 onChange={sel => setFormData({...formData, type: sel})}
                                 smallText="Free or paid"
                                 isDisabled={Boolean(waiting)}
                    />
                    <SelectReact label='Media'
                                 value={formData.media}
                                 error={errors.media}
                                 options={getOptions('media')}
                                 onChange={sel => setFormData({...formData, media: sel})}
                                 smallText="Media type"
                                 isDisabled={Boolean(waiting)}
                    />
                    <SelectReact label='Experience level'
                                 value={formData.experience_level}
                                 error={errors.experience_level}
                                 options={getOptions('experience_level')}
                                 onChange={sel => setFormData({...formData, experience_level: sel})}
                                 smallText="Experience level required"
                                 isDisabled={Boolean(waiting)}
                    />
                </div>
                {imageData.pk
                    ? <div className="images-edit">
                        <div style={{position: "relative"}}>
                            <EditableComponent endpoint={RESOURCE_IMAGE_ENDPOINT} data={imageData}
                                               DisplayViewComponent={
                                                   ({data}) => (<img src={data.image_file} alt=""/>)
                                               }
                                               FormViewComponent={StudyResourceImageUpdateForm}
                                               callback={imageData => setData({
                                                   ...data,
                                                   image_file: imageData.image_file,
                                                   image_url: imageData.image_url,
                                                   image_pk: imageData.pk,
                                               })}
                                               deleteCallback={()=>setData({
                                                   ...data,
                                                   image_file: '',
                                                   image_url: '',
                                                   image_pk: false,
                                               })}
                            />
                        </div>
                    </div>
                    : <CreateableComponent endpoint={RESOURCE_IMAGE_ENDPOINT} data={imageData}
                                           FormViewComponent={StudyResourceImageCreateForm}
                                           callback={imageData => setData({
                                               ...data,
                                               image_file: imageData.image_file,
                                               image_url: imageData.image_url,
                                               image_pk: imageData.pk,
                                           })}
                    />
                }
                <Textarea
                    id={'summary'}
                    label="Summary"
                    inputProps={{
                        disabled: Boolean(waiting),
                        required: true,
                        value: formData.summary,
                        onChange: e => setFormData({...formData, summary: e.target.value})
                    }}
                    smallText="What is it about"
                    error={errors.summary}
                />
                {alert ? alert : ''}
                {waiting
                    ? waiting
                    : <button className="btn submit" type="submit">Update</button>
                }
            </form>
        </div>
    )
}