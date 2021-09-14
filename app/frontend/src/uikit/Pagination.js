import React, { useState, useEffect } from 'react';

const Pagination = ({
    data,
    mapFunction,
    dataLimit,
    resultsContainerClass,
    limit,
}) => {
    if (!data) return '';
    if (data.length === 0) return '';

    const [currentPage, setCurrentPage] = useState(1);
    const [lastItemInGroup, setLastItemInGroup] = useState(0);
    const [paginatedData, setPaginatedData] = useState([]);

    const lastIndex = data.indexOf(data[data.length - 1]);

    let pageLimit;

    if (limit) {
        pageLimit = limit;
    } else if (data.length % dataLimit !== 0) {
        pageLimit = Math.ceil(data.length / dataLimit);
    } else {
        pageLimit = Math.floor(data.length / dataLimit);
    }

    useEffect(() => {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        const newData = data.slice(startIndex, endIndex);
        setPaginatedData(newData);
    }, [currentPage]);

    useEffect(() => {
        if (paginatedData.length) {
            setLastItemInGroup(paginatedData[paginatedData.length - 1].index);
        }
    }, [paginatedData]);

    const goToNextPage = () => {
        setCurrentPage((page) => page + 1);
    }

    const goToPreviousPage = () => {
        setCurrentPage((page) => page - 1);
    }

    const changePage = (event) => {
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
    }

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        const paginationGroup = new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
        return paginationGroup;
    }

    const getPageDataLength = (page) => {
        const startIndex = page * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        const newData = data.slice(startIndex, endIndex);
        return newData.length;
    }

    return (
        <div className="pagination-container">
            <div className={resultsContainerClass}>
                {paginatedData.map((data, id) => mapFunction(data, id))}
            </div>
            <div className="pagination-component">
                <button
                    onClick={goToPreviousPage}
                    className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
                >
                    <span className="icon-caret-back-sharp" />
                </button>

                {/* show page numbers */}
                {getPaginationGroup().map((item, index) => {
                    if (getPageDataLength(+item) === 0) {
                        return null;
                    }
                    return(
                        <button
                        key={index}
                        onClick={changePage}
                        className={`pagination-item ${currentPage === item ? 'active' : null}`}
                        >
                        <span>{item}</span>
                        </button>
                    )
                })}

                <button
                    onClick={goToNextPage}
                    className={`next ${lastItemInGroup === lastIndex ? 'disabled' : ''}`}
                >
                    <span className="icon-caret-forward-sharp" />
                </button> 
            </div>
        </div>
    );
}

export default Pagination;