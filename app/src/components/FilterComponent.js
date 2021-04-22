import React, {useState} from 'react';
import Select from "react-select";

const INACTIVE = 'inactive';

export function SelectReactFilter({selected, options, label, onChange, isMulti, attributes}) {
    /*
    * name: string
    * selected: string/int
    * options: [[value, text],...]
    * onChange: value => {...}
    *
    * */
    let selectedValue = selected ? {label: '', value: null} : INACTIVE;
    const selectOptions = options.map(o => {
        if (selected === o[0]) selectedValue = {label: o[1], value: o[0]};
        return {label: o[1], value: o[0]}
    })
    const selectOnChange = selected => onChange(selected ? selected.value : INACTIVE)

    return (
        <Select isLoading={false} isDisabled={false}
                placeholder={label}
                options={selectOptions}
                value={selectedValue}
                onChange={selectOnChange}
                className="filter-select"
                classNamePrefix="fs"
                isMulti={isMulti}
                isClearable={true}
                {...attributes}
        />
    )
}

export function FilterComponent({fields, queryFilter, setQueryFilter, applyButtonAction}) {

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
                return <SelectReactFilter key={"filter-" + data.label} {...data} isMulti={false}/>
            case 'multi-select':
                return <SelectReactFilter key={"filter-" + data.label} {...data} isMulti={true}/>
            default:
                console.error('filterFactory ERROR: could not find matching filter component:', type);
        }
    }

    return (
        <div id="filters-container">
            <div className="filters filters-list">
                {Object.keys(fields).map(name => {
                    const selected = name in queryFilter ? queryFilter[name] : false;
                    const data = {
                        selected: selected,
                        options: fields[name].options,
                        label: fields[name].label,
                        onChange: value => onChange(name, value)
                    }
                    return filterFactory(fields[name].type, data)
                })}
                {Object.keys(queryFilter).length > 0
                    ? <div className="filter-buttons">
                        <button className="btn reset-filters" onClick={e => setQueryFilter({})}><span
                            className="icon icon-close"/> Reset All
                        </button>
                        {applyButtonAction ?
                            <button className="btn apply-filters" onClick={applyButtonAction}>Apply</button>
                            : ''}
                    </div>
                    : ''}
            </div>
            <div className="filters show-container">
                <SelectReactFilter key={"filter-" + 'show-filters'} label='Filters'
                                   selected={false} options={[]} isMulti={false}
                                   attributes={{
                                       onMenuOpen: () => {
                                           var container = document.getElementById('filters-container');
                                           container.children[1].style.display = 'none';
                                           container.children[0].style.display = 'flex';
                                       }
                                   }}
                />
            </div>
        </div>
    )
}