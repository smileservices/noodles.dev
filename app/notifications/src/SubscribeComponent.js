import React, {useState, useEffect} from "react";
import {WaitingInline} from "../../src/components/Waiting";
import apiPost from "../../src/api_interface/apiPost";

export default function SubscribeComponent({url_endpoint}) {

    const [state, setState] = useState({
        subscribed: false,
        waiting: true,
        action: 'check'
    });

    if (!IS_AUTHENTICATED) return (<a className="btn contribute" href={URLS.login}><span
                className="icon-bookmark"/>Follow</a>)

    useEffect(() => {
        apiPost(
            url_endpoint,
            {action: state.action},
            val => setState({...state, waiting: val})
        ).then(result => {
            if (result.ok) {
                return result.json()
            } else {
                return false
            }
        }).then(data => {
            if (data) {
                setState({...state, waiting: false, subscribed: data['subscribed']})
            }
        })
    }, [state.action])

    if (state.waiting) return (
        <WaitingInline text="Processing"/>
    )

    if (state.subscribed) {
        return (
            <a className="btn primary contribute" onClick={e => {e.preventDefault(); setState({...state, action: 'unsubscribe'})}}><span
                className="icon-bookmark"/>Unfollow</a>
        )
    } else {
        return (
            <a className="btn contribute" onClick={e => {e.preventDefault(); setState({...state, action: 'subscribe'})}}><span
                className="icon-bookmark"/>Follow</a>
        )
    }
}