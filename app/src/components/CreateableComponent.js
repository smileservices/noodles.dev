import React, {useState, Fragment} from 'react';
import Modal from "./Modal";
import CreateableFormComponent from "./CreateableFormComponent";

export default function CreateableComponent({endpoint, data, extraData, FormViewComponent, successCallback, buttonClassName}) {
    const [showForm, setShowForm] = useState(false);

    function displayFormModal() {
        return (
            <Modal close={e=>setShowForm(false)}>
                <CreateableFormComponent
                    endpoint={endpoint}
                    data={data}
                    extraData={extraData}
                    FormViewComponent={FormViewComponent}
                    successCallback={
                        data => {
                            successCallback(data);
                            document.body.classList.remove('modal-open');
                            setShowForm(false);
                        }
                    }
                />
            </Modal>
        )
    }

    return (
        <Fragment>
            <button type="button" className={buttonClassName ? buttonClassName : 'btn'} onClick={e => setShowForm(true)}>{extraData.addButtonText}</button>
            {showForm ? displayFormModal() : ''}
        </Fragment>
    )
}