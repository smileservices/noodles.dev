import {Waiting} from "../components/Waiting";
import {Alert} from "../components/Alert";

export async function list(
    list_endpoint,
    dataName,
    setContent,
    displayData,
    pagination,
) {
    setContent({
        display: <Waiting text={'Retrieving ' + dataName + ' list ...'}/>,
        data: false
    })

    let url = list_endpoint;
    url += '?limit='+pagination.resultsPerPage+'&offset='+pagination.offset;

    await fetch(url, {
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
            display: displayData(data),
            data: data
        })
    })
}