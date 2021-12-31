import React, {useState} from "react";
import {makeId} from "../../src/components/utils";

export default function SortComponent({sort, sortOptions, callback}) {
    const sortArr = sort ? sort.split('-') : ['default', 'desc'];
    const [state, setState] = useState({field: sortArr[0], order: sortArr[1]})

    return (
        <div className="sort">
            <label htmlFor="sort_by">Sort By:</label>
            {/*<div>*/}
                <select name="sort_by" id="sort_by" onChange={e => {
                    setState({...state, field: e.target.value});
                    callback([e.target.value, state.order].join('-'));
                }} value={state.field}>
                    {sortOptions.map(opt =>
                        <React.Fragment key={'sort' + opt.value}>
                            <option value={opt.value}>{opt.label}</option>
                        </React.Fragment>
                    )}
                </select>
                {/*<span className="icon-arrow_drop_down"/>*/}
            {/*</div>*/}
            {state.field !== "default" ?
                <span className="sort-direction" onClick={e => {
                    setState({...state, order: state.order === 'desc' ? 'asc' : 'desc'});
                    callback([state.field, state.order === 'desc' ? 'asc' : 'desc'].join('-'));
                }}>
                    {state.order}
                </span>
                : ''}
        </div>
    )
}