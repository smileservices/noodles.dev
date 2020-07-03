export async function list(
    list_endpoint,
    pagination,
    setData,
    setWaiting, setError,
    queryFilter, querySort, querySearch
) {
    setWaiting('Retrieving data');
    let url = list_endpoint;
    url += '?limit='+pagination.resultsPerPage+'&offset='+pagination.offset;
    // parse filter query
    Object.keys(queryFilter).map(key => {
        url += '&'+key+'='+queryFilter[key]
    })
    await fetch(url, {
        method: "GET"
    }).then(result => {
        setWaiting('');
        if (result.ok) {
            return result.json();
        } else {
            setError('Could not read data: ' + result.statusText)
        }
    }).then(data => {
        setData(data);
    })
}