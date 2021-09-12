import React, { useEffect, useState } from 'react';
import PaginationComponent from '../uikit/Pagination';
import Card from '../uikit/Card';
import { FetchDataAndSetState } from '../../../src/api_interface/apiFetching'
import { HOMEPAGE_APIS } from '../utils/constants';

const TechnologiesWithNoResourceSection = () => {
    const [techWithoutResource, setTechWithoutResource] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        FetchDataAndSetState(
            HOMEPAGE_APIS.GET_TECHNOLOGIES_WITHOUT_RESOURCES_API,
            setTechWithoutResource,
            setLoading,
        );
    }, [])

    const renderContent = () => {
        if (loading) return <h3>Loading...</h3>;

        if (!techWithoutResource.length) {
            return <h3>No technologies for now...</h3>;
        }

        return (
            <PaginationComponent
                data={techWithoutResource.map((technology, index) => ({ ...technology, index }))}
                resultsContainerClass="tech-resources-cards-container"
                dataLimit={3}
                mapFunction={
                    (item) => (
                        <Card
                            title={`There are no resources specific to ${item.name}`}
                            description={item.name}
                            subDescription={item.description}
                            actions={(
                                <a
                                    className="uikit-button filled default"
                                    href="/"
                                >
                                    <span className="button-icon icon-plus" />
                                    Add a Resource
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
        <div className="tech-resources-container">
            <div className="tech-resources-text">
                <h3>ADD LEARNING RESOURCES</h3>
                <p>Add an article, tutorial, course or a book about a specific technology</p>
            </div>
            {renderContent()}
        </div>
    );
}

export default TechnologiesWithNoResourceSection;