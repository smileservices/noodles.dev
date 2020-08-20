import React, {useState, useEffect, Fragment} from "react"
import CreateTech from "./CreateTech";

import apiPost from "../../../src/api_interface/apiPost";
import Alert from "../../../src/components/Alert";
import {Input} from "../../../src/components/form";
import {SelectReact, SelectReactCreatable} from "../../../src/components/form";

export default function CreateFormStep2({data, submit, techs, tags, addTech}) {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');

    const [techForm, setTechForm] = useState(false);

    function validate(formData, callback) {
        let vErrors = {}
        if (formData.tags.length === 0) vErrors.tags = 'Choose at least one tag';
        if (formData.technologies.length === 0) vErrors.technologies = 'Choose at least one technology';
        if (Object.keys(vErrors).length > 0) {
            setAlert(<Alert text="Please fix the form errors" type="danger"/>)
            setErrors(vErrors);
        } else callback(formData)
    }

    const getOptionFromTech = data => {
        return {value: data.pk, label: data.name + " " + data.version}
    };
    const getOptionFromTag = data => {
        return {value: data.pk, label: data.name}
    };

    if (waiting) return waiting;

    if (techForm) return (
        <CreateTech
            techs={techs}
            createdCallback={data => {
                addTech(data);
                setTechForm(false);
                console.log(formData);
                setFormData({...formData, technologies: [...formData.technologies, getOptionFromTech(data)]});
                setAlert(<Alert text="Created new technology version successfully." type="success"/>)
            }}
            cancel={e => {
                setTechForm(false);
            }}
        />
    )

    return (
        <form action="#" onSubmit={e => {
            e.preventDefault();
            validate(formData, submit);
        }}>
            {alert ? alert : ''}
            <SelectReactCreatable id="select-tags" label="Choose tags"
                                  smallText="Can choose one or multiple or add a new one if necessary."
                                  onChange={selectedOptions => setFormData({...formData, tags: selectedOptions})}
                                  options={tags.map(tag => getOptionFromTag(tag))}
                                  value={formData.tags}
                                  props={{isMulti: true}}
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
                         props={{isMulti: true}}
                         error={errors.technologies}
            />
            <button className="btn submit" type="submit">Next</button>
        </form>
    )
}