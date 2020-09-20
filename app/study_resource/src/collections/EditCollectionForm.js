import React, {useState} from "react";
import Alert from "../../../src/components/Alert";
import {Input, SelectReact, SelectReactCreatable, Textarea} from "../../../src/components/form";
import apiUpdate from "../../../src/api_interface/apiUpdate";
import CreateTech from "../create/CreateTech";

export default function EditCollectionForm({data, tags, techs, setTechs, editCollection, cancel}) {

    const [formData, setFormData] = useState({
        ...data,
        tags: data.tags.map(el => {
            return {value: el.pk, label: el.name}
        }),
        technologies: data.technologies.map(el => {
            return {value: el.pk, label: el.name}
        }),
    });

    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [techForm, setTechForm] = useState(false);

    const getOptionFromTech = data => {
        return {value: data.pk, label: data.name + " " + data.version}
    };
    const getOptionFromTag = data => {
        return {value: data.pk, label: data.name}
    };

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

    function normalizeData(data) {
        let cpd = {...data};
        cpd.tags = data.tags.map(t => {
            return t.value
        });
        cpd.technologies = data.technologies.map(t => {
            return t.value
        });
        delete cpd.created_at;
        return cpd;
    }

    function submit(formData) {
        setAlert('');
        apiUpdate(
            COLLECTIONS_ENDPOINT,
            data.pk,
            normalizeData(formData),
            data => {
                editCollection(data);
            },
            setWaiting,
            result => {
                setAlert(<Alert close={e=>setAlert(null)} text={"Could not update."} type="danger"/>);
            }
        )
    }

    function addTech(tech) {
        setTechs([...techs, tech]);
    }

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
                <h3>Edit Collection</h3>
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
                    smallText="Collection name"
                    error={errors.name}
                />
                <Textarea
                    id={'description'}
                    label="Description"
                    inputProps={{
                        required: true,
                        value: formData.description,
                        onChange: e => setFormData({...formData, description: e.target.value}),
                        disabled: Boolean(waiting),
                    }}
                    smallText="What is it about"
                    error={errors.description}
                />
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
                {alert}
                {waiting ? waiting : <button className="btn submit" type="submit">Update</button>}
            </form>
        </div>
    )
}