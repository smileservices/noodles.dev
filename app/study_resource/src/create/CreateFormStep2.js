import React, {useState, useEffect, Fragment} from "react"
import Alert from "../../../src/components/Alert";
import {SelectReactCreatable, FormElement} from "../../../src/components/form";
import TechnologySelect from "../forms/TechnologySelect";

export default function CreateFormStep2({data, submit, techs, tags, addTechToOptions}) {

    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');

    function validate(formData) {
        let vErrors = {}
        if (formData.tags.length === 0) vErrors.tags = 'Choose at least one tag';
        if (formData.technologies.length === 0) vErrors.technologies = 'Choose at least one technology';
        if (Object.keys(vErrors).length > 0) {
            setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"/>)
            setErrors(vErrors);
        } else submit(formData)
    }

    function addTechToSelected(data) {
        // add to the selected techs but with no version info
        const resourceTechOption = {'name': data.name, 'technology_id': data.pk, 'version': ''};
        setFormData({...formData, technologies: [...formData.technologies, resourceTechOption]});
    }

    return (
        <div className="form-container">
        <FormElement
            data={formData}
            callback={validate}
            alert={alert}
            waiting={waiting} >
            <SelectReactCreatable id="select-tags" label="Choose tags"
                                  smallText="Can choose one or multiple or add a new one if necessary."
                                  onChange={selectedOptions => setFormData({...formData, tags: selectedOptions})}
                                  options={tags}
                                  value={formData.tags}
                                  props={{isMulti: true}}
                                  error={errors.tags}
            />
            <TechnologySelect
                techs={techs}
                values={formData.technologies}
                setValues={ values => setFormData({...formData, technologies: values}) }
                addNewTech={ data => {addTechToOptions(data); addTechToSelected(data)} }
                waiting={waiting}
                errors={errors.technologies}
            />
        </FormElement>
        </div>
    )
}