import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import Modal from "../../../src/components/Modal";
import SolutionForm from "./SolutionForm";
import CreateableFormComponent from "../../../src/components/CreateableFormComponent";
import TechForm from "../../../technology/src/TechForm";

function CreateSolutionApp() {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('solution');

    function getModalContent() {
        switch (modalContent) {
            case "solution":
                return (<CreateableFormComponent
                    endpoint={SOLUTIONS_ENDPOINT}
                    data={{parent: RESULT.pk}}
                    extraData={{formTitle: "Add Solution for "+RESULT.name, showTechForm: e=>setModalContent('technology')}}
                    FormViewComponent={SolutionForm}
                    successCallback={data=>{
                        setShowModal(false);
                        document.body.classList.remove('modal-open');
                        window.refreshChildren();
                    }}
                />);
            case "technology":
                return (<CreateableFormComponent
                    endpoint={TECH_ENDPOINT}
                    data={{}}
                    extraData={{formTitle: "Create new technology"}}
                    FormViewComponent={TechForm}
                    successCallback={data=> {
                        setModalContent('solution')
                    }}
                />)
        }
    }

    function displayFormModal() {
        return (
            <Modal close={e => {
                setShowModal(false);
                setModalContent('solution');
            }}>
                { modalContent==='technology' ? <a onClick={e=>setModalContent('solution')}><span className="icon-close"/> back to solution form</a> : ''}
                {getModalContent()}
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