import {getCsrfToken} from "../components/utils";

export async function update(
    endpoint,
    data,
    id,
    success,
    setWaiting, setError,
) {
    setWaiting('Updating ...');
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
        }
    }).then(data => {
        success(data);
    })
}