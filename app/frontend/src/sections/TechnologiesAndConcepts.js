import React, { useState } from 'react';
import Card from '../uikit/Card';
import TechnologiesSection from './TechnologiesSection';
import PaginatedLayout from '../../../src/components/PaginatedLayout';

// addConceptLink: "http://localhost:8000/concepts/category/create?category=5"

const TechnologiesAndConcepts = ({
    featuredTechnologies,
    loadingFeaturedTechnologies,
}) => {
    // TODO: Use API data when ready
    // const [concepts, setConcepts] = useState(featuredTechnologies);
    const [conceptsPagination, setConceptsPagination] = useState({
        resultsPerPage: 3,
        current: 1,
        offset: 0
    });
    console.log(featuredTechnologies);

    return (
        <section className="technolgies-and-concepts-section">
            <TechnologiesSection
                technologies={featuredTechnologies}
                loading={loadingFeaturedTechnologies}
            />
            <div className="concepts-container">
                <div className="concepts-text">
                    <h3>BE THE FIRST TO ADD A CONCEPT</h3>
                    <p>A concept proposes a theoretical solution to a specific problem</p>
                </div>
                <PaginatedLayout
                    data={featuredTechnologies}
                    resultsCount={featuredTechnologies.length}
                    pagination={conceptsPagination}
                    setPagination={setConceptsPagination}
                    resultsContainerClass="concepts-cards-container"
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
                                        + Add Concept
                                    </a>
                                )}
                                image={item.image_file.small}
                                isDetailedDescription
                                link={item.absolute_url}
                            />
                        )
                    }
                />
            </div>
        </section>
    );
}

export default TechnologiesAndConcepts;