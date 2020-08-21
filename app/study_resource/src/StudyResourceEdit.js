import React, {useState, useEffect, Fragment} from "react"
import ReactDOM from "react-dom";
import FormMultiStepProgress from "../../src/components/FormMultiStepProgress";
import CreateFormStep1 from "./create-forms/CreateFormStep1";
import CreateFormStep2 from "./create-forms/CreateFormStep2";
import CreateFormStep3 from "./create-forms/CreateFormStep3";
import Alert from "../../src/components/Alert";
import apiCreate from "../../src/api_interface/apiCreate";
import Waiting from "../../src/components/Waiting";
import StarRating from "../../src/components/StarRating";

function Content() {
    const initialFormData = {
        rating: RESULT.rating,
        url: RESULT.url,
        tags: RESULT.tags,
        technologies: RESULT.technologies,
        name: RESULT.name,
        created_at: RESULT.created_at,
        publication_date: RESULT.publication_date,
        published_by: RESULT.published_by,
        type: RESULT.type,
        media: RESULT.media,
        experience_level: RESULT.experience_level,
        summary: RESULT.summary,
    }
    const [tags, setTags] = useState(false);
    const [techs, setTechs] = useState(false);
    const [options, setOptions] = useState(false);

    const [waiting, setWaiting] = useState('');

    const [alert, setAlert] = useState('');
    const [created, setCreated] = useState(false);
    const [formData, setFormData] = useState(initialFormData)


    useEffect(() => {
        //get tags and technologies
        let tagsPromise = fetch(
            TAGS_ENDPOINT, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert text="Could not retrieve tags" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) setTags(data);
        })
        let techsPromise = fetch(
            TECH_ENDPOINT, {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert text="Could not retrieve tags" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) setTechs(data);
        })
        let optionsPromise = fetch(
            STUDY_RESOURCE_ENDPOINT + 'options/', {method: 'GET'}
        ).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                setAlert(<Alert text="Could not retrieve options" type="danger"/>);
                return false;
            }
        }).then(data => {
            if (data) setOptions(data);
        })
    }, []);


    function addTech(tech) {
        setTechs([...techs, tech]);
    }

    function validate(formData) {

    }

    function submit(formData) {
        setAlert('');
        console.log('submit', formData)
    }

    function EditableDetail({data}) {
        return (
            <Fragment>
                {alert ? alert : ''}
                <span className="toolbar">
                    <span className="icon-pencil edit" />
                    <span className="icon-close delete" />
                </span>
                <p className="rating"><StarRating maxRating={5} rating={data.rating}/></p>
                <p className="title">
                    <a href="">{data.name}</a>
                </p>
                <p className="publication-date">Published on {data.publication_date} by {data.published_by}</p>
                <p className="creation-date">Added here on {data.created_at} by you</p>
                { !tags ? <Waiting text={"Loading tags"}/>
                    : <p className="tags">Tags
                        {data.tags.map(id => tags.map(tobj => {
                            if (tobj.pk === id) {
                                return (<a key={tobj.pk + 'tag'} className="tag"
                                           href={SEARCH_URL + "?tags=" + tobj.pk}>{tobj.name}</a>)
                            }
                        }))
                        }
                    </p>
                }
                { !techs ? <Waiting text={"Loading technologies"}/>
                    : <p className="tags">Technologies
                        {data.technologies.map(id => techs.map(tobj => {
                            if (tobj.pk === id) {
                                return (<a key={tobj.pk + 'tech'} className="tech"
                                           href={SEARCH_URL + "?technologies=" + tobj.pk}>{tobj.name}</a>)
                            }
                        }))
                        }
                    </p>
                }

                { !options ? <Waiting text={"Loading options"}/>
                    : <Fragment>
                        <p className="experience-level">Experience level: {options.experience_level.map(opt => {
                            if (opt[0] === data.experience_level) return opt[1];
                        })}</p>
                        <p className="type">
                            {options.type.map(opt => {
                                if (opt[0] === data.type) return opt[1];
                            })} {options.media.map(opt => {
                                if (opt[0] === data.media) return opt[1];
                            })}
                        </p>
                    </Fragment>
                }
                <p className="summary">{data.summary}</p>
            </Fragment>
        );
    }


    return (
        <Fragment>
            {alert ? alert : ''}
            {waiting
                ? waiting
                : <EditableDetail data={formData}/>
            }
        </Fragment>
    );
}

ReactDOM.render(
    <Content/>
    , document.getElementById('detail'));