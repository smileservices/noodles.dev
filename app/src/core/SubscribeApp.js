import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import SubscribeComponent from "../../notifications/src/SubscribeComponent";

function SubscribeApp() {

    return (
        <SubscribeComponent url_endpoint={ROUTES.subscribe_url} />
    )
}

ReactDOM.render(<SubscribeApp/>, document.getElementById('subscribe-app'));