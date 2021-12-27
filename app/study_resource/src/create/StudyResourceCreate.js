import React, {useState, useEffect, Fragment} from "react"
import ReactDOM from "react-dom";
import FormMultiStepProgress from "../../../src/components/FormMultiStepProgress";
import CreateFormStep1 from "./CreateFormStep1";
import CreateFormStep2 from "./CreateFormStep2";
import CreateFormStep3 from "./CreateFormStep3";
import Alert from "../../../src/components/Alert";
import apiCreate from "../../../src/api_interface/apiCreate";
import FormatDate from "../../../src/vanilla/date";
import confettiFactory from "../../../src/vanilla/confetti";
import Waiting from "../../../src/components/Waiting";

const startConfetti = confettiFactory(100, 1);

function StudyResourceCreateApp() {
    const emptyDataStep1 = {
        url: '',
    }
    const emptyDataStep2 = {
        tags: [],
        technologies: [],
        category_concepts: [],
        technology_concepts: [],
    }
    const emptyDataStep3 = {
        name: '',
        publication_date: '',
        published_by: '',
        category: '',
        type: false,
        media: false,
        experience_level: false,
        summary: '',
        image_screenshot: true,
        image_url: '',
    }
    const [step, setStep] = useState(0);
    const [categories, setCategories] = useState([]);
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
        if (created) startConfetti('confetti-canvas');
    }, [created,]);

    useEffect(() => {
        //get categories options
        fetch(
            CATEGORIES_OPTIONS_API, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve categories" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setCategories(data);
            }
        })
        //get tags and technologies
        fetch(
            TAGS_OPTIONS_API, {method: 'GET'}
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
        fetch(
            TECH_OPTIONS_API, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve tags" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setTechs(data);
            }
        })
        let optionsPromise = fetch(
            STUDY_RESOURCE_API + 'options/', {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert close={e => setAlert(null)} text="Could not retrieve options" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) {
                setOptions(data);
            }
        })
    }, []);


    function addTechToOptions(data) {
        //data is serialized detail tech data
        //add newly created tech to existing technologies
        const techOption = {'value': data.pk, 'label': data.name};
        setTechs([...techs, techOption]);
    }

    function normalize(dataStep1, dataStep2, dataStep3) {
        let data = {...dataStep1, ...dataStep3};
        data.tags = dataStep2.tags.map(arr => arr.value);
        /*
        !! selected techs should be a list containing this structure:

        'name': '',
        'technology_id': false,
        'version': '',

        * */
        data.category = dataStep3.category.value;
        data.technologies = dataStep2.technologies.map(tech => {
            if (!tech.version) tech.version = 0;
            return tech;
        });
        data.category_concepts = dataStep2.category_concepts.map(c => c.value);
        data.technology_concepts = dataStep2.technology_concepts.map(c => c.value);
        data.type = dataStep3.type.value;
        data.media = dataStep3.media.value;
        data.experience_level = dataStep3.experience_level.value;
        //handle images
        if (data.image_screenshot) {
            delete data.image_file;
            delete data.image_url;
        } else {
            //todo this is confusing. need to refactor sometime
            if (data.image_file && !data.image_file.url && !data.image_file.file) {
                delete data.image_file;
                delete data.image_url;
            } else {
                if (data.image_file.file) {
                    data.image_file = data.image_file.file;
                    delete data.image_url;
                }
                if (data.image_file.url) {
                    data.image_url = data.image_file.url;
                    delete data.image_file;
                }
            }
        }
        return data;
    }

    function makeFormData(data) {
        let packagedData = new FormData();
        data['technologies'] = JSON.stringify(data['technologies']);
        data['tags'] = JSON.stringify(data['tags']);
        data['category_concepts'] = JSON.stringify(data['category_concepts']);
        data['technology_concepts'] = JSON.stringify(data['technology_concepts']);
        Object.keys(data).map(value => packagedData.append(value, data[value]));
        return packagedData;
    }

    function submit(dataStep1, dataStep2, dataStep3) {
        let normalizedData = normalize(dataStep1, dataStep2, dataStep3);
        const packagedFormData = makeFormData(normalizedData);
        setAlert('');
        apiCreate(
            STUDY_RESOURCE_API,
            packagedFormData,
            data => {
                setCreated({url: data.absolute_url, success: data.success})
            },
            setWaiting,
            result => {
                setAlert(<Alert close={e => setAlert(null)} text={"Could not create."} type="danger"/>)
            },
            'multipart'
        )
    }

    function handleStepOne(formData, data) {
        // will scrape the data from url and prepopulate next steps with it, by posting to validate_url endpoint
        // will create an intermediary resource. we do this because some resources creation
        // may fail or to not add same resource at the same time. we check the statuses:
        //
        // status: 0 - PENDING -- another user is trying to add the same url. cannot continue adding. try again
        // status: 1 - ERROR -- last time someone tried to add this, there was an error. try again
        // status: 2 - SAVED -- already added. cannot continue adding.
        setDataStep1(formData);
        let dataObjStep2 = {};
        const scraped_data = data.scraped_data;
        scraped_data['tags']
            ? dataObjStep2['tags'] = scraped_data['tags']
                .map(tag => {
                    return {value: tag, label: tag}
                })
            : dataObjStep2['tags'] = [];

        scraped_data['technologies']
            ? dataObjStep2['technologies'] = scraped_data['technologies']
                .map(tech => {
                    return {name: tech.name, technology_id: tech.pk, version: tech.version}
                })
            : dataObjStep2['technologies'] = [{name: '', technology_id: '', version: ''},];
        setDataStep2({...dataStep2, ...dataObjStep2});

        setDataStep3({
            name: scraped_data['name'],
            publication_date: FormatDate(scraped_data['publishing_date'], 'html-date'),
            published_by: scraped_data['created_by'].join(', '),
            category: null,
            type: {label: 'Free', value: 0},
            media: {label: 'Article', value: 0},
            experience_level: {label: 'Absolute Beginner', value: 0},
            summary: scraped_data['summary'],
            image_screenshot: true,
            image_file: {url: scraped_data['top_img']},
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
                return (<CreateFormStep2 data={dataStep2} tags={tags} techs={techs} options={options}
                                         addTechToOptions={addTechToOptions}
                                         submit={formData => submitStep(step, setDataStep2, formData)}
                />);
            case 2:
                return (<CreateFormStep3 data={dataStep3} options={options} categories={categories}
                                         submit={formData => {
                                             submitStep(step, setDataStep3, formData);
                                             submit(dataStep1, dataStep2, formData);
                                         }}
                                         waiting={waiting}
                />);
        }
    }

    if (waiting) return (
        <div className="card full-page-sm waiting">
            <Waiting text={waiting}/>
        </div>
    )

    if (created) return (
        <div className="success-card column-container card full-page-sm">
            <canvas id="confetti-canvas" key="confetti-canvas"/>
            <header>Thank you!</header>
            <div className="body" dangerouslySetInnerHTML={{__html: created.success.message}}/>
            <div className="buttons-container">
                <a className="btn" href={created.url}>View Created</a>
                <a className="btn dark" href="/">Back to Homepage</a>
            </div>
        </div>
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
                        setAlert(<Alert close={e => setAlert(null)}
                                        text="Please submit current form before going to next steps." type="warning"
                                        stick={false} hideable={false}/>)
                    }
                }}
            />
            {alert}
            {renderStep(step)}
        </div>
    );
}

ReactDOM.render(<StudyResourceCreateApp/>, document.getElementById('create-app'));