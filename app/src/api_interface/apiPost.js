import {getCsrfToken} from "../components/utils";

export default async function apiPost(
    endpoint,
    data,
    setWaiting
) {
    setWaiting(true);
    return await fetch(endpoint, {
        method: "POST",
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(result => {
        setWaiting(false);
        return result;
    })
}