import React, {useState, useEffect} from "react";


export default function Modal({children, close}) {
    const body = document.querySelector('body');

    function bodyAddModal() {
        body.classList.add('modal-open');
    }
    function closeModal() {
        body.classList.remove('modal-open');
        setOpen(false);
    }

    useEffect(bodyAddModal, []);

    return (
        <div className="modal-container" style={{top: window.pageYOffset}} onClick={close}>
            <div className="card full-page-md" onClick={e => e.stopPropagation()}>
                <div className="toolbar">
                    <span className="icon-close" onClick={close}/>
                </div>
                {children}
            </div>
        </div>
    );
}