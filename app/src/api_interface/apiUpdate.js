import {getCsrfToken} from "../components/utils";
import {WaitingButton} from "../components/Waiting";

export default async function apiUpdate(
    endpoint,
    id,
    data,
    success,
    setWaiting, setError,
) {
    setWaiting(<WaitingButton text="Updating"/>);
    await fetch(endpoint+id+'/', {
        method: "PUT",
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(result => {
        setWaiting('');
        if (result.ok) {
            return result.json();
        } else {
            setError(result)
            return false;
        }
    }).then(data => {
        if (data) success(data);
    })
}