import React, {Fragment, useState} from "react";
import apiPost from "../../src/api_interface/apiPost";
import Alert from "../../src/components/Alert";
import {WaitingInline} from "./Waiting";

export default function VotableComponent({thumbs_obj, url_endpoint}) {

    /*
    *
    *   thumbs_obj = {
    *        up: int,
    *        down: int
    *     };
    *
    * */

    const [alert, setAlert] = useState('');
    const [waiting, setWaiting] = useState('');
    const [thumbs, setThumbs] = useState(thumbs_obj);

    function vote(e, val) {
        e.preventDefault();
        apiPost(
            url_endpoint,
            {vote: val},
            wait => wait ? setWaiting('Casting your vote') : setWaiting(''),
        ).then(
            result => {
                if (result.ok) {
                    result.json()
                        .then(data => {
                            setThumbs(data.thumbs)
                        });
                } else if (result.status === 403) {
                    result.json().then(
                        data => setAlert(<Alert close={e => setAlert(null)}
                                                text={data.error || data.detail || "Operation forbidden"}
                                                type="danger" hideable={false}
                                                stick={false}
                        />)
                    );

                } else {
                    setAlert(<Alert close={e => setAlert(null)}
                                    text="Something went wrong :("
                                    type="danger" hideable={false} stick={false}
                    />)
                }
            })
    }

    function voted_by_user(votesList) {
        if (!IS_AUTHENTICATED) return false;
        return votesList.includes(get_user_data().pk)
    }

    function getThumbsClass(initialClassList, votesList) {
        if (voted_by_user(votesList)) return initialClassList + ' ' + 'voted';
        return initialClassList;
    }

    if (waiting) return <WaitingInline text={waiting}/>;
    if (alert) return alert;

    return (
        <Fragment>
            <div key={'vote-up' + url_endpoint} className={getThumbsClass('up', thumbs.up)}>
                <a onClick={e => vote(e, 1)}>
                    <span>{thumbs.up.length}</span>
                    <span className="icon-thumbs-o-up"/>
                </a>
            </div>
            <div key={'vote-down' + url_endpoint} className={getThumbsClass('down', thumbs.down)}>
                <a onClick={e => vote(e, -1)}>
                    <span>{thumbs.down.length}</span>
                    <span className="icon-thumbs-o-down"/>
                </a>
            </div>
        </Fragment>
    )
}