import React, {Fragment} from 'react';
import {PaginationElement} from "./pagination";

export default function PaginatedLayout({data, mapFunction, pagination, resultsCount, setPagination, resultsContainerClass, paginationLocation='bottom'}) {
    if (!data) return '';
    if (data.length === 0) return ''

    function getPaginationElement() {
        if (resultsCount > pagination.resultsPerPage)
            return (<PaginationElement pagination={pagination} resultsCount={resultsCount} setPagination={setPagination}/>)
        return '';
    }

    return (
        <Fragment>
            {paginationLocation === 'top' || paginationLocation === 'both' ? getPaginationElement() : ''}
            <div className={resultsContainerClass}>
                {data.map((item, idx) => mapFunction(item, idx))}
            </div>
            {paginationLocation === 'bottom' || paginationLocation === 'both' ? getPaginationElement() : ''}
        </Fragment>
    )
}