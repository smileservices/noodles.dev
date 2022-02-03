import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import VotableComponent from "../components/VotableComponent";

function VotesApp() {
    let votes_data = {
        up: RESULT.thumbs_up_array,
        down: RESULT.thumbs_down_array
    }

    return (
        <VotableComponent
            thumbs_obj={votes_data}
            url_endpoint={ROUTES.vote_url}
        />
    )
}

ReactDOM.render(<VotesApp/>, document.getElementById('votes-app'));