import React, {useState, useEffect} from 'react';
import {makeId} from "./utils";

export default function Alert({text, type, hideable = true, stick = true, close}) {
    const defaultClassName = "fade alert alert-" + type;

    const id = useState(makeId(5));
    const [className, setClassName] = useState(defaultClassName);
    const alertEl = (
        <div key={id} id={id} className={className} role="alert">
            {hideable
                ? <span className="icon-close close" onClick={e => fadeOut()}> </span>
                : ''
            }
            {text}
        </div>
    );

    function fadeOut() {
        setClassName(defaultClassName + " fade-out");
        window.setTimeout(() => {
            close();
        }, 500)
    }

    useEffect(() => {
        if (!stick) {
            window.setTimeout(() => fadeOut(), 3000);
        }
    }, [])

    return alertEl;
}