import React, {useState} from "react";
import StarRating from "../../src/components/StarRating";
import Thumbs from "./Thumbs";
import apiDelete from "../../src/api_interface/apiDelete";
import Alert from "../../src/components/Alert";

export default function Review({review}) {
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [deleted, setDeleted] = useState(false);
    const [confirm, setConfirm] = useState('');

    const author_full_name = review.author.first_name + ' ' + review.author.last_name;
    const api_vote_url_endpoint = REVIEW_API_ENDPOINT + review.pk + '/vote/';
    const current_owner = review.author.id === USER_ID;

    function remove() {
        apiDelete(
            REVIEW_API_ENDPOINT + review.pk + '/',
            setWaiting,
            text => setDeleted(text),
            data => setAlert(<Alert text='An error occured' type='danger'/>)
        )
    }

    function deleteElement(confirm) {
        if (confirm) {
            return (
                <div className="confirm">
                    <span className="text">Are you sure?</span>
                    <span className="option delete" onClick={remove}>yes</span>
                    <span className="option" onClick={e => setConfirm(false)}>cancel</span>
                </div>
            );
        }
        return (<span className="delete icon-close" onClick={e => setConfirm(true)}/>)
    }

    let date = new Date(review.created_at);
    let thumbs_obj = {
        up: review.thumbs_up_array,
        down: review.thumbs_down_array
    };
    if (deleted) return <Alert text={deleted} type='success'/>;
    return (
        <div className={current_owner ? 'review highlighted' : 'review'}>
            {waiting}
            {alert}
            <p className="rating"><StarRating rating={review.rating} maxRating={MAX_RATING}/></p>
            <p className="date">{date.toUTCString()}</p>
            <p className="author">by {author_full_name}</p>
            {current_owner
                ? <div className="toolbar">{deleteElement(confirm)}</div>
                : ''
            }
            <p className="text">{review.text}</p>
            <div className="thumbs">
                <Thumbs
                    thumbs_obj={thumbs_obj}
                    user_id={USER_ID}
                    url_endpoint={api_vote_url_endpoint}
                />
            </div>
        </div>
    )
}