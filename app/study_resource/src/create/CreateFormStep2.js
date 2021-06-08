import React, {useState, useEffect, Fragment} from "react"
import Alert from "../../../src/components/Alert";
import {SelectReactCreatable, FormElement, SelectReact} from "../../../src/components/form";
import TechnologySelect from "../forms/TechnologySelect";

export default function CreateFormStep2({data, submit, techs, tags, options, addTechToOptions}) {

    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');

    function validate(formData) {
        let vErrors = {}
        if (formData.tags.length === 0) vErrors.tags = 'Choose at least one tag';
        if (formData.technologies.length > 0) {
            //clean up technologies
            formData.technologies = formData.technologies.filter(t => t.name !== '');
        }
        if (
            formData.technologies.length === 0 &&
            formData.category_concepts.length === 0 &&
            formData.technology_concepts.length === 0
        ) {
            // if no technology is selected, at least one category/technology concept must be added
            vErrors.category_concepts = 'Choose at least one category concept OR';
            vErrors.technology_concepts = 'Choose at least one technology concept OR';
            vErrors.technologies = 'Choose at least one technology';
        }
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
                waiting={waiting}>
                <SelectReactCreatable id="select-tags" label="Choose tags"
                                      smallText="Can choose one or multiple or add a new one if necessary."
                                      onChange={selectedOptions => setFormData({...formData, tags: selectedOptions})}
                                      options={tags}
                                      value={formData.tags}
                                      props={{isMulti: true}}
                                      error={errors.tags}
                />
                <SelectReact name="select-category-concepts" label="Category Concepts"
                             smallText="Does this resource uses category concepts? Can have none or multiple choices concepts."
                             onChange={selectedOption => setFormData({...formData, category_concepts: selectedOption})}
                             options={options.category_concepts}
                             value={formData.category_concepts}
                             props={{isMulti: true}}
                             error={errors.category_concepts}
                             isDisabled={Boolean(waiting)}
                />
                <TechnologySelect
                    techs={techs}
                    values={formData.technologies}
                    setValues={values => setFormData({...formData, technologies: values})}
                    addNewTech={data => {
                        addTechToOptions(data);
                        addTechToSelected(data)
                    }}
                    waiting={waiting}
                    errors={errors.technologies}
                />
                <SelectReact name="select-technology-concepts" label="Technology Concepts"
                             smallText="Does this resource uses technology concepts? Can have none or multiple choices concepts."
                             onChange={selectedOption => setFormData({
                                 ...formData,
                                 technology_concepts: selectedOption
                             })}
                             options={options.technology_concepts}
                             value={formData.technology_concepts}
                             props={{isMulti: true}}
                             error={errors.technology_concepts}
                             isDisabled={Boolean(waiting)}
                />
            </FormElement>
        </div>
    )
}