import React from 'react';
import Card from '../uikit/Card';
import PaginationComponent from '../uikit/Pagination';

const ConceptsSection = ({
    concepts,
    loading,
}) => {
    const renderContent = () => {
        if (loading) return <h3>Loading...</h3>;

        return (
            <PaginationComponent
                lastIndex={concepts.indexOf(concepts[concepts.length - 1])}
                data={concepts.map((concepts, index) => ({ ...concepts, index }))}
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