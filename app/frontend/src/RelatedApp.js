import ReactDOM from "react-dom";
import RelatedComponent from "../../search/src/RelatedComponent";

function RelatedApp() {
    function addFilterFactory(tab) {
        return (name, value) => window.location = '/search/?tab=' + tab + '&' + name + '=' + value;
    }
    return (<RelatedComponent addFilter={addFilterFactory('resources')}/>)
}

ReactDOM.render(<RelatedApp/>, document.getElementById('related-app'));