import {getCsrfToken} from "../components/utils";
import Waiting from "../components/Waiting";

export default async function apiCreate(
    endpoint,
    data,
    success,
    setWaiting, setError,
    handleSuccessHeaders
) {
    setWaiting(<Waiting text={'Please wait'} />);
    await fetch(endpoint, {
        method: "POST",
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(result => {
        setWaiting('');
        if (result.ok) {
            if (handleSuccessHeaders) handleSuccessHeaders(result.headers);
            return result.json();
        } else {
            setError(result)
            return false;
        }
    }).then(data => {
        if (data) success(data);
    })
}