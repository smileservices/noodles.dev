import React, {Fragment} from 'react';
import {PaginationElement} from "./pagination";

export default function PaginatedLayout({data, mapFunction, pagination, resultsCount, setPagination, resultsContainerClass}) {
    if (!data) return '';
    if (data.length === 0) return ''
    return (
        <Fragment>
            <div className={resultsContainerClass}>
                {data.map((item, idx) => mapFunction(item, idx))}
            </div>
            { resultsCount > pagination.resultsPerPage
                ? <PaginationElement pagination={pagination} resultsCount={resultsCount} setPagination={setPagination}/>
                : ''
            }
        </Fragment>
    )
}