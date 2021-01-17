import React, {useState, useEffect, Fragment} from "react"
import ReactDOM from "react-dom";
import Waiting from "../../../src/components/Waiting";
import Alert from "../../../src/components/Alert";
import apiList from "../../../src/api_interface/apiList";
import PaginatedLayout from "../../../src/components/PaginatedLayout";
import Collection from "./Collection";
import CreateableComponent from "../../../src/components/CreateableComponent";
import CollectionItemsModal from "./CollectionItemsModal";
import CollectionForm from "../forms/CollectionForm";

function UserCollectionsApp() {

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
            err => setAlert(<Alert close={e=>setAlert(null)} text={err} type="danger"/>),
        )
    }, [pagination])

    function handleDelete(data) {
        setCollections({
            ...collections,
            count: collections.count - 1,
            results: collections.results.filter(c => data.pk !== c.pk)
        });
        setAlert(<Alert close={e=>setAlert(null)} text={"Deleted collection " + data.name} type="warning" stick={false}/>);
    }

    return (
        <Fragment>
            <CreateableComponent
                endpoint={COLLECTIONS_API}
                data={{}}
                extraData={{addButtonText: 'Create Collection'}}
                FormViewComponent={CollectionForm}
                successCallback={data => setPagination({...pagination, current: 1})}
            />
            <div id="collections" className="column-container">
                {waiting}
                {alert}
                <PaginatedLayout data={collections.results} resultsCount={collections.count} pagination={pagination}
                                 setPagination={setPagination}
                                 mapFunction={item =>
                                     <Collection key={'collection' + item.pk}
                                                 data={item}
                                                 handleSelect={e => {
                                                     setDetailModal(<CollectionItemsModal collection={item}  setMainAlert={setAlert} close={e=>setDetailModal(false)}/>);
                                                 }}
                                                 handleDelete={() => handleDelete(item)}
                                                 setEdit={() => {}}
                                     />}
                                 resultsContainerClass="tile-container"
                />
            </div>
            {detailModal}
        </Fragment>
    );
}

ReactDOM.render(<UserCollectionsApp/>, document.getElementById('collections-app'));