import React, {useState, useEffect, Fragment} from "react"
import Alert from "../../../src/components/Alert";
import apiCreate from "../../../src/api_interface/apiCreate";
import {Input, SelectReact, SelectReactCreatable, Textarea} from "../../../src/components/form";
import CreateTech from "../create/CreateTech";

export default function CreateCollectionForm({tags, techs, setTags, setTechs, addCollection, cancel}) {
    const emptyForm = {
        name: '',
        description: '',
        tags: [],
        technologies: [],
    }

    const [formData, setFormData] = useState(emptyForm)
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [errors, setErrors] = useState('');
    const [techForm, setTechForm] = useState('');

    const getOptionFromTech = data => {
        return {value: data.pk, label: data.name + " " + data.version}
    };
    const getOptionFromTag = data => {
        return {value: data.pk, label: data.name}
    };

    function extractData(formData) {
        let data = {...formData};
        data.tags = formData.tags.map(arr => arr.value);
        data.technologies = formData.technologies.map(arr => arr.value);
        return data;
    }

    function submit(formData) {
        setAlert('');
        apiCreate(
            COLLECTIONS_ENDPOINT,
            extractData(formData),
            data => {
                addCollection(data);
            },
            setWaiting,
            result => {
                setAlert(<Alert close={e=>setAlert(null)} text={"Could not create."} type="danger"/>)
            }
        )
    }

    function validate(formData, callback) {
        let vErrors = {};
        if (formData.name.length < 5) vErrors.name = 'Name is too short. It has to be at least 5 characters';
        if (formData.description.length < 20) vErrors.summary = 'Description is too short. It has to be at least 20 characters';
        if (!formData.tags || formData.tags.length === 0) vErrors.tags = 'Choose at least one tag';
        if (!formData.technologies || formData.technologies.length === 0) vErrors.technologies = 'Choose at least one technology';
        if (Object.keys(vErrors).length > 0) {
            setAlert(<Alert close={e=>setAlert(null)} text="Please fix the form errors" type="danger"/>)
            console.log(vErrors);
            setErrors({...vErrors});
        } else {
            callback(formData);
        }
    }

    function addTech(tech) {
        setTechs([...techs, tech]);
    }

    if (waiting) return waiting;

    if (techForm) return (
        <CreateTech
            techs={techs}
            createdCallback={data => {
                addTech(data);
                setTechForm(false);
                setFormData({...formData, technologies: [...formData.technologies, getOptionFromTech(data)]});
                setAlert(<Alert close={e=>setAlert(null)} text="Created new technology version successfully." type="success"/>)
            }}
            cancel={e => {
                setTechForm(false);
            }}
        />
    )

    return (
        <div className="form-container full-page-sm">
            <div className="toolbar">
                <span className="icon-close" onClick={cancel}/>
            </div>
            <div className="header">
                <h3>Create New Collection</h3>
            </div>
            <form action="#" onSubmit={e => {
                e.preventDefault();
                validate(formData, submit);
            }}>
                <Input
                    id={'name'}
                    label="Name"
                    inputProps={{
                        type: 'text',
                        required: true,
                        value: formData.name,
                        onChange: e => setFormData({...formData, name: e.target.value}),
                        disabled: Boolean(waiting),
                    }}
                    error={errors.name}
                />
                <Textarea
                    id={'description'}
                    label="Description"
                    inputProps={{
                        required: true,
                        value: formData.description,
                        onChange: e => setFormData({...formData, description: e.target.value})
                    }}
                    error={errors.description}
                />
                <SelectReactCreatable id="select-tags" label="Choose tags"
                                      smallText="Can choose one or multiple or add a new one if necessary."
                                      onChange={selectedOptions => setFormData({...formData, tags: selectedOptions})}
                                      options={tags.map(tag => getOptionFromTag(tag))}
                                      value={formData.tags}
                                      props={{
                                          isMulti: true,
                                          disabled: Boolean(waiting),
                                      }}
                                      error={errors.tags}
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
                             props={{
                                 isMulti: true,
                                 disabled: Boolean(waiting),
                             }}
                             error={errors.technologies}
                />
                {alert ? alert : ''}
                {waiting
                    ? waiting
                    : <button className="btn submit" type="submit">Create</button>
                }
            </form>
        </div>
    );
}