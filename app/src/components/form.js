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

export function FormElement({data, children, callback, alert, waiting}) {
    return (
        <form onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            callback(data);
        }}>
            { children }
            { alert }
            { waiting ? waiting : <button type="submit" className="btn submit">Submit</button> }
        </form>
    )
}

export const Input = ({name, value, label, inputProps, smallText, error}) => {
    return (
        <div className="form-group">
            {label
                ? (<label htmlFor={name}>{label}</label>)
                : ''
            }
            <input {...inputProps} id={name} name={name} aria-describedby={name + 'help'} value={value} className={handleInputClass(error)}/>
            {smallText
                ? <small id={name + 'help'} className="form-text text-muted">{smallText}</small>
                : ''
            }
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const Textarea = ({name, label, inputProps, smallText, error}) => {
    return (
        <div className="form-group">
            {label
                ? (<label htmlFor={name}>{label}</label>)
                : ''
            }
            <textarea id={name} name={name} cols="30" rows="5"
                      aria-describedby={name + 'help'}
                      className={handleInputClass(error)}
                      {...inputProps}
            />
            {smallText
                ? <small id={name + 'help'} className="form-text text-muted">{smallText}</small>
                : ''
            }
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const SelectVanilla = ({name, label, inputProps, smallText, error, Options}) => {
    return (
        <div className="form-group">
            {label
                ? (<label htmlFor={name}>{label}</label>)
                : ''
            }
            <select id={name} name={name}
                    aria-describedby={name + 'help'}
                    className={handleInputClass(error)}
                    {...inputProps}
            >
                {Options}
            </select>

            {smallText
                ? <small id={name + 'help'} className="form-text text-muted">{smallText}</small>
                : ''
            }
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const SelectReact = ({name, label, smallText, error, options, value, onChange, props, isLoading, isDisabled}) => (
    <div className="form-group">
        {label
            ? (<label htmlFor={name}>{label}</label>)
            : ''
        }
        <Select isLoading={isLoading} isDisabled={isDisabled} options={options} value={value} onChange={onChange} {...props} classNamePrefix={handleSelectClass(error)}/>
        {smallText
            ? <small id={name + 'help'} className="form-text text-muted">{smallText}</small>
            : ''
        }
        {error
            ? (<div className="invalid-feedback">{error}</div>)
            : ''
        }
    </div>
)

export const SelectReactCreatable = ({name, label, smallText, error, options, value, onChange, props, isLoading, isDisabled}) => (
    <div className="form-group">
        {label
            ? (<label htmlFor={name}>{label}</label>)
            : ''
        }
        <Creatable isLoading={isLoading} isDisabled={isDisabled} options={options} value={value} onChange={onChange} {...props} classNamePrefix={handleSelectClass(error)}/>
        {smallText
            ? <small id={name + 'help'} className="form-text text-muted">{smallText}</small>
            : ''
        }
        {error
            ? (<div className="invalid-feedback">{error}</div>)
            : ''
        }
    </div>
)