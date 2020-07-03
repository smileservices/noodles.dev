import React from 'react';
import {makeId} from "./utils";
import {SortComponent} from "./SortComponent";


export const TableLayout = ({data, mapFunction, header, querySort, setQuerySort}) => {

    return (
        <table className="table table-striped">
            <thead>
            <tr>
                {header.map(column => {
                        //if column is object, then make the row sortable
                        if (typeof column === 'object') {
                            const name = Object.keys(column);
                            const displayName = column[name];
                            return (
                                <th key={"column-head-" + displayName}>
                                    {displayName}
                                    <div className="pull-right">
                                        <SortComponent name={name}
                                                       querySort={querySort}
                                                       setQuerySort={setQuerySort}
                                        />
                                    </div>
                                </th>
                            );
                        } else {
                            return (<th key={"column-head-" + column}>{column}</th>);
                        }
                    }
                )}
            </tr>
            </thead>
            <tbody>
            {data.map((item, idx) => mapFunction(item, idx))}
            </tbody>
        </table>
    )
}