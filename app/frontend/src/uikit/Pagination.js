import React, { useState, Fragment } from 'react';

const Pagination = ({
    data,
    mapFunction,
    // pageLimit,
    dataLimit,
    resultsContainerClass,
}) => {
    if (!data) return '';
    if (data.length === 0) return '';

    const [pages] = useState(Math.round(data.length / dataLimit));
    const [currentPage, setCurrentPage] = useState(1);

    const pageLimit = Math.floor(data.length / dataLimit);

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

    const getPaginatedData = () => {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return data.slice(startIndex, endIndex);
    }

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
    }

    return (
        <Fragment>
            <div className={resultsContainerClass}>
                {getPaginatedData().map((data, id) => mapFunction(data, id))}
            </div>
            <div className="pagination-component">
                <button
                    onClick={goToPreviousPage}
                    className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
                >
                    <span className="icon-caret-back-sharp" />
                </button>

                {/* show page numbers */}
                {getPaginationGroup().map((item, index) => (
                    <button
                      key={index}
                      onClick={changePage}
                      className={`pagination-item ${currentPage === item ? 'active' : null}`}
                    >
                      <span>{item}</span>
                    </button>
                ))}

                <button
                    onClick={goToNextPage}
                    className={`next ${currentPage === pages ? 'disabled' : ''}`}
                >
                    <span className="icon-caret-forward-sharp" />
                </button> 
            </div>
        </Fragment>
    );
}

export default Pagination;