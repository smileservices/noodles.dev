export default function FormatDate(dateStr, type) {
    // type: date/datetime
    let dateObj = new Date(dateStr);
    const locale = navigator.languages != undefined ? navigator.languages[0] : navigator.language;
    const fullMonth = dateObj.toLocaleDateString(locale, {month: 'long'});

    function getDate() {
        return dateObj.getUTCDate()+' '+fullMonth+' '+dateObj.getUTCFullYear();
    }
    function getTime() {
        return dateObj.getUTCHours()+':'+dateObj.getUTCMinutes();
    }
    switch (type) {
        case 'date':
            return getDate();
        case 'datetime':
            return getDate() + ', ' +getTime();
        case 'html-date':
            return dateObj.toISOString().split('T')[0];
    }
}