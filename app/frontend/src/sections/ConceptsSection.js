import React, {useState, useEffect} from 'react';
import Card from '../uikit/Card';
import PaginationComponent from '../uikit/Pagination';
import {FetchDataAndSetState} from '../../../src/api_interface/apiFetching'
import {HOMEPAGE_APIS} from '../utils/constants';

const ConceptsSection = () => {
    const [techWithNoConcept, setTechWithNoConcept] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        FetchDataAndSetState(
            HOMEPAGE_APIS.GET_TECHNOLOGIES_WITHOUT_CONCEPT_API,
            setTechWithNoConcept,
            setLoading,
        )
    }, []);

    const renderContent = () => {
        if (loading) return <h3>Loading...</h3>;

        return (
            <PaginationComponent
                data={techWithNoConcept.map((concept, index) => ({...concept, index}))}
                resultsContainerClass="concepts-cards-container"
                dataLimit={4}
                limit={4}
                mapFunction={
                    (item, id) => (
                        <div className="card concept-dont-have">
                            <div className="card-content">
                                <div className="card-header">
                                    <h4 className="header-text">
                                        <a href={item.absolute_url}>{`There are no concepts specific to ${item.name}`}</a>
                                    </h4>
                                </div>
                                <a href={`/concepts/technology/create?technology=${item.pk}`}>
                                    <span className="button-icon icon-plus"/>
                                    Add Concept
                                </a>
                            </div>
                        </div>
                    )
                }
            />
        )
    }

    return (
        <div className="concepts-container">
            <div className="concepts-text">
                <h3>BE THE FIRST TO ADD A CONCEPT</h3>
                <p>A concept proposes a theoretical solution to a specific problem</p>
            </div>
            {renderContent()}
        </div>
    );
}

export default ConceptsSection;