import React from 'react';

export const TableFilterLayout = ({data, mapFunction, filterBy, header}) => {
    return (
        <table className="table table-striped">
            {filterBy ?
                ""
                : ""
            }
            {header ?
                <thead>
                <tr>
                    {header.map(columnName => (
                        <th>{columnName}</th>
                    ))}
                </tr>
                </thead>
                : ''
            }
            <tbody>
            {data.map((item, idx) => mapFunction(item, idx))}
            </tbody>
        </table>
    )
}