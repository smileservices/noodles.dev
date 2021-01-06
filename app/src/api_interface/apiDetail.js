import Waiting from "../components/Waiting";

export async function apiDetail(
    endpoint,
    pk,
    success,
    setWaiting, setError,
) {
    setWaiting(<Waiting text={'Retrieving data'}/>);
    let url = endpoint + pk + '/';
    await fetch(url, {
        method: "GET"
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