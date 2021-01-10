import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import Alert from "../../src/components/Alert";
import apiList from "../../src/api_interface/apiList";
import PaginatedLayout from "../../src/components/PaginatedLayout";
import Review from "./Review";
import ReviewForm from "./forms/ReviewForm";

function ResourceReviewsApp() {
    const [reviews, setReviews] = useState([]);
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [reviewed, setReviewed] = useState(false);

    const [pagination, setPagination] = useState({
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });

    useEffect(e => {
        apiList(
            REVIEWS_LIST_API_ENDPOINT,
            pagination,
            setReviews,
            setWaiting,
            err => setAlert(<Alert close={e=>setAlert(null)} text={err} type="danger"/>)
        )
    }, [pagination, reviewed])

    function createReviewCallback(data) {
        setReviewed(true);
    }

    return (
        <Fragment>
            <h3>Reviews</h3>
            {waiting}
            {alert}
            <PaginatedLayout data={reviews.results} resultsCount={reviews.count} pagination={pagination}
                             setPagination={setPagination}
                             resultsContainerClass="column-container"
                             mapFunction={
                                 (item, idx) =>
                                     <Review
                                         key={'review' + item.pk}
                                         review={item}
                                     />
                             }
            />
            {reviewed
                ? <Alert text='Thank you for reviewing!' type='success'/>
                : <div className="review form-container">
                    <div className="header">
                        <h3>Write Review</h3>
                    </div>
                    <ReviewForm createReviewCallback={createReviewCallback}/>
                </div>
            }
        </Fragment>
    )
}

ReactDOM.render(<ResourceReviewsApp/>, document.querySelector('#reviews'))