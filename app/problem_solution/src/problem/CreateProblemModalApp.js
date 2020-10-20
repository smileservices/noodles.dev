import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import Modal from "../../../src/components/Modal";
import ProblemForm from "./ProblemForm";
import CreateableFormComponent from "../../../src/components/CreateableFormComponent";

function CreateProblemApp() {
    const [showModal, setShowModal] = useState(false);

    function getModalContent() {
        return (<CreateableFormComponent
            endpoint={PROBLEM_ENDPOINT}
            data={{parent: RESULT.pk}}
            extraData={{}}
            FormViewComponent={ProblemForm}
            successCallback={data=>{
                setShowModal(false);
                document.body.classList.remove('modal-open');
                window.refreshChildren();
            }}
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