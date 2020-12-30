import React, {useState, useEffect, Fragment} from "react";
import {Input, SelectReact} from "../../src/components/form";

export default function TechnologySelect({techs, values, setTechnologies, waiting, errors}) {
    // use for displaying technology and adding version
    let emptyForm = {
        'name': '',
        'technology_id': false,
        'version': '',
    }
    function change(idx, prop, selected) {
        let ct = [...values];
        if (prop==='technology') {
            ct[idx]['technology_id'] = selected['value'];
            ct[idx]['name'] = selected['label'];
        } else {
            ct[idx]['version'] = selected;
        }
        setTechnologies(ct);
    }

    return (
        <Fragment>
            <label htmlFor="select-techs">Technologies used</label>
            <small id="help" className="form-text text-muted">Can choose one or multiple or add a new one if
                necessary.</small>
            {values ? values.map((t,idx) =>
                (<div className="row" key={"select-techs"+idx}>
                    <SelectReact name={'select-tech'+idx}
                                 onChange={selectedOptions => change(idx, 'technology', selectedOptions)}
                                 options={techs}
                                 value={{label: t.name, name: t.name, value: t.technology_id}}
                                 isDisabled={Boolean(waiting)}
                    />
                    <Input
                        name={'version'+idx}
                        inputProps={{
                            disabled: Boolean(waiting),
                            type: 'text',
                            placeholder: 'version',
                            required: false,
                            onChange: e => change(idx, 'version', e.target.value),
                            value: t.version,
                        }}
                    />
                    <a onClick={e=>{
                        e.preventDefault();
                        setTechnologies(values.filter((t,ridx) => ridx!==idx));
                    }}>remove</a>
                </div>)
            ) : ''}
            <a href="" onClick={e=>{
                e.preventDefault();
                setTechnologies([...values, emptyForm]);
            }}>add new</a>
        </Fragment>
    );
}