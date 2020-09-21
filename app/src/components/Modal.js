import React, {useState, useEffect} from "react";
import PortalComponent from "./PortalComponent";

export default function Modal({children, close}) {

    function bodyAddModal() {
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        document.body.classList.remove('modal-open');
        close();
    }

    useEffect(bodyAddModal, []);

    return (
        <PortalComponent id="modal-portal">
            <div className="modal-backdrop"/>
            {/*<div className="modal-container" style={{top: window.pageYOffset}} onClick={closeModal}>*/}
            <div className="modal" onClick={closeModal}>
                <div className="card full-page-md" onClick={e => e.stopPropagation()}>
                    <div className="toolbar">
                        <span className="icon-close" onClick={closeModal}/>
                    </div>
                    {children}
                </div>
            </div>
            {/*</div>*/}
        </PortalComponent>
    );
}