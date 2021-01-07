import React, {useState, useEffect, Fragment} from "react";
import Alert from "../../../../src/components/Alert";
import {Textarea} from "../../../../src/components/form";
import apiUpdate from "../../../../src/api_interface/apiUpdate";
import SolutionForm from "../SolutionForm";
import Waiting from "../../../../src/components/Waiting";

export default function EditForm({addEditSuggestion}) {
    /*
    * Handle the edit suggestion form
    * use SolutionForm and extend it with edit reason and the toolbar
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
        setWaiting(<Waiting text="Retrieving resource"/>);
        fetch(
            RESOURCE_DETAIL, {method: 'GET'}
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
    }, []);


    function submitEdit(normalizedData) {
        setAlert('');
        apiUpdate(
            RESOURCE_ENDPOINT,
            formData.pk,
            normalizedData,
            data => {
                // handle differently if it's edit suggestion or direct update
                if (data['edit_suggestion_author']) {
                    setAlert(<Alert close={e => setAlert(null)} text="Successfully created an edit suggestion"
                                    type="success"
                                    hideable={false}/>)
                    resetForm();
                    addEditSuggestion(data);
                } else {
                    setAlert(<Alert close={e => setAlert(null)} text="Successfully edited the resource" type="success"
                                    hideable={false}/>)
                    setFormData(data);
                }
            },
            setWaiting,
            result => {
                result.json().then(
                    body => setAlert(<Alert close={e => setAlert(null)} text={body.detail} type="danger"
                                            hideable={false}
                                            stick={true}/>)
                )
            }
        )
    }


    const extraData = {
        formElements: {
            get_list: (formData, setFormData, waiting, errors) =>
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

    if (Object.keys(formData).length === 0) return (waiting);

    return (
        <Fragment>
            <div className="toolbar">
                <a href={originalData.absolute_url}>back to detail view</a>
            </div>
            <h3>Edit Solution</h3>
            <SolutionForm
                data={formData}
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