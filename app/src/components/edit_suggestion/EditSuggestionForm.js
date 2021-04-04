import React, {useState, useEffect, Fragment} from "react";

import apiUpdate from "../../api_interface/apiUpdate";
import Alert from "../Alert";
import {Textarea} from "../form";
import Waiting from "../Waiting";


export default function EditForm({addEditSuggestionCallback, ResourceForm, api_urls, mustReload}) {
    /*
    * Handle the edit suggestion form
    * use ResourceForm and extend it with reason textfield and the toolbar
    *
    * */

    const [originalData, setOriginalData] = useState({});
    const [formData, setFormData] = useState({});

    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');

    function resetForm() {
        setFormData({
            ...originalData,
            'edit_suggestion_reason': ''
        });
    }


    useEffect(() => {
        //get tags and technologies
        setWaiting('Retrieving resource');
        setAlert('');
        fetch(
            api_urls['resource_detail'], {method: 'GET'}
        ).then(result => {
            setWaiting('');
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve problem" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setFormData(data);
                setOriginalData(data);
            }
        })
    }, [mustReload]);


    function submitEdit(normalizedData) {
        setAlert('');
        apiUpdate(
            api_urls['resource_api'],
            formData.pk,
            normalizedData,
            data => {
                // handle differently if it's edit suggestion or direct update
                if (data['edit_suggestion_author']) {
                    setAlert(<Alert close={e => setAlert(null)} text="Successfully created an edit suggestion"
                                    type="success"
                                    hideable={false}/>)
                    resetForm();
                    addEditSuggestionCallback({response: data, detail_url: originalData.absolute_url});
                } else {
                    setAlert(<Alert close={e => setAlert(null)} text="Successfully edited the resource" type="success"
                                    hideable={false}/>)
                    setFormData(data);
                }
            },
            setWaiting,
            result => {
                result.json().then(
                    body => {
                        if (body.detail) {
                            setAlert(<Alert close={e => setAlert(null)} text={body.detail} type="danger"
                                            hideable={false}
                                            stick={true}/>)
                        }
                        delete body.detail;
                        if (Object.keys(body).length) {
                            setErrors(body);
                        }
                    }
                )
            }, ResourceForm.contentType
        )
    }

    const extraData = {
        resetForm: resetForm,
        originalData: originalData,
        formElements: {
            get_list: (waiting, errors) =>
                (<Textarea
                    key={'edit_suggestion_reason_form_elem'}
                    name={'edit_suggestion_reason'}
                    label="Edit Reason"
                    inputProps={{
                        disabled: Boolean(waiting),
                        required: true,
                        value: formData.edit_suggestion_reason,
                        onChange: e => setFormData({...formData, edit_suggestion_reason: e.target.value})
                    }}
                    smallText="Short reason of why create this edit"
                    error={errors.edit_suggestion_reason}
                />),
            validate: (normalizedData, vErr) => {
                if (normalizedData.edit_suggestion_reason.length < 5) vErr.edit_suggestion_reason = 'Edit reason should be at least 5 chars in length';
            }
        }
    }

    if (Object.keys(formData).length === 0) return (<Waiting text={'Setting form up...'} />);

    return (
        <Fragment>
            <div className="toolbar">
                <a href={originalData.absolute_url}>Back</a>
            </div>
            <h3>{TITLE}</h3>
            <ResourceForm
                formData={formData}
                setFormData={setFormData}
                submitCallback={submitEdit}
                extraData={extraData}
                waiting={waiting}
                alert={alert}
                errors={errors}
                setAlert={setAlert}
                setErrors={setErrors}
                setWaiting={setWaiting}
            />
        </Fragment>
    )
}