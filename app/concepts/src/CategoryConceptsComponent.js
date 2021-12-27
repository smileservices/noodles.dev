import React, {useEffect, useReducer} from "react";
import Alert from "../../src/components/Alert";
import {SkeletonLoadingSidebarDetail} from "../../src/components/skeleton/SkeletonLoadingSidebarDetail";

const FETCH_INIT_CONCEPTS = 'FETCH_INIT_CONCEPTS';
const FETCH_SUCCESS_CONCEPTS = 'FETCH_SUCCESS_CONCEPTS';
const FETCH_ERROR_CONCEPTS = 'FETCH_ERROR_CONCEPTS';

const initialConceptsState = {
    waiting: true,
    errors: false,
    concepts: [],
}

const ConceptListingElement = ({data, index}) => (<a key={index} href={data.absolute_url} className="concept-link">{data.name}</a>)

const conceptsReducer = (state, {type, payload}) => {
    switch (type) {
        case FETCH_INIT_CONCEPTS:
            return {
                waiting: true,
                errors: false,
                concepts: [],
            }
        case FETCH_SUCCESS_CONCEPTS:
            return {
                waiting: false,
                errors: false,
                concepts: payload,
            }
        case FETCH_ERROR_CONCEPTS:
            return {
                waiting: false,
                errors: payload,
                concepts: [],
            }
    }
}

export default function CategoryConceptsComponent({category}) {
    const [state, dispatch] = useReducer(conceptsReducer, {...initialConceptsState});

    useEffect(() => {
        dispatch({type: FETCH_INIT_CONCEPTS});
        fetch('/categories/api/' + category.pk + '/concepts', {
            method: 'GET',
        }).then(result => {
            if (result.ok) {
                return result.json();
            } else {
                dispatch({type: FETCH_ERROR_CONCEPTS, payload: ['Could not retrieve results']});
            }
        }).then(data => {
            dispatch({type: FETCH_SUCCESS_CONCEPTS, payload: data});
        })
    }, [category])

    const NoConcepts = (
        <div className="empty-container">
            <div className="empty-div">
                <img src="/static/imgs/add_file.png" />
                <p className="empty-text">
                    There are no concepts yet. Help the community by adding one yourself!
                </p>
                <a className="add-text" href={'/concepts/category/create?category='+category.pk}>
                    + Add Concept
                </a>
            </div>
        </div>
    );

    if (state.waiting) return (<div className="tags">{SkeletonLoadingSidebarDetail}</div>);
    if (state.concepts.length === 0) return NoConcepts;

    const conceptElements = state.concepts.map((c, index) => (<ConceptListingElement key={index} index={index} data={c}/>));
    conceptElements.push(
        <a className="add-concept-btn" href={'/concepts/category/create?category='+category.pk}>
            + Add Concept
        </a>
    );

    return (<div className="tags">{conceptElements}</div>);
}