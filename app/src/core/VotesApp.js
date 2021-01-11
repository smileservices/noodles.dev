import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import Thumbs from "../../study_resource/src/Thumbs";

function VotesApp() {
    let votes_data = {
        up: RESULT.thumbs_up_array,
        down: RESULT.thumbs_down_array
    }

    return (
        <Thumbs
            thumbs_obj={votes_data}
            user_id={USER_ID}
            url_endpoint={RESULT.vote_url}
        />
    )
}

ReactDOM.render(<VotesApp/>, document.getElementById('votes-app'));