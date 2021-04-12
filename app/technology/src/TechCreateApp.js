import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import CreateableFormComponent from "../../src/components/CreateableFormComponent";
import TechForm from "./TechForm";
import confettiFactory from "../../src/vanilla/confetti";
const startConfetti = confettiFactory(100, 1);

function TechCreateApp() {

    const [created, setCreated] = useState(false);

    const defaultData = {
        'name': '',
        'image_file': {content: '', name: ''},
        'url': '',
        'description': '',
        'pros': '',
        'cons': '',
        'limitations': '',
        'owner': '',
        'category': '',
        'ecosystem': [],
    }

    useEffect(() => {
        if (created) startConfetti('confetti-canvas');
    }, [created,]);

    if (created) return (
        <div className="success-card column-container card full-page-sm">
            <canvas id="confetti-canvas" key="confetti-canvas"/>
            <header>Thank you!</header>
            <div className="body" dangerouslySetInnerHTML={{__html: created.success.message}}/>
            <div className="buttons-container">
                <a className="btn" href={created.absolute_url}>View Created</a>
                <a className="btn dark" href="/">Back to Homepage</a>
            </div>
        </div>
    );

    return (
        <div className="form-container full-page-sm">
            <CreateableFormComponent
                endpoint={TECH_API}
                FormViewComponent={TechForm}
                successCallback={data => setCreated(data)}
                data={defaultData}
                extraData={{}}
                contentType={'multipart'}
            />
        </div>
    )
}

ReactDOM.render(<TechCreateApp/>, document.getElementById('create-app'));