import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import Alert from "../../src/components/Alert";
import apiList from "../../src/api_interface/apiList";
import PaginatedLayout from "../../src/components/PaginatedLayout";
import Review from "./Review";
import ReviewCreateController from "./forms/ReviewCreateController";
import {SkeletonLoadingReviews} from "../../src/components/skeleton/SkeletonLoadingReviews";

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
            REVIEWS_LIST,
            pagination,
            setReviews,
            setWaiting,
            err => setAlert(<Alert close={e => setAlert(null)} text={err} type="danger"/>)
        )
    }, [pagination, reviewed])

    function createReviewCallback(data) {
        setReviewed(true);
    }

    return (
        <Fragment>
            {waiting ? SkeletonLoadingReviews : ''}
            {alert}
            {reviewed
                ? <Alert text='Thank you for reviewing!' type='success'/>
                : <div className="review form-container">
                    <div className="header">
                        <h3>Write a review</h3>
                        <p>How would you rate the resource?</p>
                    </div>
                    <ReviewCreateController data={{resource_id: RESOURCE_ID}} successCallback={createReviewCallback}/>
                </div>
            }
            {reviews.results
                ? <PaginatedLayout data={reviews.results} resultsCount={reviews.count} pagination={pagination}
                                   setPagination={setPagination}
                                   resultsContainerClass="reviews-list column-container"
                                   mapFunction={
                                       (item, idx) =>
                                           <Review
                                               key={'review' + item.pk}
                                               review={item}
                                           />
                                   }
                  />
                : (<div className="empty-div"><img src="/static/imgs/add_file.png"/>
                    <p className="empty-text">No Reviews Yet!</p>
                    <p className="empty-text">Be the first to write a review!</p>
                    </div>)
                }

                </Fragment>
                )
            }

            ReactDOM.render(<ResourceReviewsApp/>, document.querySelector('#reviews'))