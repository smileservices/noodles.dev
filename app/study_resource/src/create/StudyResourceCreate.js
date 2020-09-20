import React, {useState, useEffect, Fragment} from "react"
import ReactDOM from "react-dom";
import FormMultiStepProgress from "../../../src/components/FormMultiStepProgress";
import CreateFormStep1 from "./CreateFormStep1";
import CreateFormStep2 from "./CreateFormStep2";
import CreateFormStep3 from "./CreateFormStep3";
import Alert from "../../../src/components/Alert";
import apiCreate from "../../../src/api_interface/apiCreate";
import FormatDate from "../../../src/vanilla/date";

function Content() {
    const emptyDataStep1 = {
        url: '',
    }
    const emptyDataStep2 = {
        tags: [],
        technologies: []
    }
    const emptyDataStep3 = {
        name: '',
        publication_date: '',
        published_by: '',
        type: false,
        media: false,
        experience_level: false,
        summary: '',
        image_url: '',
    }
    const [step, setStep] = useState(0);
    const [tags, setTags] = useState([]);
    const [techs, setTechs] = useState([]);
    const [options, setOptions] = useState({});
    const [dataStep1, setDataStep1] = useState(emptyDataStep1)
    const [dataStep2, setDataStep2] = useState(emptyDataStep2)
    const [dataStep3, setDataStep3] = useState(emptyDataStep3)

    const [stepStatus, setStepStatus] = useState([
        'current',
        'unsubmitted',
        'unsubmitted'
    ]);

    const [waiting, setWaiting] = useState('');
    const [alert, setAlert] = useState('');
    const [created, setCreated] = useState(false);

    const stepsArr = [
        (<p>URL</p>),
        (<p>Tags and Technology</p>),
        (<p>Final Details</p>),
    ]

    useEffect(() => {
        //get tags and technologies
        let tagsPromise = fetch(
            TAGS_ENDPOINT, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e=>setAlert(null)} text="Could not retrieve tags" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setTags(data);
            }
        })
        let techsPromise = fetch(
            TECH_ENDPOINT, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e=>setAlert(null)} text="Could not retrieve tags" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setTechs(data);
            }
        })
        let optionsPromise = fetch(
            STUDY_RESOURCE_ENDPOINT + 'options/', {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e=>setAlert(null)} text="Could not retrieve options" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setOptions(data);
            }
        })
    }, []);


    function addTech(tech) {
        setTechs([...techs, tech]);
    }

    function extractData(dataStep1, dataStep2, dataStep3) {
        let data = {...dataStep1, ...dataStep3};
        data.tags = dataStep2.tags.map(arr => arr.value);
        data.technologies = dataStep2.technologies.map(arr => arr.value);
        data.type = dataStep3.type.value;
        data.media = dataStep3.media.value;
        data.experience_level = dataStep3.experience_level.value;
        data.images = [{url: dataStep3.image_url}];
        return data;
    }

    function submit(dataStep1, dataStep2, dataStep3) {
        setAlert('');
        apiCreate(
            STUDY_RESOURCE_ENDPOINT,
            extractData(dataStep1, dataStep2, dataStep3),
            data => {
            },
            setWaiting,
            result => {
                setAlert(<Alert close={e=>setAlert(null)} text={"Could not create."} type="danger"/>)
            },
            successHeaders => {
                setCreated({
                    url: successHeaders.get('Location')
                })
            }
        )
    }

    function handleStepOne(formData, scraped_data) {
        setDataStep1(formData);
        setDataStep2({
            tags: scraped_data['tags'] ? scraped_data['tags'].map(tag => {return {value: tag, label: tag}}) : []
        })
        setDataStep3({
            name: scraped_data['name'],
            publication_date: FormatDate(scraped_data['publishing_date'], 'html-date'),
            published_by: scraped_data['created_by'] ? scraped_data['created_by'].join(', ') : '',
            type: {label: 'free', value: 0},
            media: {label: 'article', value: 0},
            experience_level: false,
            summary: scraped_data['summary'],
            image_url: scraped_data['top_img'],
        })
        setStep(1);
        setStepStatus([
            'ok',
            'current',
            'unsubmitted'
        ]);
    }

    function renderStep(step) {

        function submitStep(step, setData, formData) {
            let stepStatusCp = [...stepStatus];
            let nextStep = step + 1;
            stepStatusCp[step] = 'ok';
            stepStatusCp[nextStep] = 'current';
            setAlert('');
            setData(formData);
            setStep(nextStep);
            setStepStatus(stepStatusCp);
        }

        switch (step) {
            case 0:
                return (
                    <CreateFormStep1 data={dataStep1} submit={handleStepOne}/>
                );
            case 1:
                return (<CreateFormStep2 data={dataStep2} tags={tags} techs={techs} addTech={addTech}
                                         submit={formData => submitStep(step, setDataStep2, formData)}
                />);
            case 2:
                return (<CreateFormStep3 data={dataStep3} options={options}
                                         submit={formData => {
                                             submitStep(step, setDataStep3, formData);
                                             submit(dataStep1, dataStep2, formData);
                                         }}
                                         waiting={waiting}
                />);
        }
    }

    if (created) return (
        <Fragment>
            <Alert text={"Created successfully."} type="success"/>
            <Alert
                text={
                    <span>
                        <span>Resource is available here: </span>
                        <a href={created.url}>your resource page</a>
                    </span>
                }
                type="info"/>
        </Fragment>
    );

    return (
        <div className="form-multistep-container full-page-md">
            <FormMultiStepProgress
                steps={stepsArr}
                currentStep={step}
                setStep={step => {
                    if (stepStatus[step] === 'ok' || stepStatus[step] === 'current') {
                        setStep(step);
                    } else {
                        setAlert(<Alert close={e=>setAlert(null)} text="Please submit current form before going to next steps." type="warning"
                                        stick={false} hideable={false}/>)
                    }
                }}
            />
            {alert}
            {renderStep(step)}
        </div>
    );
}

ReactDOM.render(<Content/>, document.getElementById('create-app'));