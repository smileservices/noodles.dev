import {getCsrfToken} from "../components/utils";

export async function create(
    endpoint,
    data,
    success,
    setWaiting, setError,
) {
    setWaiting('Creating ...');
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
            return result.json();
        } else {
            setError(result)
        }
    }).then(data => {
        success(data);
    })
}