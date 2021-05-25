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

const ConceptListingElement = ({data}) => (<a href={data.absolute_url} className="concept">{data.name}</a>)

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

const NoConcepts = (
    <Alert text="There are no concepts yet. Help the community by adding one yourself!" stick={true}
           hideable={false} type="warning"/>
);

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

    if (state.waiting) return SkeletonLoadingSidebarDetail;
    if (state.concepts.length === 0) return NoConcepts;
    return (
        <div className="tags">
            {state.concepts.map(c => (<ConceptListingElement data={c}/>))}
        </div>
    )
}