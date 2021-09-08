import React from 'react';
import Card from '../uikit/Card';
import PaginationComponent from '../uikit/Pagination';

const ResourceReviewsSection = ({
    reviews,
    loading,
}) => {
    const renderContent = () => {
        if (loading) {
            return <h3>Loading...</h3>;
        }

        return (
            <PaginationComponent
                data={reviews.map((reviews, index) => ({ ...reviews, index }))}
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