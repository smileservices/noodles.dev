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

export const Input = ({id, label, inputProps, smallText, error}) => {
    return (
        <div className="form-group">
            {label
                ? (<label htmlFor={id}>{label}</label>)
                : ''
            }
            <input {...inputProps} id={id} aria-describedby={id + 'help'} className="form-control"/>
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
                      className="form-control"
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
                    className="form-control"
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
        <Select options={options} value={value} onChange={onChange} {...props} />
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
        <Creatable options={options} value={value} onChange={onChange} {...props} />
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