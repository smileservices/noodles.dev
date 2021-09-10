import React, { useEffect, useState } from 'react';
import Card from '../uikit/Card';
import PaginationComponent from '../uikit/Pagination';

const GET_LEARNING_RESOURCES_WITHOUT_REVIEWS_API = "/tutorials/api/resources/no_reviews/";

const ResourceReviewsSection = () => {
    const [learningResources, setLearningResources] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(GET_LEARNING_RESOURCES_WITHOUT_REVIEWS_API)
            .then(result => {
                if (result.ok) {
                    return result.json();
                }
            })
            .then(data => {
                const { results } = data;
                if (results && results.length) {
                    setLearningResources(results);
                }
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
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
                mapFunction={
                    (item) => (
                        <Card
                            title={`${item.name}`}
                            subtitle={`${item.publication_date} By ${item.author.username}`}
                            description={item.summary}
                            actions={(
                                <a
                                    className="uikit-button filled default"
                                    href="/"
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