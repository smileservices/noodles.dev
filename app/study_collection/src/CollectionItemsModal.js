import React, {useState, useEffect, Fragment} from "react"

import {
    sortableContainer,
    sortableElement,
    sortableHandle,
} from 'react-sortable-hoc';

import Waiting from "../../src/components/Waiting";
import Alert from "../../src/components/Alert";
import Modal from "../../src/components/Modal";
import StudyResourceListingCompact from "./StudyResourceListingCompact";
import apiPost from "../../src/api_interface/apiPost";

export default function CollectionItemsModal({collection, setMainAlert, close}) {

    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState([]);

    const [changed, setChanged] = useState(false);

    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');

    function setOrder(items) {
        let cloned_items = JSON.parse(JSON.stringify(items));
        cloned_items.map((res, i) => {
            res.order = i;
        })
        return cloned_items;
    }

    function reset() {
        setFormData(setOrder(items));
        setChanged(false);
    }


    useEffect(e => {
        setWaiting(<Waiting text="Retrieving items"/>)
        fetch(
            COLLECTIONS_API + collection.pk + "/resources/", {method: 'GET'}
        ).then(result => {
            setWaiting('');
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve collection items" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setItems(data);
                setFormData(setOrder(data));
            }
        })
    }, [collection,])

    function handleSoftDelete(data) {
        let new_list = formData.filter(c => data.pk !== c.study_resource.pk);
        setFormData(setOrder(new_list));
        if (!changed) setChanged(true);
    }

    function changeOrder(source_idx, dest_idx) {
        let new_list = JSON.parse(JSON.stringify(formData));
        new_list.splice(dest_idx, 0, new_list.splice(source_idx, 1)[0]);
        setFormData(setOrder(new_list));
        setChanged(true);
    }

    function submit() {
        const submit_data = {
            pk: collection.pk,
            resources: formData.map(item => {
                return {pk: item.study_resource.pk, order: item.order}
            })
        }
        apiPost(
            USER_COLLECTIONS_UPDATE_ITEMS_API,
            submit_data,
            setWaiting,
        ).then(result => {
            if (result.ok) {
                setAlert(<Alert text={'Collection ' + collection.name + ' updated'} type='success'
                                hideable={false} stick={false} close={e => setAlert('')}/>);
                setChanged(false);
            }
            setAlert(<Alert close={e => setAlert(null)} text="Something went wrong" type="danger" stick={true}/>)
        })
    }

    const DragHandle = sortableHandle(() => <span className="sort-handle">::</span>);

    const SortableItem = sortableElement(({value}) => (
        <div className="resource">
            <DragHandle/>
            {value}
        </div>
    ));

    const SortableContainer = sortableContainer(({children}) => {
        return <div className="column-container items-container">{children}</div>;
    });

    const onSortEnd = ({oldIndex, newIndex}) => {
        changeOrder(oldIndex, newIndex);
    };

    return (
        <Modal close={close}>
            <div className="collection-items-modal column-container">
                <header>
                    <h3>Collection {collection.name} items:</h3>
                </header>
                {alert}
                {waiting}
                <SortableContainer onSortEnd={onSortEnd} useDragHandle helperClass='sortableHelper'>
                    {formData.map((item, index) => {
                            const value = (
                                <StudyResourceListingCompact
                                    key={'resource' + item.study_resource.pk}
                                    data={item.study_resource}
                                    remove={e => handleSoftDelete(item.study_resource)}
                                />
                            );
                            return <SortableItem key={`item-` + index} index={index} value={value}/>
                        }
                    )}
                </SortableContainer>
                <div className="buttons-container">
                    <button className="btn" disabled={!changed} onClick={submit}>Apply</button>
                    <button className="btn" disabled={!changed} onClick={reset}>Reset</button>
                </div>
            </div>
        </Modal>
    );
}