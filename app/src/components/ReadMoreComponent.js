import React, {useState, useEffect} from "react";
import apiList from "../../src/api_interface/apiList";

export default function ReadMoreComponent({endpoint, readMoreCallback, skeletonElement}) {
    const [state, setState] = useState({
        endpoint: endpoint,
        next_page: false,
        waiting: false,
        error: false
    })

    useEffect(() => {
        if (state.endpoint) readMore(state.endpoint);
    }, [])

    function readMore(url) {
        apiList(
            url,
            false,
            data => {
                readMoreCallback(data);
                setState({
                    ...state,
                    next_page: data.next
                })
            },
            waiting => setState({...state, waiting: waiting}),
            error => setState({...state, error: error})
        )
    }

    if (state.waiting) return skeletonElement;

    if (state.next_page) return (
        <div className="read-more" onClick={readMore}>More...</div>
    )
    return '';
}