import React, {useState} from 'react';
import Select from 'react-select';
import Creatable, { makeCreatableSelect } from 'react-select/creatable';

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

function handleInputClass(error) {
    if (error) {
        return "form-control is-invalid";
    } else if (error === 'valid') {
        return "form-control is-valid";
    } else {
        return "form-control";
    }
}

function handleSelectClass(error) {
    if (error) {
        return "form-control_invalid";
    } else if (error === 'valid') {
        return "form-control_valid";
    } else {
        return "form-control";
    }
}

export const Input = ({id, label, inputProps, smallText, error}) => {
    return (
        <div className="form-group">
            {label
                ? (<label htmlFor={id}>{label}</label>)
                : ''
            }
            <input {...inputProps} id={id} aria-describedby={id + 'help'} className={handleInputClass(error)}/>
            {smallText
                ? <small id={id + 'help'} className="form-text text-muted">{smallText}</small>
                : ''
            }
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const Textarea = ({id, label, inputProps, smallText, error}) => {
    return (
        <div className="form-group">
            {label
                ? (<label htmlFor={id}>{label}</label>)
                : ''
            }
            <textarea id={id} cols="30" rows="5"
                      aria-describedby={id + 'help'}
                      className={handleInputClass(error)}
                      {...inputProps}
            />
            {smallText
                ? <small id={id + 'help'} className="form-text text-muted">{smallText}</small>
                : ''
            }
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const SelectVanilla = ({id, label, inputProps, smallText, error, Options}) => {
    return (
        <div className="form-group">
            {label
                ? (<label htmlFor={id}>{label}</label>)
                : ''
            }
            <select id={id}
                    aria-describedby={id + 'help'}
                    className={handleInputClass(error)}
                    {...inputProps}
            >
                {Options}
            </select>

            {smallText
                ? <small id={id + 'help'} className="form-text text-muted">{smallText}</small>
                : ''
            }
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const SelectReact = ({id, label, smallText, error, options, value, onChange, props}) => (
    <div className="form-group">
        {label
            ? (<label htmlFor={id}>{label}</label>)
            : ''
        }
        <Select options={options} value={value} onChange={onChange} {...props} classNamePrefix={handleSelectClass(error)}/>
        {smallText
            ? <small id={id + 'help'} className="form-text text-muted">{smallText}</small>
            : ''
        }
        {error
            ? (<div className="invalid-feedback">{error}</div>)
            : ''
        }
    </div>
)

export const SelectReactCreatable = ({id, label, smallText, error, options, value, onChange, props}) => (
    <div className="form-group">
        {label
            ? (<label htmlFor={id}>{label}</label>)
            : ''
        }
        <Creatable options={options} value={value} onChange={onChange} {...props} classNamePrefix={handleSelectClass(error)}/>
        {smallText
            ? <small id={id + 'help'} className="form-text text-muted">{smallText}</small>
            : ''
        }
        {error
            ? (<div className="invalid-feedback">{error}</div>)
            : ''
        }
    </div>
)