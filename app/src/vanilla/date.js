export default function FormatDate(dateStr, type) {
    // type: date/datetime
    let dateObj = new Date(dateStr);

    function getDate() {
        return dateObj.getUTCDay()+'/'+dateObj.getUTCMonth()+'/'+dateObj.getUTCFullYear();
    }
    function getTime() {
        return dateObj.getUTCHours()+':'+dateObj.getUTCMinutes();
    }
    switch (type) {
        case 'date':
            return getDate();
        case 'datetime':
            return getDate() + ' ' +getTime();
        case 'html-date':
            return dateObj.toISOString().split('T')[0];
    }
}