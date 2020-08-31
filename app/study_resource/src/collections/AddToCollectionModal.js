import React, {useState, useEffect} from "react";
import ReactDom from "react-dom";
import {SelectReact} from "../../../src/components/form";
import Waiting from "../../../src/components/Waiting";
import Alert from "../../../src/components/Alert";
import apiPost from "../../../src/api_interface/apiPost";
const body = document.querySelector('body')

export function openAddCollectionModal() {
    let modalElem = document.createElement('div');
    let yOffset = window.pageYOffset;
    modalElem.setAttribute('id', 'modal')
    body.append(modalElem);
    body.classList.add('modal-open');
    ReactDom.render(<AddToCollectionModal />, modalElem);
    modalElem.querySelector('.modal-container').style.setProperty('top', yOffset);
}

export function closeAddCollectionModal() {
    let modalElem = document.getElementById('modal');
    modalElem.remove();
    body.classList.remove('modal-open');
}

function AddToCollectionModal() {
    const emptyForm = {
        'collections': []
    }
    const [collections, setCollections] = useState([]);
    const [collectionCreateForm, setCollectionCreateForm] = useState(false);
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
                setAlert(<Alert text={result.statusText} type='danger'/>)
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
                setAlert(<Alert text="Modified successfully" type="success"/>);
                setTimeout(e => closeAddCollectionModal(), 1000);
            } else {
                setAlert(<Alert text="There was a problem" type="danger"/>)
            }
        })
    }

    function validate(data, callback) {
        let vErrors = {};
        if (Object.keys(vErrors).length > 0) {
            setErrors(vErrors);
            setAlert(<Alert text="There are errors on your form" type="danger"/>)
        } else {
            callback(data);
        }
    }

    return (
        <div className="modal-container" onClick={e => closeAddCollectionModal()}>
            <div className="form-container full-page-sm" onClick={e => e.stopPropagation()}>
                <div className="toolbar">
                    <span className="icon-close" onClick={e => closeAddCollectionModal()}/>
                </div>
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
            </div>
        </div>
    )
}