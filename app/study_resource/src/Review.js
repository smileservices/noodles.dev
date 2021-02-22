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

    const author_full_name = review.author.get_full_name;
    const api_vote_url_endpoint = REVIEW_API + review.pk + '/vote/';
    const current_owner = review.author.id === USER_ID;

    function remove() {
        apiDelete(
            REVIEW_API + review.pk + '/',
            setWaiting,
            text => setDeleted(text),
            data => setAlert(<Alert close={e=>setAlert(null)} text='An error occured' type='danger'/>)
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
        return (<span className="delete" onClick={e => setConfirm(true)}>delete</span>)
    }

    let date = new Date(review.created_at);
    let thumbs_obj = {
        up: review.thumbs_up_array,
        down: review.thumbs_down_array
    };
    if (deleted) return <Alert text={deleted} type='success'/>;
    return (
        <div className={current_owner ? 'card review highlighted' : 'card review'}>
            {waiting}
            {alert}
            <div className="rating">
                <span className="stars"><StarRating rating={review.rating} maxRating={MAX_RATING} /></span>
            </div>
            <p className="published">{date.toUTCString()} by {author_full_name}</p>
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