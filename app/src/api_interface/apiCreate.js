import {formDataTransport} from "./utils";

export default async function apiCreate(
    endpoint,
    data,
    success,
    setWaiting, setError, contentType
) {
    setWaiting('Creating');
    const [body, headers] = formDataTransport(data, contentType);
    await fetch(endpoint, {
        method: "POST",
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