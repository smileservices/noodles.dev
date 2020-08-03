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
    // parse sort query
    if (Object.keys(querySort).length > 0) {
        url += '&ordering=';
        let orderArr = []
        Object.keys(querySort).map(key => {
            const direction = querySort[key];
            orderArr.push(direction + key);
        })
        url += orderArr.join(',');
    }
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