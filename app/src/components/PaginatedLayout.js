import React, {Fragment} from 'react';
import {makeId} from "./utils";
import {SortComponent} from "./SortComponent";
import {PaginationElement} from "./pagination";

export default function PaginatedLayout({data, mapFunction, pagination, resultsCount, setPagination, resultsContainerClass}) {
    if (!data) return '';
    if (data.length === 0) return 'No results'
    return (
        <Fragment>
            <div className={resultsContainerClass}>
                {data.map((item, idx) => mapFunction(item, idx))}
            </div>
            <PaginationElement pagination={pagination} resultsCount={resultsCount} setPagination={setPagination}/>
        </Fragment>
    )
}