import React, { useEffect, useState } from 'react';
import Card from '../uikit/Card';
import PaginationComponent from '../uikit/Pagination';
import { FetchDataAndSetState } from '../../../src/api_interface/apiFetching'
import { HOMEPAGE_APIS } from '../utils/constants';

const ResourceReviewsSection = () => {
    const [learningResources, setLearningResources] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        FetchDataAndSetState(
            HOMEPAGE_APIS.GET_LEARNING_RESOURCES_WITHOUT_REVIEWS_API,
            setLearningResources,
            setLoading,
        )
    }, []);

    const renderContent = () => {
        if (loading) {
            return <h3>Loading...</h3>;
        }

        return (
            <PaginationComponent
                data={learningResources.map((resource, index) => ({ ...resource, index }))}
                resultsContainerClass="reviews-cards-container"
                dataLimit={3}
                limit={4}
                mapFunction={
                    (item, id) => (
                        <Card
                            key={id}
                            title={`${item.name}`}
                            subtitle={`${item.publication_date} By ${item.author.username}`}
                            description={item.summary}
                            actions={(
                                <a
                                    className="uikit-button filled default"
                                    href={item.absolute_url}
                                >
                                    <span className="button-icon icon-edit" />
                                    Leave a review
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
        <div className="reviews-container">
            <div className="reviews-text">
                <h3>FEEL FREE TO WRITE A REVIEW</h3>
                <p>Is it good? Share your thoughts!</p>
            </div>
            {renderContent()}
        </div>
    );
}

export default ResourceReviewsSection;