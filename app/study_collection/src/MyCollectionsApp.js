import React, {useState, useEffect, Fragment} from "react"
import ReactDOM from "react-dom";
import Alert from "../../src/components/Alert";
import apiList from "../../src/api_interface/apiList";
import PaginatedLayout from "../../src/components/PaginatedLayout";
import CreateableComponent from "../../src/components/CreateableComponent";
import EditableComponent from "../../src/components/EditableComponent";

import CollectionForm from "./CollectionForm";
import CollectionListing from "./CollectionListing";
import {SkeletonLoadingCollections} from "../../src/components/skeleton/SkeletonLoadingCollections";

function MyCollectionsApp() {

    /*
    * Displays a modal for managing the resource in relation to the user collections
    *
    * If the resource is already in a collection, display it
    * Can add/remove the resource from collection
    * Can create new collection and add the resource to it
    *
    * List the resources in a chosen collection
    * */

    const [collections, setCollections] = useState([]);

    const [pagination, setPagination] = useState({
        resultsPerPage: 10,
        current: 1,
        offset: 0
    });

    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [detailModal, setDetailModal] = useState('');

    useEffect(e => {
        apiList(
            USER_COLLECTIONS_LIST,
            pagination,
            setCollections,
            setWaiting,
            err => setAlert(<Alert close={e => setAlert(null)} text={err} type="danger"/>),
        )
    }, [pagination])

    function handleDelete(data) {
        setCollections({
            ...collections,
            count: collections.count - 1,
            results: collections.results.filter(c => data.pk !== c.pk)
        });
        setAlert(<Alert close={e => setAlert(null)} text={"Deleted collection " + data.name} type="warning"
                        stick={false}/>);
    }

    return (
        <Fragment>
            <CreateableComponent
                endpoint={COLLECTIONS_API}
                data={{}}
                extraData={{addButtonText: 'Create Collection', formTitle: 'Create Collection'}}
                FormViewComponent={CollectionForm}
                successCallback={data => setPagination({...pagination, current: 1})}
            />
            {waiting ? SkeletonLoadingCollections : ''}
            {alert}
            <PaginatedLayout data={collections.results} resultsCount={collections.count} pagination={pagination}
                             setPagination={setPagination}
                             mapFunction={item => {
                                 return (<EditableComponent
                                     key={'collection' + item.pk}
                                     endpoint={COLLECTIONS_API}
                                     data={item}
                                     extraData={{
                                         setModal: setDetailModal,
                                         setAlert: setAlert,
                                         formTitle: 'Edit Collection'
                                     }}
                                     DisplayViewComponent={CollectionListing}
                                     FormViewComponent={CollectionForm}
                                     updateCallback={data => setPagination({...pagination, current: 1})}
                                     deleteCallback={() => handleDelete(item)}
                                 />)
                             }}
                             resultsContainerClass="column-container"
            />
            {detailModal}
        </Fragment>
    );
}

ReactDOM.render(<MyCollectionsApp/>, document.getElementById('collections-app'));