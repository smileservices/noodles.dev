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
        <div className="study-resource-technologies">
            <div className="header">
                Technologies used
                <span className="icon-info" data-tooltip={
                    'Can choose one or multiple or add a new one if necessary.'
                }>&#xe90c;</span>
            </div>
            <div className="column-container">
                {values ? values.map((t, idx) =>
                    (<div className="technology-version" key={"select-techs" + idx}>
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
                                type: 'number',
                                placeholder: 'version',
                                required: false,
                                onChange: e => change(idx, 'version', e.target.value),
                                value: t.version,
                            }}
                        />
                        <a className="remove" onClick={e => {
                            e.preventDefault();
                            setValues(values.filter((t, ridx) => ridx !== idx));
                        }}><span className="icon-close"/></a>
                    </div>)
                ) : ''}
            </div>
            <div className="row buttons-container">
            <span className="btn dark" onClick={e => {
                e.preventDefault();
                setValues([...values, emptyForm]);
            }}>Add Technology Row</span>
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
                    extraData={{addButtonText: 'Create New Technology', formTitle: 'Create New Technology'}}
                    FormViewComponent={TechForm}
                    successCallback={data => addNewTech(data)}
                    buttonClassName='btn secondary'
                />
            </div>
        </div>
    );
}