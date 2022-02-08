import React, { useEffect, useState } from 'react';
import PaginationComponent from '../uikit/Pagination';
import Card from '../uikit/Card';
import apiFetch from '../../../src/api_interface/apiFetch'
import { HOMEPAGE_APIS } from '../utils/constants';

const TechnologiesWithNoResourceSection = () => {
    const [techWithoutResource, setTechWithoutResource] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        apiFetch(
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
                dataLimit={4}
                limit={10}
                mapFunction={
                    (item) => (
                        <Card
                            key={"techn-no-resource"+item.pk}
                            title={
                                item.resources_count === 0
                                    ? `Be the first to add a resource for ${item.name}`
                                    : `There are only ${item.resources_count} resources for ${item.name}`
                            }
                            description={false}
                            subDescription={false}
                            actions={(
                                <a href="/tutorials/create/">
                                    <span className="button-icon icon-plus" />
                                    Add a Resource
                                </a>
                            )}
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