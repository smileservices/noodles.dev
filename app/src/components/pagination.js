import {makeId} from "./utils";

export const PaginationDropdown = ({pagination, setPagination}) => {

    return (
        <div className="btn-group pagination">
            <button type="button" className="btn ink-reaction btn-flat dropdown-toggle" data-toggle="dropdown"
                    aria-expanded="false">
                {pagination.resultsPerPage} results per page <i className="fa fa-caret-down text-default-light"> </i>
            </button>
            <ul className="dropdown-menu animation-expand" role="menu">
                {pagination.options.map(
                    no => <li key={"pagination" + no} className={no === pagination.resultsPerPage ? 'selected' : ''}><a
                        onClick={e => {
                            e.preventDefault();
                            setPagination({...pagination, current: 1, resultsPerPage: no, offset: 0});
                        }}>{no}</a></li>
                )}
            </ul>
        </div>
    )
}

export const PaginationElement = ({pagination, resultsCount, setPagination}) => {
    const totalPages = Math.ceil(resultsCount / pagination.resultsPerPage);
    const handlePrevPage = (e) => {
        e.preventDefault();
        setPagination({
            ...pagination,
            offset: pagination.offset - pagination.resultsPerPage,
            current: pagination.current - 1
        });
    }
    const handleNextPage = (e) => {
        e.preventDefault();
        setPagination({
            ...pagination,
            offset: pagination.offset + pagination.resultsPerPage,
            current: pagination.current + 1
        });
    }
    const handlePageClick = (e, page) => {
        e.preventDefault();
        setPagination({...pagination, offset: pagination.resultsPerPage * (page - 1), current: page});
    }
    if (resultsCount === 0) return '';
    return (
        <ul className="pagination">
            {pagination.current > 1 ?
                <li key={makeId(4)} className="arrow" onClick={(e) => handlePrevPage(e)}>«</li>
                : ''
            }
            {Array.from({length: totalPages}).map((_, i) => {
                const pageNo = i + 1;
                const pageActive = pageNo === pagination.current;
                return (
                    <li key={makeId(4)} className={pageActive ? "active" : ""}
                        onClick={(e) => handlePageClick(e, pageNo)}
                    >
                        {pageNo}
                    </li>
                )
            })
            }
            {pagination.current < totalPages
                ? <li key={makeId(4)} className="arrow" onClick={(e) => handleNextPage(e)}>»</li>
                : ''
            }
        </ul>
    )
}