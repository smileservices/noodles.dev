import React from 'react';
import Waiting from "../components/Waiting";

export default async function apiList(
    list_endpoint,
    pagination,
    setData,
    setWaiting, setError,
    queryFilter, querySort, querySearch, abortSignal
) {
    setWaiting(<Waiting text={'Retrieving data'}/>);
    let url = list_endpoint;
    if (pagination) {
        url += '?limit=' + pagination.resultsPerPage + '&offset=' + pagination.offset;
    }
    // parse filter query
    if (queryFilter) {
        Object.keys(queryFilter).map(key => {
            url += '&' + key + '=' + queryFilter[key]
        })
    }
    // parse sort query
    if (querySort && Object.keys(querySort).length > 0) {
        url += '&ordering=';
        let orderArr = []
        Object.keys(querySort).map(key => {
            const direction = querySort[key];
            orderArr.push(direction + key);
        })
        url += orderArr.join(',');
    }
    // parse search query
    if (querySearch) url += '&search=' + querySearch;

    await fetch(url, {
        method: "GET",
        signal: abortSignal
    }).then(result => {
        setWaiting('');
        if (result.ok) {
            return result.json();
        } else {
            setError('Could not read data: ' + result.statusText)
        }
    }).then(data => {
        setData(data);
    }).catch(err => {
        if (err.name === 'AbortError') {
            console.log('Fetch was aborted');
        }
    });
}