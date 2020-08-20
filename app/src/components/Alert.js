import React, {useState, useEffect} from 'react';
import {makeId} from "./utils";

export default function Alert({text, type, hideable = true, stick = true}) {
    const [hide, setHide] = useState(false);
    const [id, setId] = useState(makeId(5));
    const alertEl = (
        <div key={id} id={id} className={"fade alert alert-" + type} role="alert">
            {hideable
                ? <span className="icon-close close" onClick={e => fadeOut()}> </span>
                : ''
            }
            {text}
        </div>
    );

    function fadeOut() {
        document.getElementById(id).classList.add('fade-out');
        window.setTimeout(() => {
            setHide(true);
        }, 500)
    }

    useEffect(() => {
        if (!stick) {
            window.setTimeout(() => fadeOut(), 3000);
        }
    }, [])

    if (hide) return '';
    return alertEl;
}