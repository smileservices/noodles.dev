import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import Modal from "../../../src/components/Modal";
import ProblemForm from "./ProblemForm";
import CreateableFormComponent from "../../../src/components/CreateableFormComponent";
import {remove_modal_class_from_body} from "../../../src/vanilla/modal";

function CreateProblemApp() {
    const [showModal, setShowModal] = useState(false);

    const initialData = {
        'name': '',
        'description': '',
        'tags': [],
        'parent': RESULT.pk,
    }

    function getModalContent() {
        return (<CreateableFormComponent
            endpoint={PROBLEM_API}
            data={initialData}
            extraData={{}}
            FormViewComponent={ProblemForm}
            successCallback={data=>{
                setShowModal(false);
                remove_modal_class_from_body();
                window.refreshChildren();
            }}
            contentType="json"
        />);
    }

    function displayFormModal() {
        return (
            <Modal close={e => {
                setShowModal(false);
            }}>
                <h3>Add New Problem</h3>
                {getModalContent()}
            </Modal>
        )
    }

    return (
        <div>
            <a onClick={e => setShowModal(true)}><span className="icon-folder-plus"/> Create New Problem</a>
            {showModal ? displayFormModal() : ''}
        </div>
    )
}

ReactDOM.render(<CreateProblemApp/>, document.getElementById('create-problem'));