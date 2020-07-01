import React, {useState} from 'react';

export const ConfirmComponent = ({buttonText, questionText, handleConfirm}) => {
    const [ask, setAsk] = useState(false);

    if (ask) return (
        <div>{questionText}
            <a className="btn btn-link" onClick={e => {
                e.preventDefault();
                handleConfirm();
            }}>yes</a>
            <a className="btn btn-link" onClick={e => {
                e.preventDefault();
                setAsk(false);
            }}>cancel</a>
        </div>
    )
    return (
        <a className="btn btn-link" onClick={e => {
            e.preventDefault();
            setAsk(true);
        }}>{buttonText}</a>
    )
}

export const Input = (props) => {
    return (
        <div className="form-group">
            <label htmlFor={props.id}>{props.label}</label>
            <input {...props.inputProps} id={props.id} aria-describedby={props.id + 'help'} className="form-control"/>
            {props.smallText
                ? <small id={props.id + 'help'} className="form-text text-muted">{props.smallText}</small>
                : ''
            }
        </div>
    )
}