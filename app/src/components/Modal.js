import React, {useState, useEffect} from "react";


export default function Modal({children, close}) {
    const body = document.querySelector('body');

    function bodyAddModal() {
        body.classList.add('modal-open');
    }
    function closeModal() {
        body.classList.remove('modal-open');
        close();
        setOpen(false);
    }

    useEffect(bodyAddModal, []);

    return (
        <div className="modal-container" style={{top: window.pageYOffset}} onClick={closeModal}>
            <div className="card full-page-md" onClick={e => e.stopPropagation()}>
                <div className="toolbar">
                    <span className="icon-close" onClick={closeModal}/>
                </div>
                {children}
            </div>
        </div>
    );
}