import React, { useState, useEffect } from 'react';
import Card from '../uikit/Card';
import PaginationComponent from '../uikit/Pagination';

const GET_TECHNOLOGIES_WITHOUT_CONCEPT_API = "/learn/api/no_technology_concept/";

const ConceptsSection = () => {
    const [techWithNoConcept, setTechWithNoConcept] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(GET_TECHNOLOGIES_WITHOUT_CONCEPT_API)
            .then(result => {
                if (result.ok) {
                    return result.json();
                }
            })
            .then(data => {
                const { results } = data;
                if (results && results.length) {
                    setTechWithNoConcept(results);
                }
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const renderContent = () => {
        if (loading) return <h3>Loading...</h3>;

        return (
            <PaginationComponent
                data={techWithNoConcept.map((concept, index) => ({ ...concept, index }))}
                resultsContainerClass="concepts-cards-container"
                dataLimit={3}
                mapFunction={
                    (item) => (
                        <Card
                            title={`There are no concepts specific to ${item.name}`}
                            description={item.name}
                            subDescription={item.description}
                            actions={(
                                <a
                                    className="uikit-button filled default"
                                    href={`/concepts/category/create?category=${item.pk}`}
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