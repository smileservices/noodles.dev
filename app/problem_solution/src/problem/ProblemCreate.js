import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import Alert from "../../../src/components/Alert";
import apiCreate from "../../../src/api_interface/apiCreate";
import ProblemForm from "./ProblemForm";
import {makeId} from "../../../src/components/utils";

function Content() {
    const [waiting, setWaiting] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errors, setErrors] = useState({});
    const [tags, setTags] = useState([]);

    function createProblem(formData) {
        let extracted_data = {
            ...formData,
            tags: formData['tags'].map(arr => arr.value)
        }
        apiCreate(
            PROBLEM_ENDPOINT,
            extracted_data,
            function () {
            },
            setWaiting,
            result => {
                result.json().then(errors => {
                    if (errors) {
                        let flattenedErrors = {};
                        Object.keys(errors).map(k => {
                            flattenedErrors[k] = [k].join('</br>');
                        })
                        setErrors(flattenedErrors);
                        setAlert(<Alert key={makeId()}
                                        text="Please check the field errors and try again."
                                        type="danger" stick={false}
                                        hideable={false} close={e => setAlert(null)}/>)
                    } else {
                        setAlert(<Alert key={makeId()} text={result.statusText} type="danger"
                                        stick={false}
                                        hideable={false} close={e => setAlert(null)}/>)
                    }
                })
            }, successHeaders => handleCreated(successHeaders)
        )
    }

    function handleCreated(successHeaders) {
        let alert_text = (
            <Fragment>
                <span>Problem created successfully! You can see it </span>
                <a href={successHeaders.get('Location')}>here</a>
            </Fragment>
        )
        setAlert(<Alert text={alert_text} type="success"/>)
    }

    useEffect(() => {
        //get tags and technologies
        let tagsPromise = fetch(
            TAGS_ENDPOINT, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve tags" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setTags(data);
            }
        })
    }, []);

    function validate(formData) {
        let vErr = {};
        if (formData.tags.length === 0) vErr.tags = 'Choose at least one tag';
        if (formData.name.length < 5) vErr.name = 'Title is too short. It has to be at least 5 characters';
        if (formData.description.length < 30) vErr.description = 'Description is too short. It has to be at least 30 characters';
        setErrors(vErr);
        if (Object.keys(vErr).length > 0) {
            setAlert(<Alert close={e => setAlert(null)} text="Please fix the form errors" type="danger"/>)
            return false;
        } else {
            return true;
        }
    }

    return (
        <div className="form-container full-page-sm">
            <ProblemForm data={false} tags={tags} errors={errors} waiting={waiting} alert={alert}
                         callback={formData => {
                             if (validate(formData)) createProblem(formData)
                         }}/>
        </div>
    )
}

ReactDOM.render(<Content/>, document.getElementById('create-app'));