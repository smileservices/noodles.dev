import {useEffect} from "react";

export const makeId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        let context = this, args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export function getCsrfToken() {
    return getCookie('csrftoken');
}

export function extractURLParams(str) {
    if (str === '') return false;
    let params = {};
    const unparsed_params = str.split("?").pop().split("&");
    unparsed_params.map(p => {
        const p_arr = p.split('=');
        if (p_arr[1] !== '') params[p_arr[0]] = p_arr[1];
    })
    return params;
}

export function whatType(item) {
    const typeStr = Object.prototype.toString.call(item).slice(8, -1);
    return typeStr.toLowerCase();
}

export function codeParamsToUrl(params, data) {
    switch (whatType(data)) {
        case 'object':
            return Object.keys(data).map(name => params.append(name, data[name]));
        case 'array':
            return data.map(f => {
                params.append(Object.keys(f)[0], Object.values(f)[0]);
            })
    }
}


export function decodeParamsFromUrl() {
    let filters = {};
    let sorting = '';
    let pagination = {};
    const paginationParamNames = ['resultsPerPage', 'current', 'offset'];
    const urlParams = new URLSearchParams(document.location.search);
    urlParams.delete('search');
    urlParams.delete('tab');
    sorting = urlParams.get('sort');
    urlParams.delete('sort');
    Array.from(urlParams, ([key, value]) => {
        const f = {};
        if (paginationParamNames.indexOf(key) > -1) {
            pagination[key] = Number(value);
        } else {
            filters[key] = value;
        }
    });
    return [filters, sorting, pagination]
}

export function updateUrl(url, params) {
    /*
    * url = string;
    * params = {search: searchTerm, tab: tabName, filters: filters,...}
    * */
    let paramsObj = new URLSearchParams();  // this is to be populated from scratch
    if (params['tab'] !== '') {
        paramsObj.set('tab', params['tab']);
        // process filters per tab only!
        if (params['filters'] && Object.keys(params['filters']).length > 0) {
            codeParamsToUrl(paramsObj, params['filters'])
        }
    }
    if (params['search']) {
        paramsObj.set('search', params['search']);
    }
    if (params['sort']) {
        paramsObj.set('sort', params['sort']);
    }
    history.pushState(null, 'Search', url + paramsObj.toString())
}


export function getAvailableFilters(aggregated, label, type) {
    if (!aggregated) return {};
    /*
    * filtername: string
    * aggregated: [{value: itemsCount}, ...]
    *
    * returns {label: string, type: string, options: [[value, text],...]}, ...}
    * */
    return {
        label: label,
        type: type,
        options: Object.keys(aggregated).map(value => [value, value + '(' + aggregated[value] + ')'])
    };
}


export function handleClickOutside(wrapperRef, callback) {
    (function (ref) {

        useEffect(() => {

            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback();
                }
            }

            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref])

    })(wrapperRef);
}
