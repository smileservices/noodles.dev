import React from 'react';
import TechnologiesWithNoResourceSection from '../sections/TechnologiesWithNoResourceSection';
import ResourceReviewsSection from '../sections/ResourceReviewsSection';

const ResourcesAndReviews = ({
    techWithNoResource,
    reviews,
    loadingTechWithNoResource,
    loadingReviews,
}) => {
    return (
        <section className="resources-and-reviews-section">
            <TechnologiesWithNoResourceSection
                technologies={techWithNoResource}
                loading={loadingTechWithNoResource}
            />
            <ResourceReviewsSection
                reviews={reviews}
                loading={loadingReviews}
            />
        </section>
    );
}

export default ResourcesAndReviews;