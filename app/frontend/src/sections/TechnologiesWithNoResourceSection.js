import React from 'react';
import Card from '../uikit/Card';

const TechnologiesWithNoResourceSection = ({
    technologies,
    loading,
}) => {
    const renderContent = () => {
        if (loading) return <h3>Loading...</h3>;

        return (
            <div />
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