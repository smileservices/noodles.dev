import React, {Fragment, useState} from "react";
import apiPost from "../../src/api_interface/apiPost";
import Alert from "../../src/components/Alert";
import {WaitingInline} from "../../src/components/Waiting";
export default function Thumbs({thumbs_obj, url_endpoint, user_id}) {

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
                        data => setAlert(<Alert close={e=>setAlert(null)}
                                text={ data.error || data.detail || "Operation forbidden"}
                                type="danger" hideable={false}
                                stick={false}
                            />)
                    );

                } else {
                    setAlert(<Alert close={e=>setAlert(null)}
                        text="Something went wrong :("
                        type="danger" hideable={false} stick={false}
                    />)
                }
            })
    }

    function getThumbsClass(initialClassList, votes) {
        if (votes.includes(user_id)) return initialClassList + ' ' + 'voted';
        return initialClassList;
    }

    if (waiting) return <WaitingInline text={waiting} />;
    if (alert) return alert;

    return (
        <Fragment>
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