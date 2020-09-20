import React, {useState, useEffect, Fragment} from "react"
import ReactDOM from "react-dom";
import Waiting from "../../../src/components/Waiting";
import Alert from "../../../src/components/Alert";
import apiList from "../../../src/api_interface/apiList";
import PaginatedLayout from "../../../src/components/PaginatedLayout";
import Collection from "./Collection";
import CreateCollectionForm from "./CreateCollectionForm";
import EditCollectionForm from "./EditCollectionForm";
import CollectionItemsModal from "./CollectionItemsModal";


function Content() {
    const [tags, setTags] = useState([]);
    const [techs, setTechs] = useState([]);
    const [options, setOptions] = useState(false);

    const [collections, setCollections] = useState([]);

    const [pagination, setPagination] = useState({
        resultsPerPage: 10,
        current: 1,
        offset: 0
    });

    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [editFormData, setEditFormData] = useState(false);
    const [createForm, setCreateForm] = useState(false);

    const [modal, setModal] = useState(false);


    useEffect(() => {
        //get tags and technologies
        let tagsPromise = fetch(
            TAGS_ENDPOINT, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e=>setAlert(null)} text="Could not retrieve tags" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setTags(data);
            }
        })
        let techsPromise = fetch(
            TECH_ENDPOINT, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e=>setAlert(null)} text="Could not retrieve tags" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setTechs(data);
            }
        })
        let optionsPromise = fetch(
            STUDY_RESOURCE_OPTIONS_ENDPOINT, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e=>setAlert(null)} text="Could not retrieve options" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) setOptions(data);
        })
    }, []);

    useEffect(e => {
        apiList(
            USER_COLLECTIONS_ENDPOINT,
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

    if (createForm) return (
        <CreateCollectionForm
            tags={tags} techs={techs} setTechs={setTechs}
            cancel={e => setCreateForm(false)}
            addCollection={data => {
                setCollections({
                    ...collections,
                    count: collections.count + 1,
                    results: [...collections.results, data]
                });
                setCreateForm(false);
            }}
        />
    )

    if (editFormData) {
        return (
            <EditCollectionForm
                data={editFormData}
                tags={tags} techs={techs} setTechs={setTechs}
                cancel={e => setEditFormData(false)}
                // set updated collection data
                editCollection={data => {
                    setCollections({
                        ...collections,
                        results: collections.results.map(
                            coll => coll.pk === data.pk ? data : coll
                        )
                    })
                    setEditFormData(false);
                }}
            />
        )
    }

    return (
        <Fragment>
            <button className="create-element btn submit" onClick={e => {
                e.preventDefault();
                setCreateForm(true);
            }}>create new collection
            </button>
            <div id="collections" className="column-container">
                {waiting}
                {alert}
                <PaginatedLayout data={collections.results} resultsCount={collections.count} pagination={pagination}
                                 setPagination={setPagination}
                                 mapFunction={item =>
                                     <Collection key={'collection' + item.pk}
                                                 data={item}
                                                 handleSelect={e => {
                                                     setModal(<CollectionItemsModal collection={item}  options={options} close={e=>setModal(false)}/>);
                                                 }}
                                                 handleDelete={() => handleDelete(item)}
                                                 setEdit={() => setEditFormData(item)}
                                     />}
                                 resultsContainerClass="tile-container"
                />
            </div>
            {modal}
        </Fragment>
    );
}

ReactDOM.render(<Content/>, document.getElementById('collections-app'));