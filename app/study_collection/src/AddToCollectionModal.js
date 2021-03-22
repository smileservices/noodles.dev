import React, {useState, useEffect} from "react";
import {SelectReact} from "../../src/components/form";
import Alert from "../../src/components/Alert";
import apiPost from "../../src/api_interface/apiPost";
import Modal from "../../src/components/Modal";
import {FormElement} from "../../src/components/form";

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

        // make a single request for getting the user collections
        // and if the resource belongs to one of it
        // should get data in select options format

        setWaiting("Retrieving your collections");
        //get collections
        fetch(
            USER_COLLECTIONS_WITH_RESOURCE
        ).then(result => {
            setWaiting('');
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text={result.statusText} type='danger'/>)
            }
        }).then(data => {
            setCollections(data.all)
            setFormData({
                ...formData,
                collections: data.selected
            })
        });
    }, [])

    function submit(data) {
        apiPost(
            USER_COLLECTIONS_SET_API + '?pk=' + RESOURCE_ID,
            data,
            wait => wait ? setWaiting('Adding resource to selected collections') : setWaiting(false),
        ).then(result => {
            if (result.ok) {
                setAlert(<Alert close={e => setAlert(null)} text="Updated successfully" type="success" hideable={false}
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
            <header><h3>Manage Collections</h3></header>
            <FormElement
                data={formData}
                callback={data => {
                    validate({
                        collections: data.collections ? data.collections.map(c => c.value) : []
                    }, submit);
                }}
                waiting={waiting}
                alert={alert}
            >
                <div className="row">
                    <SelectReact
                        id="collection"
                        label="Collections"
                        smallTextUnder={
                            (<span>
                                    <p>Select one or more collections for this resource.</p>
                                    <p><a href={MANAGE_COLLECTIONS_URL}>Manage your collections here</a></p>
                                </span>)

                        }
                        options={collections}
                        value={formData.collections}
                        props={{isMulti: true, placeholder: "No collection"}}
                        onChange={selected => setFormData({...formData, collections: selected})}
                        error={errors.collections}
                        isDisabled={Boolean(waiting)}
                    />
                </div>
            </FormElement>
        </Modal>
    )
}