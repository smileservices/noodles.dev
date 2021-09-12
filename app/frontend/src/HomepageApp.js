import React, { Fragment } from "react";
import ReactDOM from "react-dom";

import FeaturedCategories from "./sections/FeaturedCategories";
import TechnologiesAndConcepts from "./sections/TechnologiesAndConcepts";
import ResourcesAndReviews from './sections/ResourcesAndReviews';
import CollectionsSection from './sections/CollectionsSection';
import Button from "./uikit/Button";

function HomepageApp() {
  /*
   *   Homepage App is a gateway to search page
   *
   *   Search Section:
   *       - show count of total available resources
   *       - show total aggregates for filters
   *       - can filter/search
   *       - have to set Apply search or press enter in the search bar
   *
   *   Featured content based on the selected tab in the search section
   *       - resources - get latest/most reviewed
   *       - collections - latest/most voted
   *       - technologies - most voted
   *
   * */
  return (
    <Fragment>
      {/*  <section id="related" className="column-container"></section> */}
      <section className="banner-section">
        <div className="banner">
          <h2>
            Community Curated Resources <br />
            for Software Developers
          </h2>
          <Button content="Join the community" />
        </div>
      </section>
      <FeaturedCategories />
      <TechnologiesAndConcepts />
      <ResourcesAndReviews />
      <CollectionsSection />
    </Fragment>
  );
}

ReactDOM.render(<HomepageApp />, document.getElementById("homepage-app"));
