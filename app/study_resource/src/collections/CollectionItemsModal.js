import React, {useState, useEffect, Fragment} from "react"
import Waiting from "../../../src/components/Waiting";
import Alert from "../../../src/components/Alert";
import apiList from "../../../src/api_interface/apiList";
import PaginatedLayout from "../../../src/components/PaginatedLayout";
import Modal from "../../../src/components/Modal";
import StudyResourceListing from "../StudyResourceListing";
import apiPost from "../../../src/api_interface/apiPost";

export default function CollectionItemsModal({collection, options, close}) {

    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        pk: collection.pk,
        remove: [],
    })

    const [pagination, setPagination] = useState({
        resultsPerPage: 10,
        current: 1,
        offset: 0
    });

    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');

    useEffect(e => {
        apiList(
            COLLECTIONS_ENDPOINT + collection.pk + "/resources/",
            pagination,
            setItems,
            setWaiting,
            err => setAlert(<Alert text={err} type="danger"/>),
        )
    }, [pagination, collection])

    function handleDelete(data) {
        setItems({
            ...items,
            count: items.count - 1,
            results: items.results.filter(c => data.pk !== c.pk)
        });
        setFormData({...formData, remove: [...formData.remove, data.pk]});
    }

    function submit(formData) {
        apiPost(
            USER_COLLECTIONS_UPDATE_ITEMS_ENDPOINT,
            formData,
            setWaiting,
        ).then(result => {
            if (result.ok) close();
            setAlert(<Alert text="Something went wrong" type="danger" stick={true}/>)
        })
    }

    function validate(formData, callback) {
        callback(formData);
    }

    return (
        <Modal close={close}>
            <form action="" onSubmit={e => {
                e.preventDefault();
                validate(formData, submit);
            }}>
                <div className="column-container">
                    <div className="header">
                        <h3>Collection {collection.name} items:</h3>
                    </div>
                    <PaginatedLayout data={items.results} resultsCount={items.count} pagination={pagination}
                                     setPagination={setPagination}
                                     resultsContainerClass="column-container items-container"
                                     mapFunction={item => <StudyResourceListing key={'resource' + item.pk} data={item}
                                                                                options={options}
                                                                                remove={e => handleDelete(item)}/>}
                    />
                </div>
                {alert}
                {waiting
                    ? waiting
                    : <button className="btn submit">Update</button>
                }
            </form>
        </Modal>
    );
}