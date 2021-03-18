import React, {useState, useEffect, Fragment} from 'react';
import Select from 'react-select';
import Creatable, {makeCreatableSelect} from 'react-select/creatable';

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
            {children}
            {alert}
            {waiting ? waiting : <button type="submit" className="btn submit">Submit</button>}
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
            <input type="checkbox" id={name} name={name} className={error ? 'invalid' : ''} {...inputProps} /> {labelOutput}
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
        </div>
    )
}

export const ImageInput = ({name, label, inputProps, smallText, error, selectedImage}) => {
    return (
        <div className="form-group">
            {label
                ? (<label htmlFor={name}>{label}</label>)
                : ''
            }
            <input type="file" {...inputProps} id={name} name={name} aria-describedby={name + 'help'}
                   className={handleInputClass(error)}/>
            {error
                ? (<div className="invalid-feedback">{error}</div>)
                : ''
            }
            {selectedImage ?
                <Fragment>
                    <p>Current Image:</p>
                    <img src={selectedImage} alt=""/>
                </Fragment>
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

export const SelectReact = ({name, label, smallText, error, options, value, onChange, props, isLoading, isDisabled}) => {
    const infoIcon = smallText ? <span className="icon-info" data-tooltip={smallText}>&#xe90c;</span> : '';
    const labelOutput = label ? <label htmlFor={name}>{label}{infoIcon}</label> : '';
    return (
        <div className="form-group">
            {labelOutput}
            <Select isLoading={isLoading} isDisabled={isDisabled} options={options} value={value}
                    className="react-select" classNamePrefix={handleSelectClass(error)}
                    onChange={onChange} {...props}
            />
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

export function ImageInputComponent({inputProps, data, setValue}) {
    const [activeTab, setActiveTab] = useState('url');

    function tabClass(tabName) {
        const base = 'tab';
        return base + tabName === activeTab ? ' active' : '';
    }

    return (
        <div className="image-input-component">
            <div className={tabClass('url')} onClick={e => setActiveTab('url')}>Import From Url</div>
            <div className={tabClass('file')} onClick={e => setActiveTab('file')}>Upload Local File</div>
            {activeTab === 'url' ?
                <div className="panel">
                    <Input name={inputProps.name} label={inputProps.label} inputProps={{
                        value: data.url,
                        onChange: e => setValue({url: e.target.value}),
                        type: 'text',
                        disabled: Boolean(inputProps.waiting)
                    }}
                           smallText={inputProps.smallText}
                           error={inputProps.error}
                    />
                    <img className="preview" src={data.url} alt=""/>
                </div>
                : ''
            }
            {activeTab === 'file' ?
                <div className="panel">
                    <ImageInput
                        name={inputProps.name} label={inputProps.label} inputProps={{
                        value: data.name ? data.name : '',
                        onChange: e => setValue({file: e.target.files[0], name: e.target.value}),
                        disabled: Boolean(inputProps.waiting)
                    }}
                        smallText={inputProps.smallText}
                        error={inputProps.error}
                        selectedImage={false}
                    />
                </div>
                : ''
            }
            {inputProps.originalImage ?
                <div>
                    <h3>Current Selected:</h3>
                    <img className="selected" src={inputProps.originalImage} alt=""/>
                </div>
                : ''}
        </div>
    )
}