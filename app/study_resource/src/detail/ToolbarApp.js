import React, {useState, useEffect, Fragment} from "react"
import ReactDOM from "react-dom";
import AddToCollectionModal from "../../../study_collection/src/AddToCollectionModal";
import apiDelete from "../../../src/api_interface/apiDelete";
import Alert from "../../../src/components/Alert";

function ToolbarApp() {

    const [showModal, setShowModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [alert, setAlert] = useState(false);
    const isOwner = () => {
        if (!IS_AUTHENTICATED) return false;
        return RESOURCE_AUTHOR_ID === get_user_data().pk;
    }
    const isAdmin = () => {
        if (!IS_AUTHENTICATED) return false;
        return get_user_data().is_admin;
    };

    function deleteResource() {
        apiDelete(
            RESOURCE_API_DELETE,
            setWaiting,
            data => {
                setAlert(<Alert close={e=>setAlert(null)} text={"Successfully deleted. Returning to homepage..."} type="info" hideable={false} stick={false}/>);
                setTimeout(()=>window.location='/', 2);
            },
            result => setAlert(<Alert close={e=>setAlert(null)} text={"Could not delete study resource"} type="danger" hideable={false}/>)
        )
    }

    if (waiting) return waiting;
    if (alert) return alert;

    if (!IS_AUTHENTICATED) return (
        <Fragment>
            <a href={RESOURCE_EDIT_URL}>Suggest Edit</a>
            <a className="icon-bookmark" href={LOGIN_URL}/>
        </Fragment>
    )

    if (confirmDelete) return (
        <div className="confirm">
            <span className="text">Are you sure?</span>
            <span className="option delete" onClick={deleteResource}>yes</span>
            <span className="option" onClick={e => setConfirmDelete(false)}>cancel</span>
        </div>
    )

    return (
        <Fragment>
            {isOwner || isAdmin
                ?
                (<Fragment>
                    <a onClick={e => setConfirmDelete(true)}>Delete</a>
                    <a href={RESOURCE_EDIT_URL}>Edit</a>
                </Fragment>)
                :
                (<Fragment>
                    <a href={RESOURCE_EDIT_URL}>Suggest Edit</a>
                </Fragment>)
            }
            <a className="icon-bookmark" onClick={e => setShowModal(true)}/>
            {showModal ? <AddToCollectionModal close={e => setShowModal(false)}/> : ''}
        </Fragment>
    );
}

ReactDOM.render(<ToolbarApp/>, document.getElementById('detail-toolbar'));