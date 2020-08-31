import {getCsrfToken} from "../components/utils";
import Waiting from "../components/Waiting";

export default async function apiDelete(
    endpoint,
    setWaiting,
    success, setError
) {
    setWaiting(<Waiting text={'Deleting'}/>);
    await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(result => {
        setWaiting('');
        if (result.ok) {
            success('Successfully deleted');
        } else {
            setError(result);
        }
    })
}