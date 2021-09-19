import React, { useState, useEffect } from 'react';
import Card from '../uikit/Card';
import PaginationComponent from '../uikit/Pagination';
import { FetchDataAndSetState } from '../../../src/api_interface/apiFetching'
import { HOMEPAGE_APIS } from '../utils/constants';

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
                data={techWithNoConcept.map((concept, index) => ({ ...concept, index }))}
                resultsContainerClass="concepts-cards-container"
                dataLimit={3}
                limit={4}
                mapFunction={
                    (item, id) => (
                        <Card
                            key={id}
                            title={`There are no concepts specific to ${item.name}`}
                            description={item.name}
                            subDescription={item.description}
                            actions={(
                                <a
                                    className="uikit-button filled default"
                                    href={`/concepts/technology/create?technology=${item.pk}`}
                                >
                                    <span className="button-icon icon-plus" />
                                    Add Concept
                                </a>
                            )}
                            image={item.image_file.small}
                            isDetailedDescription
                            link={item.absolute_url}
                        />
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