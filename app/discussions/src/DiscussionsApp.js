import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import Alert from "../../src/components/Alert";
import apiList from "../../src/api_interface/apiList";
import PaginatedLayout from "../../src/components/PaginatedLayout";
import Post from "./Post";
import PostCreateController from "./forms/PostCreateController";
import {SkeletonLoadingReviews} from "../../src/components/skeleton/SkeletonLoadingReviews";

function DiscussionsApp() {
    const [posts, setPosts] = useState({});
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');

    const [pagination, setPagination] = useState({
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });

    useEffect(e => {
        apiList(
            RESOURCE_DISCUSSION_API_URL,
            pagination,
            setPosts,
            setWaiting,
            err => setAlert(<Alert close={e => setAlert(null)} text={err} type="danger"/>)
        )
    }, [pagination])

    function createPostCallback(data) {
        // only for root level posts
        setPosts({...posts, count: posts.count + 1, results: [data].concat(posts.results)});
    }

    return (
        <section className="discussion">
            <header><h2>Discussion Section</h2></header>
            {waiting ? SkeletonLoadingReviews : ''}
            {alert}
            {posts.results?.length
                ? <PaginatedLayout data={posts.results} resultsCount={posts.count} pagination={pagination}
                                   setPagination={setPagination}
                                   resultsContainerClass="posts"
                                   mapFunction={
                                       (item, idx) =>
                                           <Post
                                               key={'post' + item.pk}
                                               data={item}
                                           />
                                   }
                                   paginationLocation='both'
                />
                : (<div className="empty-div">
                    <p className="empty-text">No Discussions Yet!</p>
                    <p className="empty-text">Be the first to create a discussion thread!</p>
                </div>)
            }
            <div className="form-container">
                <PostCreateController successCallback={createPostCallback} parent=''/>
            </div>
        </section>
    )
}

ReactDOM.render(<DiscussionsApp/>, document.querySelector('#discussions-app'))