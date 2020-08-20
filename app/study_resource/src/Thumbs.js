import React, {Fragment, useState} from "react";
import apiPost from "../../src/api_interface/apiPost";
import Alert from "../../src/components/Alert";

export default function Thumbs({thumbs_obj, url_endpoint, user_id}) {

    const [alert, setAlert] = useState('');
    const [waiting, setWaiting] = useState('');
    const [thumbs, setThumbs] = useState(thumbs_obj);

    function vote(e, val) {
        e.preventDefault();
        apiPost(
            url_endpoint,
            {vote: val},
            setWaiting,
        ).then(
            result => {
                if (result.ok) {
                    result.json()
                        .then(data => {
                            setThumbs(data.thumbs)
                        });
                } else if (result.status === 403) {
                    setAlert(<Alert
                        text="Only signed in users can rate reviews"
                        type="danger" hideable={false}
                        stick={false}
                    />)
                } else {
                    result.json().then(
                        data => setAlert(<Alert
                            text={data.error ? data.error : data.detail}
                            type="danger" hideable={false} stick={false}
                        />)
                    )
                }
            })
    }

    function getThumbsClass(initialClassList, votes) {
        if (votes.includes(user_id)) return initialClassList + ' ' + 'voted';
        return initialClassList;
    }

    if (waiting) return waiting;

    return (
        <Fragment>
            {alert}
            <div key={'vote-down' + url_endpoint} className={getThumbsClass('down', thumbs.down)}>
                <a onClick={e => vote(e, -1)}>
                    <span className="icon-thumbs-o-down"/>
                    <span>{thumbs.down.length}</span>
                </a>
            </div>
            <div key={'vote-up' + url_endpoint} className={getThumbsClass('up', thumbs.up)}>
                <a onClick={e => vote(e, 1)}>
                    <span className="icon-thumbs-o-up"/>
                    <span>{thumbs.up.length}</span>
                </a>
            </div>
        </Fragment>
    )
}