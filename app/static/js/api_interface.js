function ApiInterface(action, debug=false) {
    function getCsrfToken() {
        let value = "; " + document.cookie;
        let parts = value.split("; csrftoken=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    async function listRecords(
        list_endpoint,
        pagination,
        setData,
        setWaiting, setError,
        queryFilter, querySort, querySearch
    ) {
        setWaiting('Retrieving data');
        let url = list_endpoint;
        url += '?limit=' + pagination.resultsPerPage + '&offset=' + pagination.offset;
        // parse filter query
        Object.keys(queryFilter).map(key => {
            url += '&' + key + '=' + queryFilter[key]
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
        url += '&search=' + querySearch;
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

    async function detailRecord(
        endpoint,
        pk,
        success,
        setWaiting, setError,
    ) {
        setWaiting('Retrieving data');
        let url = endpoint + pk;
        await fetch(url, {
            method: "GET"
        }).then(result => {
            setWaiting('');
            if (result.ok) {
                return result.json();
            } else {
                setError(result);
                return false;
            }
        }).then(data => {
            if (data) success(data);
        })
    }

    async function createRecord(
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
                setError(result);
                return false;
            }
        }).then(data => {
            if (data) success(data);
        })
    }

    async function updateRecord(
        endpoint,
        formData,
        id,
        success,
        setWaiting, setError,
    ) {
        setWaiting('Updating');
        await fetch(endpoint + id + '/', {
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
                setError(result);
                return false;
            }
        }).then(data => {
            if (data) success(data);
        })
    }

    async function deleteRecord(
        endpoint,
        formData,
        id,
        success,
        setWaiting, setError,
    ) {
        setWaiting('Deleting');
        await fetch(endpoint + id + '/', {
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
                setError(result);
                return false;
            }
        }).then(data => {
            if (data) success(data);
        })
    }

        switch (action) {
            case 'list':
                return listRecords;
            case 'detail':
                return detailRecord;
            case 'update':
                return updateRecord;
            case 'create':
                return createRecord;
            case 'delete':
                return deleteRecord;
            default:
                return [listRecords, detailRecord, updateRecord, createRecord, deleteRecord];
        }
}

function CreateWaitingElement(text) {
    let container = document.createElement('div')
    container.classList.add('waiting-container')
    let textEl = document.createElement('span')
    textEl.classList.add('text');
    textEl.innerText = text;
    let iconEl = document.createElement('span');
    iconEl.classList.add('icon-hour-glass', 'spin-stop');
    container.appendChild(iconEl);
    container.appendChild(textEl);
    return container
}