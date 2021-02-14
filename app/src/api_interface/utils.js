import {getCsrfToken} from "../components/utils";

export function formDataTransport(data, contentType) {
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