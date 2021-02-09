import React, {useState} from 'react';
import {makeId} from "./utils";

const INACTIVE = 'inactive';

export function SelectFilter({name, selected, options, label, onChange}) {
    /*
    * name: string
    * selected: string/int
    * options: [[value, text],...]
    * onChange: value => {...}
    *
    * */
    const id = "filter-" + name;
    const selectedOption = selected ? selected : INACTIVE;

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <select className="form-control" name={id} id={id} value={selectedOption} onChange={e => {
                onChange(e.target.value);
            }}>
                <option key={id + INACTIVE} value={INACTIVE}>All</option>
                {options.map(option =>
                    <option key={id + option[0]} value={option[0]}>{option[1]}</option>
                )}
            </select>
        </div>
    )
}

export function FilterComponent({fields, queryFilter, setQueryFilter}) {

    /*
    *  fields: {filterName: {label: string, type: string, options: [[value, label],...]}, ...}
    *
    * */

    function onChange(name, value) {
        let clonedQueryFilter = {...queryFilter};
        if (value === INACTIVE) {
            delete clonedQueryFilter[name];
        } else {
            clonedQueryFilter[name] = value;
        }
        setQueryFilter(clonedQueryFilter);
    }

    function filterFactory(type, data) {
        switch (type) {
            case 'simple-select':
                return <SelectFilter key={"filter-" + data.name} {...data} />
            default:
                console.error('filterFactory ERROR: could not find matching filter component:', type);
        }
    }

    return (
        <div id="filter">
            {Object.keys(fields).map(name => {
                const selected = name in queryFilter ? queryFilter[name] : false;
                const data = {
                    name: name,
                    selected: selected,
                    options: fields[name].options,
                    label: fields[name].label,
                    onChange: value => onChange(name, value)
                }
                return filterFactory(fields[name].type, data)
            })}
            { Object.keys(queryFilter).length > 0
                ? <button className="btn btn-primary" onClick={e=>setQueryFilter({})}>Reset All</button> : ''}
        </div>
    )
}