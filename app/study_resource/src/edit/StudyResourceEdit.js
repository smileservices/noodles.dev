import React, {useState, useEffect, Fragment} from "react"
import ReactDOM from "react-dom";
import Alert from "../../../src/components/Alert";
import DetailStatic from "./DetailStatic";
import EditForm from "./EditForm";

function Content() {

    const initialData = {
        url: RESULT.url,
        tags: RESULT.tags,
        technologies: RESULT.technologies,
        name: RESULT.name,
        author_id: RESULT.author_id,
        author: RESULT.author,
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

    const [alert, setAlert] = useState('');
    const [editForm, setEditForm] = useState(false);
    const [data, setData] = useState(initialData)


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

    if (editForm) return <EditForm data={data} tags={tags} techs={techs} options={options}
                                   addTech={addTech}
                                   setData={data => {
                                       setEditForm(false);
                                       setAlert(<Alert text="Successfully updated the resource!"  type="success" />)
                                       setData(data);
                                   }}
                                   cancel={e => setEditForm(false)}/>

    return (
        <Fragment>
            {alert ? alert : ''}
            <DetailStatic data={data} tags={tags} techs={techs} options={options} setEditForm={setEditForm}/>
        </Fragment>
    );
}

ReactDOM.render(
    <Content/>
    , document.getElementById('detail'));