import React from 'react';
import TechnologiesSection from './TechnologiesSection';
import ConceptsSection from './ConceptsSection';

const TechnologiesAndConcepts = ({
    featuredTechnologies,
    loadingFeaturedTechnologies,
    techWithNoConcept,
    loadingTechWithNoConcept,
}) => {
    return (
        <section className="technolgies-and-concepts-section">
            <TechnologiesSection
                technologies={featuredTechnologies}
                loading={loadingFeaturedTechnologies}
            />
            <ConceptsSection
                concepts={techWithNoConcept}
                loading={loadingTechWithNoConcept}
            />
        </section>
    );
}

export default TechnologiesAndConcepts;