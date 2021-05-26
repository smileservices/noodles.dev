import React from "react";
import ReactDOM from "react-dom";

import EditSuggestionApp from "../../../src/components/edit_suggestion/EditSuggestionApp";
import ConceptCategoryForm from "./ConceptCategoryForm";

function EditApp() {
    return (
        <EditSuggestionApp
            ResourceForm={ConceptCategoryForm}
            api_urls={{
                'resource_detail': RESOURCE_DETAIL,
                'edit_suggestions_list': EDIT_SUGGESTIONS_LIST,
                'publish': EDIT_SUGGESTIONS_PUBLISH,
                'reject': EDIT_SUGGESTIONS_REJECT,
                'resource_api': RESOURCE_API,
                'edit_suggestions_api': EDIT_SUGGESTIONS_API,
            }}
        />
    )
}

ReactDOM.render(<EditApp/>, document.getElementById('edit-app'));