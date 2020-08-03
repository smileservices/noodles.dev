import React, {useState} from 'react';
import {makeId} from "./utils";

export function FilterComponent({fields, queryFilter, setQueryFilter}) {

    const SelectFilter = (({name, isSelected, options, text})=>{
        const id = "filter-"+name;
        const INACTIVE = 'inactive';
        const selectedOption = isSelected ? isSelected : INACTIVE;

        return (
            <div className="form-group">
                <label htmlFor={id}>{text}</label>
                <select className="form-control" name={id} id={id} value={selectedOption} onChange={e=>{
                    let clonedQueryFilter = {...queryFilter};
                    if (e.target.value === INACTIVE) {
                        delete clonedQueryFilter[name];
                    } else {
                        clonedQueryFilter[name] = e.target.value;
                    }
                    setQueryFilter(clonedQueryFilter);
                }}>
                    <option key={id+INACTIVE} value={INACTIVE}>All</option>
                    {Object.keys(options).map(value=>
                        <option key={id+value} value={value}>{options[value]}</option>
                    )}
                </select>
            </div>
        )
    });

    return (
        <div id="filter">
            {Object.keys(fields).map(name=> {
                const id = "select-filter-"+name
                const isSelected = name in queryFilter ? queryFilter[name] : false;
                return (
                    <SelectFilter key={name+"Filter"} name={name} isSelected={isSelected} options={fields[name].options} text={fields[name].text}/>
                )
            })}
        </div>
    )
}