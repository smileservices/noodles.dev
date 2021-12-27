import React from 'react';
import TechnologiesWithNoResourceSection from '../sections/TechnologiesWithNoResourceSection';
import ResourceReviewsSection from '../sections/ResourceReviewsSection';

const ResourcesAndReviews = () => {
    return (
        <section className="resources-and-reviews-section">
            <TechnologiesWithNoResourceSection />
            <ResourceReviewsSection />
        </section>
    );
}

export default ResourcesAndReviews;