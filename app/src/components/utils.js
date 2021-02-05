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
    unparsed_params.map(p=>{
        const p_arr = p.split('=');
        if (p_arr[1] !== '') params[p_arr[0]] = p_arr[1];
    })
    return params;
}