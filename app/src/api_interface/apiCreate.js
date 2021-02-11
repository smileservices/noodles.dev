import {getCsrfToken} from "../components/utils";
import {WaitingButton} from "../components/Waiting";

function formDataTransport(data, contentType) {
    switch (contentType) {
        case 'multipart':
            return [
                data,
                {
                    'X-CSRFToken': getCsrfToken(),
                    'Accept': '*/*',
                }];
        case 'json':
            return [
                JSON.stringify(data),
                {
                    'X-CSRFToken': getCsrfToken(),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }]
        default:
            console.error('ApiCreate: must specify the content type! json/multipart supported now')
    }
}

export default async function apiCreate(
    endpoint,
    data,
    success,
    setWaiting, setError,
    contentType
) {
    setWaiting(<WaitingButton text={'Creating'}/>);
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