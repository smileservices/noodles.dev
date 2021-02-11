import React, {useState, useEffect, Fragment} from "react";
import {Input, SelectReact} from "../../../src/components/form";
import CreateableComponent from "../../../src/components/CreateableComponent";
import TechForm from "../../../technology/src/TechForm";


export default function TechnologySelect({techs, values, setValues, addNewTech, waiting, errors}) {
    //techs - option list of existing techs
    //values - actual selected techs of resource
    // setValues is for selected option including version
    //
    // addNewTech is for handling creation of new technology through API

    // use for displaying technology and adding version
    let emptyForm = {
        'name': '',
        'technology_id': false,
        'version': '',
    }

    function change(idx, prop, selected) {
        let ct = [...values];
        if (prop === 'technology') {
            ct[idx]['technology_id'] = selected['value'];
            ct[idx]['name'] = selected['label'];
        } else {
            ct[idx]['version'] = selected;
        }
        setValues(ct);
    }

    return (
        <Fragment>
            <label htmlFor="select-techs">Technologies used</label>
            <small id="help" className="form-text text-muted">Can choose one or multiple or add a new one if
                necessary.</small>
            {values ? values.map((t, idx) =>
                (<div className="row" key={"select-techs" + idx}>
                    <SelectReact name={'select-tech' + idx}
                                 onChange={selectedOptions => change(idx, 'technology', selectedOptions)}
                                 options={techs}
                                 value={{label: t.name, name: t.name, value: t.technology_id}}
                                 isDisabled={Boolean(waiting)}
                    />
                    <Input
                        name={'version' + idx}
                        inputProps={{
                            disabled: Boolean(waiting),
                            type: 'text',
                            placeholder: 'version',
                            required: false,
                            onChange: e => change(idx, 'version', e.target.value),
                            value: t.version,
                        }}
                    />
                    <a onClick={e => {
                        e.preventDefault();
                        setValues(values.filter((t, ridx) => ridx !== idx));
                    }}>remove</a>
                </div>)
            ) : ''}
            <span href="" onClick={e => {
                e.preventDefault();
                setValues([...values, emptyForm]);
            }}>add new</span>
            <CreateableComponent
                endpoint={TECH_API}
                data={{
                    'name': '',
                    'image_file': {content: '', name: ''},
                    'description': '',
                    'pros': '',
                    'cons': '',
                    'limitations': '',
                    'owner': '',
                    'category': '',
                    'ecosystem': [],
                }}
                extraData={{addButtonText: 'create technology', formTitle: 'Create New Technology'}}
                FormViewComponent={TechForm}
                successCallback={data => addNewTech(data)}
            />
        </Fragment>
    );
}