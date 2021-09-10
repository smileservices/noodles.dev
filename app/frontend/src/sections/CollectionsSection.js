import React, { useEffect, useState } from 'react';
import Button from '../uikit/Button';
import Pagination from '../uikit/Pagination';
import { shortenText } from '../utils/strings';

const GET_FEATURED_COLLECTIONS_API = "/collections/api/featured/";

const CollectionsSection = () => {
    const [featuredCollections, setFeaturedCollections] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(GET_FEATURED_COLLECTIONS_API)
            .then(result => {
                if (result.ok) {
                    return result.json();
                }
            })
            .then(data => {
                const { results } = data;
                if (results && results.length) {
                    setFeaturedCollections(results);
                }
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const renderContent = () => {
        if (loading) return <h3>Loading...</h3>;
        return (
            <div className="collections-cards-container">
                <Pagination
                    data={featuredCollections.map((collection, index) => ({ ...collection, index }))}
                    resultsContainerClass="collections-cards"
                    dataLimit={3}
                    mapFunction={
                        (item) => (
                            <div className="collection-card">
                                <div className="card-count">{item.index + 1}</div>
                                <div className="collection-details">
                                    <h4>
                                        {shortenText(item.name, 0, 20)}...
                                    </h4>
                                    <p>
                                        {shortenText(item.description, 0, 35)}...
                                    </p>
                                </div>
                            </div>
                        )
                    }
                />
            </div>
        );
    }

    return (
        <div className="collections-section">
            <div className="collections-container">
                <div className="collections-text">
                    <h3>FEATURED COLLECTION</h3>
                    <p>Create your own collection of study resources and share it within the community!</p>
                </div>
                {renderContent()}
            </div>
            <div className="add-collections-call-to-action">
                <img src="/static/imgs/collection.png" />
                <h2>
                    Collect any resources<br/>that you like
                </h2>
                <Button color="black">
                    + Add a Collection
                </Button>
            </div>
        </div>
    );
}

export default CollectionsSection;