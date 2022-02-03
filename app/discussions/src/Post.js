import React, {useState} from "react";
import VotableComponent from "../../src/components/VotableComponent";
import apiDelete from "../../src/api_interface/apiDelete";
import Alert from "../../src/components/Alert";
import ReadMoreComponent from "../../src/components/ReadMoreComponent";

import PostCreateController from "./forms/PostCreateController";
import {SkeletonLoadingPosts} from "./SkeletonDiscussion";

export default function Post({data}) {
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [deleted, setDeleted] = useState(false);
    const [confirm, setConfirm] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replies, setReplies] = useState({
        show: false,
        count: data.replies_count,
        list: []
    })

    const current_owner = () => {
        if (!IS_AUTHENTICATED) return false;
        return data.author.pk === get_user_data().pk;
    };

    function remove() {
        apiDelete(
            data.urls.detail,
            setWaiting,
            text => setDeleted(text),
            data => setAlert(<Alert close={e => setAlert(null)} text='An error occured' type='danger'/>)
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

    function readMoreCallback(response) {
        setReplies({
            ...replies,
            show: true,
            list: response.results.concat(replies.list)
        });
    }

    function replyCallback(new_reply) {
        setShowReplyForm(false)
        setReplies({
            show: true,
            count: replies.count + 1,
            list: [new_reply].concat(replies.list)
        })
    }

    function toggleShowReplies(value) {
        if (replies.count === 0) return null;
        if (!value) {
            setReplies({...replies, list: [], show: value})
        } else {
            setReplies({...replies, show: value});
        }
    }


    let date = new Date(data.created_at);
    let thumbs_obj = {
        up: data.thumbs_up_array,
        down: data.thumbs_down_array
    };
    if (deleted) return <Alert text={deleted} type='success'/>;

    return (
        <div className='post-container'>
            {waiting}
            {alert}
            <div className={"post card" + (current_owner() ? ' own' : '')}>
                {current_owner()
                    ? <div className="toolbar">{deleteElement(confirm)}</div>
                    : ''
                }
                <div className="text">{data.text}</div>
                <div className="footer">
                    <div className="actions">
                        <div className="left">
                            {replies.count ?
                                <div className="replies-count">
                                    <a href="#" onClick={e => {
                                        e.preventDefault();
                                        toggleShowReplies(!replies.show);
                                    }}>
                                        {replies.count} replies ({replies.show ? 'hide' : 'show'})
                                    </a>
                                </div>
                                : ''}
                            {replies.show || replies.count === 0 ?
                                <div className="reply"><a href="#" onClick={e => {
                                    e.preventDefault();
                                    setShowReplyForm(!showReplyForm);
                                }}>Reply</a></div>
                                : ''}
                        </div>
                        <div className="right thumbs">
                            <VotableComponent
                                thumbs_obj={thumbs_obj}
                                url_endpoint={data.urls.vote}
                            />
                        </div>
                    </div>
                    <div className="poster-info">
                        <div className="author">
                            <div className="name">
                                <a className="author" href={data.author.profile_url}>{data.author.username}</a>
                                <div className="meta">
                                    <div className="row">{data.author.community_score} noodles</div>
                                </div>
                            </div>
                        </div>
                        <div className="date">
                            <p className="posted">{date.toUTCString()}</p>
                        </div>
                    </div>
                </div>
            </div>
            {showReplyForm
                ? <div className="replies"><div className="form-container">
                    <PostCreateController
                        successCallback={replyCallback}
                        parent={data.pk}
                        cancel={() => setShowReplyForm(false)}
                    />
                </div></div>
                : ''
            }
            {replies.count && replies.show ?
                <div className="replies">
                    {replies.list?.map(reply_data => <Post key={'post' + reply_data.pk} data={reply_data}/>)}
                    <ReadMoreComponent
                        endpoint={replies.count ? data.urls.replies : false}
                        readMoreCallback={readMoreCallback}
                        skeletonElement={SkeletonLoadingPosts(replies.count > 5 ? 5 : replies.count)}
                    />
                </div>
                : ''
            }
        </div>
    )
}