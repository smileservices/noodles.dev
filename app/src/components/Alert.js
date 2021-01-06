import React, {useState, useEffect} from 'react';
import {makeId} from "./utils";

export default function Alert({text, type, hideable = true, stick = true, close}) {
    const defaultClassName = "fade alert alert-" + type;

    const id = makeId(5);
    const [className, setClassName] = useState(defaultClassName);
    const [alertEl, setAlertEl] = useState((
        <div key={id} id={id} className={className} role="alert">
            {hideable
                ? <div className="alert-toolbar"><span className="icon-close close" onClick={e => fadeOut()}/></div>
                : ''
            }
            {text}
        </div>
    ));

    function fadeOut() {
        setClassName(defaultClassName + " fade-out");
        window.setTimeout(() => {
            setAlertEl('');
            close();
        }, 300)
    }

    useEffect(() => {
        if (!stick) {
            window.setTimeout(() => fadeOut(), 3000);
        }
    }, [])

    return alertEl;
}