import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import Modal from "../../../src/components/Modal";
import SolutionForm from "./SolutionForm";
import CreateableFormComponent from "../../../src/components/CreateableFormComponent";
import TechForm from "../../../technology/src/TechForm";
import {makeId} from "../../../src/components/utils";

function CreateSolutionApp() {
    const [showModal, setShowModal] = useState(false);

    const initialSolutionData = {
        'name': '',
        'description': '',
        'tags': [],
        'technologies': [],
        'parent': RESULT.pk,
    }

    function displayFormModal() {
        return (
            <Modal close={e => {
                setShowModal(false);
            }}>
                <CreateableFormComponent
                    key={makeId(5)}
                    endpoint={SOLUTION_API}
                    data={initialSolutionData}
                    extraData={{
                        formTitle: "Add Solution for "+'"'+RESULT.name + '"',
                    }}
                    FormViewComponent={SolutionForm}
                    successCallback={data=>{
                        setShowModal(false);
                        document.body.classList.remove('modal-open');
                        window.refreshChildren();
                    }}
                    contentType="default"
                />
            </Modal>
        )
    }

    return (
        <div>
            <a onClick={e => setShowModal(true)}><span className="icon-folder-plus"/> Create New Solution</a>
            {showModal ? displayFormModal() : ''}
        </div>
    )
}

ReactDOM.render(<CreateSolutionApp/>, document.getElementById('create-solution'));