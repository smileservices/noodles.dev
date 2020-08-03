export async function detail(
    endpoint,
    pk,
    success,
    setWaiting, setError,
) {
    setWaiting('Retrieving data');
    let url = endpoint+pk;
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