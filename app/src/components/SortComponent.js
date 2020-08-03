import React, {useState} from 'react';
import {makeId} from "./utils";

export function SortComponent({name, querySort, setQuerySort}) {
    const isSortAsc = querySort[name] === '+';
    const isSortDesc = querySort[name] === '-';
    const isSorted = name in querySort;

    function updateSorting(e, val) {
        e.preventDefault();
        let clonedQuery = {...querySort};
        if (val) {
            clonedQuery[name] = val;
        } else {
            delete clonedQuery[name];
        }
        setQuerySort(clonedQuery);
    }

    const SortAsc = () => {
        return <a className="btn btn-icon-toggle btn-refresh" href="" onClick={e=>updateSorting(e, '+')}><i className="fa fa-sort-asc"> </i></a>
    };
    const SortDesc = () => {
        return <a className="btn btn-icon-toggle btn-refresh" href="" onClick={e=>updateSorting(e, '-')}><i className="fa fa-sort-desc"> </i></a>
    };
    const SortRemove = () => {
         return <a className="btn btn-icon-toggle btn-refresh" href="" onClick={e=>updateSorting(e, false)}><i className="fa fa-close"> </i></a>
    };

    return (
        <div className="tools sorting">
            {!isSorted || isSortDesc ? SortAsc() : false}
            {!isSorted || isSortAsc ? SortDesc() : false}
            {isSorted ? SortRemove() : false}
        </div>
    )
}