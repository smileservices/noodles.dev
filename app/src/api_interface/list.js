import {Waiting} from "../components/Waiting";
import {Alert} from "../components/Alert";

export function list(
    list_endpoint,
    dataName,
    setContent,
    mapForDisplay
) {

    setContent({
        display: <Waiting text={'Retrieving ' + dataName + ' list ...'}/>,
        data: false
    })

    fetch(list_endpoint, {
        method: "GET"
    }).then(result => {
        if (result.ok) {
            return result.json();
        } else {
            setContent({
                display: <Alert text={'Could not read ' + dataName + ' data: ' + result.statusText} type="danger"/>,
                data: false
            })
        }
    }).then(data => {
        setContent({
            display: mapForDisplay(data),
            data: data
        })
    })
}