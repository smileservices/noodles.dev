import React, {useState, useEffect} from "react";
import {SelectReact} from "../../../src/components/form";
import Waiting from "../../../src/components/Waiting";
import Alert from "../../../src/components/Alert";
import apiPost from "../../../src/api_interface/apiPost";
import Modal from "../../../src/components/Modal";


export default function AddToCollectionModal({close}) {
    const emptyForm = {
        'collections': []
    }

    const [collections, setCollections] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState(emptyForm);
    const [alert, setAlert] = useState('');
    const [waiting, setWaiting] = useState('');

    useEffect(e => {
        setWaiting(<Waiting text="Retrieving your collections"/>);
        //get collections
        let colP = fetch(
            USER_COLLECTIONS_ENDPOINT + '?pk=' + RESOURCE_ID
        ).then(result => {
            setWaiting('');
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text={result.statusText} type='danger'/>)
            }
        }).then(data => {
            setCollections(data.all.map(c => {
                return {value: c.pk, label: c.name}
            }))
            setFormData({
                ...formData,
                collections: data.selected.map(c => {
                    return {value: c.pk, label: c.name}
                })
            })
        });
    }, [])

    function submit(data) {
        apiPost(
            USER_COLLECTIONS_SET_ENDPOINT + '?pk=' + RESOURCE_ID,
            data,
            setWaiting,
        ).then(result => {
            if (result.ok) {
                setAlert(<Alert close={e => setAlert(null)} text="Modified successfully" type="success" hideable={false}
                                stick={true}/>);
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="There was a problem" type="danger" hideable={false}
                                stick={true}/>)
            }
        })
    }

    function validate(data, callback) {
        let vErrors = {};
        if (Object.keys(vErrors).length > 0) {
            setErrors(vErrors);
            setAlert(<Alert close={e => setAlert(null)} text="There are errors on your form" type="danger"/>)
        } else {
            callback(data);
        }
    }

    return (
        <Modal close={close}>
            <div className="header">
                <h3>Manage Collections</h3>
            </div>
            <form action="" onSubmit={e => {
                e.preventDefault();
                validate({
                    collections: formData.collections ? formData.collections.map(c => c.value) : []
                }, submit);
            }}>
                <div className="row">
                    <SelectReact
                        id="collection"
                        label="Collections"
                        smallText={
                            <span>
                                    <p>Select one or more collections for this resource.</p>
                                    <p><a href={URL_USER_COLLECTIONS}>Manage your collections here</a></p>
                                </span>

                        }
                        options={collections}
                        value={formData.collections}
                        props={{isMulti: true, placeholder: "No collection"}}
                        onChange={selected => setFormData({...formData, collections: selected})}
                        error={errors.collections}
                        isDisabled={Boolean(waiting)}
                    />
                </div>
                {alert}
                {waiting ? waiting
                    : <button className="btn submit" type="submit">Set</button>
                }
            </form>
        </Modal>
    )
}