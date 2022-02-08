export default async function apiFetch (
    url,
    setData,
    setLoading,
    setError = (err) => console.log(err),
) {
    setLoading(true);
    fetch(url)
        .then(result => {
            if (result.ok) {
                return result.json();
            } else {
                return result.statusText;
            }
        })
        .then(data => {
            const { results } = data;
            if (results && results.length) {
                setData(results);
            }
            setLoading(false);
        })
        .catch(error => {
            console.log(error);
            setLoading(false);
            setError(error);
        })
}