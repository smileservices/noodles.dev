import React, { useEffect, useState } from 'react';
import Pagination from '../uikit/Pagination';
import { shortenText } from '../utils/strings';
import { FetchDataAndSetState } from '../../../src/api_interface/apiFetching'
import { HOMEPAGE_APIS } from '../utils/constants';

const CollectionsSection = () => {
    const [featuredCollections, setFeaturedCollections] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        FetchDataAndSetState(
            HOMEPAGE_APIS.GET_FEATURED_COLLECTIONS_API,
            setFeaturedCollections,
            setLoading,
        );
    }, []);

    const renderContent = () => {
        if (loading) return <h3>Loading...</h3>;
        return (
            <div className="collections-cards-container">
                <Pagination
                    data={featuredCollections.map((collection, index) => ({ ...collection, index }))}
                    resultsContainerClass="collections-cards"
                    dataLimit={3}
                    limit={4}
                    mapFunction={
                        (item, id) => (
                            <div className="collection-card" key={id}>
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
                <a
                    className="uikit-button filled black"
                    href="/users/my-collections"
                >
                    + Add a Collection
                </a>
            </div>
        </div>
    );
}

export default CollectionsSection;