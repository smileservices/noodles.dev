import React, {useEffect, useReducer} from "react";
import TechnologyMinimalListing from "../../../technology/src/TechnologyMinimalListing";
import Alert from "../../../src/components/Alert";
import {SkeletonLoadingSidebarDetail} from "../../../src/components/skeleton/SkeletonLoadingSidebarDetail";
import CategoryConceptsComponent from "../../../concepts/src/CategoryConceptsComponent";

const URL_TECHNOLOGIES = '/categories/api/';
const URL_CREATE_TECHNOLOGY = '/technologies/create/';

const FETCH_INIT_TECHNOLOGIES = 'FETCH_INIT_TECHNOLOGIES';
const FETCH_SUCCESS_TECHNOLOGIES = 'FETCH_SUCCESS_TECHNOLOGIES';
const FETCH_ERROR_TECHNOLOGIES = 'FETCH_ERROR_TECHNOLOGIES';
const FETCH_INIT_RESOURCES = 'FETCH_INIT_RESOURCES';
const FETCH_SUCCESS_RESOURCES = 'FETCH_SUCCESS_RESOURCES';
const FETCH_ERROR_RESOURCES = 'FETCH_ERROR_RESOURCES';

const initialState = {
    waitingTechnologies: true,
    errorsTechnologies: false,
    waitingResources: true,
    errorsResources: false,
    technologies: [],
    resources: [],
}

const reducer = (state, {type, payload}) => {
    switch (type) {
        case FETCH_INIT_TECHNOLOGIES:
            return {
                ...state,
                waitingTechnologies: true,
                errorsTechnologies: false,
                technologies: [],
            }
        case FETCH_SUCCESS_TECHNOLOGIES:
            return {
                ...state,
                waitingTechnologies: false,
                errorsTechnologies: false,
                technologies: payload,
            }
        case FETCH_ERROR_TECHNOLOGIES:
            return {
                ...state,
                waitingTechnologies: false,
                errorsTechnologies: payload,
                technologies: [],
            }
        case FETCH_INIT_RESOURCES:
            return {
                ...state,
                waitingResources: true,
                errorsResources: false,
                resources: [],
            }
        case FETCH_SUCCESS_RESOURCES:
            return {
                ...state,
                waitingResources: false,
                errorsResources: false,
                resources: payload,
            }
        case FETCH_ERROR_RESOURCES:
            return {
                ...state,
                waitingResources: false,
                errorsResources: payload,
                resources: [],
            }
    }
}

const NoTechs = (
    <Alert text="There are no technologies yet. Help the community by adding one yourself!" stick={true}
           hideable={false} type="warning"/>
);

export default function CategoryDetailComponent({category}) {
    const [state, dispatch] = useReducer(reducer, {...initialState});

    useEffect(() => {
        dispatch({type: FETCH_INIT_TECHNOLOGIES});
        //todo use paginated fetch (overkill now)
        fetch(URL_TECHNOLOGIES + category.pk + '/get_technologies/', {
            method: 'GET',
        }).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                dispatch({type: FETCH_ERROR_RESOURCES, payload: ['Could not retrieve results']});
            }
        }).then(data => {
            dispatch({type: FETCH_SUCCESS_TECHNOLOGIES, payload: data.technologies});
        })
    }, [category])

    useEffect(() => {
        // console.log('fetch resources', category.name)
        //todo
    }, [category])

    const technologiesList = () => {
        if (state.waitingTechnologies) return (SkeletonLoadingSidebarDetail);
        if (state.errorsTechnologies) return state.errorsTechnologies.map(err => (
            <Alert text={err} type="danger" hideable={false} stick={true}/>
        ));
        if (state.technologies.length === 0) return (NoTechs);
        return state.technologies.map(t => <TechnologyMinimalListing key={'tech-' + t.pk} data={t}/>);
    }

    return (
        <div className="category-detail">
            <h4 className="name">{category.name}</h4>
            <div className="description">
                <p>{category.description}</p>
                <a className="link detail" href={category.url}>view detail</a>
            </div>
            <h5>Concepts</h5>
            <div className="concepts-container">
                {<CategoryConceptsComponent category={category} />}
                <a className="contribute" href={'/concepts/category/create?category='+category.pk}>Add New Concept</a>
            </div>
            <h5>Associated Technologies:</h5>
            <div className="technologies-container">
                {technologiesList()}
            </div>
            <div className="contribute-container">
                <a className="contribute" href={URL_CREATE_TECHNOLOGY}>Add New Technology</a>
            </div>
        </div>
    )
}