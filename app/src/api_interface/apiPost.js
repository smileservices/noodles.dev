import {getCsrfToken} from "../components/utils";
import Waiting from "../components/Waiting";

export default async function apiPost(
    endpoint,
    data,
    setWaiting
) {
    setWaiting(<Waiting text={'Please wait'}/>);
    return await fetch(endpoint, {
        method: "POST",
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(result => {
        setWaiting('');
        return result;
    })
}