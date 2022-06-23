import React, {useState, useEffect, Fragment} from 'react';
import Select from 'react-select';
import Creatable, {makeCreatableSelect} from 'react-select/creatable';
import Waiting from "./Waiting";

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

export function FormElement({data, children, callback, alert, waiting, buttonText, cancel = false}) {
    if (waiting) return (<Waiting text={waiting}/>);
    return (
        <form onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            callback(data);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
            {children}
            {alert}
            <div className="buttons-container">
                {cancel
                    ? <button className="btn light" onClick={cancel}>{buttonText ? buttonText : 'Cancel'}</button>
                    : ''
                }
                <button type="submit" className="btn light submit">{buttonText ? buttonText : 'Submit'}</button>
            </div>
        </form>
    )
}

export const Input = ({name, label, inputProps, smallText, error}) => {
    const infoIcon = smallText ? <span className="icon-info" data-tooltip={smallText}>&#xe90c;</span> : '';
    const labelOutput = label ? <label htmlFor={name}>{label}{infoIcon}</label> : '';
    return (
        <div className="form-group">
            {labelOutput}
            <input {...inputProps} id={name} name={name} aria-describedby={name + 'help'}
                   className={handleInputClass(error)}/>
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const Textarea = ({name, label, inputProps, smallText, error}) => {
    const infoIcon = smallText ? <span className="icon-info" data-tooltip={smallText}>&#xe90c;</span> : '';
    const labelOutput = label ? <label htmlFor={name}>{label}{infoIcon}</label> : '';
    return (
        <div className="form-group">
            {labelOutput}
            <textarea id={name} name={name} cols="30" rows="5"
                      aria-describedby={name + 'help'}
                      className={handleInputClass(error)}
                      {...inputProps}
            />
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const Checkbox = ({name, label, inputProps, smallText, error}) => {
    const infoIcon = smallText ? <span className="icon-info" data-tooltip={smallText}>&#xe90c;</span> : '';
    const labelOutput = label ? <label htmlFor={name}>{label}{infoIcon}</label> : '';
    return (
        <div className="">
            <input type="checkbox" id={name} name={name}
                   className={error ? 'invalid' : ''} {...inputProps} /> {labelOutput}
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

export const SelectReact = ({name, label, smallText, smallTextUnder, error, options, value, onChange, props, isLoading, isDisabled}) => {
    const infoIcon = smallText ? <span className="icon-info" data-tooltip={smallText}>&#xe90c;</span> : '';
    const labelOutput = label ? <label htmlFor={name}>{label}{infoIcon}</label> : '';
    return (
        <div className="form-group">
            {labelOutput}
            <Select isLoading={isLoading} isDisabled={isDisabled} options={options} value={value}
                    className="react-select" classNamePrefix={handleSelectClass(error)}
                    onChange={onChange} {...props}
            />
            {smallTextUnder ? smallTextUnder : ''}
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const SelectReactCreatable = ({name, label, smallText, error, options, value, onChange, props, isLoading, isDisabled}) => {
    const infoIcon = smallText ? <span className="icon-info" data-tooltip={smallText}>&#xe90c;</span> : '';
    const labelOutput = label ? <label htmlFor={name}>{label}{infoIcon}</label> : '';
    return (<div className="form-group">
        {labelOutput}
        <Creatable isLoading={isLoading} isDisabled={isDisabled} options={options} value={value}
                   className="react-select" classNamePrefix={handleSelectClass(error)}
                   onChange={onChange} {...props} />
        {error
            ? (<div className="invalid-feedback">{error}</div>)
            : ''
        }
    </div>)
}

export function ImageInputComponent({inputProps, data, setValue, disabled, smallText}) {
    const infoIcon = smallText ? <span className="icon-info" data-tooltip={smallText}>&#xe90c;</span> : '';
    const [activeTab, setActiveTab] = useState('url');

    return (
        <div className="image-input-component">
            <label htmlFor="">{inputProps.label} {infoIcon}</label>
            <div className="flexible">
                <div className="input-option">
                    <div className="input-container">
                        {activeTab === 'url'
                            ? (<Fragment>
                                <input id={inputProps.name} name={inputProps.name} aria-describedby={name + 'help'}
                                       className={handleInputClass(inputProps.error)}
                                       value={data.url}
                                       onChange={e => setValue({url: e.target.value})}
                                       type='text'
                                       disabled={Boolean(disabled)}
                                       placeholder="Import from URL"
                                />
                                {inputProps.error
                                    ? (<div className="invalid-feedback">{inputProps.error}</div>)
                                    : ''
                                }
                                {data.url
                                    ? (<img src={data.url} alt=""/>)
                                    : ''
                                }
                            </Fragment>)
                            : (<Fragment>
                                <input type="file" disabled={Boolean(disabled)} id={inputProps.name}
                                       name={inputProps.name}
                                       onChange={e => setValue({file: e.target.files[0]})}
                                       aria-describedby={name + 'help'}
                                       className={handleInputClass(inputProps.error)}
                                />
                                {inputProps.error
                                    ? (<div className="invalid-feedback">{inputProps.error}</div>)
                                    : ''
                                }
                            </Fragment>)
                        }
                    </div>
                    <div className="option-container">
                        {activeTab === 'file'
                            ? (<span>Or <a onClick={e => setActiveTab('url')}>Import from URL</a></span>)
                            : (<span>Or <a onClick={e => setActiveTab('file')}>Choose File</a></span>)
                        }
                    </div>
                </div>
                {inputProps.originalImage
                    ? (<img className="selected" src={inputProps.originalImage} alt=""/>)
                    : ''}
            </div>
        </div>
    )
}