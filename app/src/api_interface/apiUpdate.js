import {formDataTransport} from "./utils";

export default async function apiUpdate(
    endpoint,
    id,
    data,
    success,
    setWaiting, setError, contentType
) {
    setWaiting('Updating');
    const [body, headers] = formDataTransport(data, contentType);
    await fetch(endpoint+id+'/', {
        method: "PUT",
        headers: headers,
        body: body
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