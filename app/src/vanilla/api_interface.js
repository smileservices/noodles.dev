function getCsrfToken() {
    let value = "; " + document.cookie;
    let parts = value.split("; csrftoken=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export async function listRecords(
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
    // parse search
    url += '&search='+querySearch;
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

export async function detailRecord(
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

export async function createRecord(
    endpoint,
    formData,
    success,
    setWaiting, setError,
) {
    setWaiting('Creating');
    await fetch(endpoint, {
        method: "POST",
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'Accept': 'application/json',
        },
        body: formData
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

export async function updateRecord(
    endpoint,
    formData,
    id,
    success,
    setWaiting, setError,
) {
    setWaiting('Updating');
    await fetch(endpoint+id+'/', {
        method: "PUT",
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'Accept': 'application/json',
        },
        body: formData
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

export async function deleteRecord(
    endpoint,
    formData,
    id,
    success,
    setWaiting, setError,
) {
    setWaiting('Deleting');
    await fetch(endpoint+id+'/', {
        method: "DELETE",
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'Accept': 'application/json',
        },
        body: formData
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