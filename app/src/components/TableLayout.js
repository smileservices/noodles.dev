import React from 'react';
import {makeId} from "./utils";
import {PaginationDropdown, PaginationElement} from "./pagination";

const FilterModal = ({query, apply}) => {
    return (
        <div className="modal fade" id="filterModal" role="dialog" aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title" id="myModalLabel">Modal title</h4>
                    </div>
                    <div className="modal-body">
                        ...
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Filter</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SortModal = ({query, apply}) => {
    return (
        <div className="modal fade" id="sortModal" role="dialog" aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title" id="myModalLabel">Modal title</h4>
                    </div>
                    <div className="modal-body">
                        ...
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Sort</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export const TableLayout = ({data, mapFunction, header, pagination, setPagination}) => {

    return (
            <table className="table table-striped">
                <thead>
                <tr>
                    {header.map(columnName => (
                        <th key={makeId(4)}>{columnName}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => mapFunction(item, idx))}
                </tbody>
            </table>
    )
}