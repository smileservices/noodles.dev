import React, {useEffect, useState, Fragment} from "react";
import ReactDOM from "react-dom";
import {makeId} from "../../src/components/utils";
import {SkeletonLoadingSidebar} from "../../src/components/skeleton/SkeletonLoadingSidebar";

const other_icon = (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M2.25 1.5H9.75C10.2 1.5 10.5 1.2 10.5 0.75C10.5 0.3 10.2 0 9.75 0H2.25C1.8 0 1.5 0.3 1.5 0.75C1.5 1.2 1.8 1.5 2.25 1.5Z"
        fill="white"/>
    <path
        d="M11.25 3H0.75C0.3 3 0 3.3 0 3.75V11.25C0 11.7 0.3 12 0.75 12H11.25C11.7 12 12 11.7 12 11.25V3.75C12 3.3 11.7 3 11.25 3ZM9 8.25H3V5.25H4.5V6.75H7.5V5.25H9V8.25Z"
        fill="white"/>
</svg>);

const URL = '/sidebar/';

function SidebarApp() {
    /*
    * Just get the available technologies and display them in the sidebar
    * */

    const [data, setData] = useState({'featured': [], 'other': []});
    const [waiting, setWaiting] = useState(true);
    const [error, setError] = useState('');
    const [showOther, setShowOther] = useState(false);

    useEffect(e => {
        /*
        * data should be like: {featured: {category: [{logo: ..., name: ..., url: ...}, ...], category2: ...}, other: {...same structure...}}
        *
        * */
        fetch(URL, {
            method: "GET",
        }).then(result => {
            setWaiting(false);
            if (result.ok) {
                return result.json();
            } else {
                setError('Could not read data: ' + result.statusText)
            }
        }).then(data => {
            setData(data);
        }).catch(err => {
            console.error(err);
        });

    }, []);

    const TechListing = ({t}) => <a href={t.url}>
        {t.logo.small ? <img src={t.logo.small} alt=""/> : <span className="no-logo"> </span>}
        {t.name}
    </a>;

    const CategoryListing = ({c, techList}) => (
        <div className="category" data-tooltip={c}>
            {techList.map(t => <TechListing t={t} key={makeId(3)}/>)}
        </div>
    );


    function displayOther(techList, showOther) {
        if (!Object.keys(techList).length) return '';
        if (!showOther) {
            return <a href="" className="other" onClick={e => {
                e.preventDefault();
                setShowOther(true)
            }}>
                {other_icon}
                Other
            </a>
        } else {
            return (
                <div className="sidebar-other-container">
                    <a href="" className="other" onClick={e => {
                        e.preventDefault();
                        setShowOther(false);
                    }}>
                        {other_icon}
                        Hide Other
                    </a>
                    {Object.keys(techList).map(category =>
                        <CategoryListing c={category} techList={techList[category]} key={makeId(4)}/>
                    )}
                </div>
            )
        }
    }

    if (waiting) return SkeletonLoadingSidebar;

    if (error) return (
        <div className="links">
            {error}
        </div>
    )

    return (
        <div className="links">
            {Object.keys(data.featured).length > 0
                ? Object.keys(data.featured).map(category =>
                        <CategoryListing c={category} techList={data.featured[category]} key={makeId(4)}/>
                    )
                : ''
            }
            {displayOther(data.other, showOther)}
        </div>
    )
}

ReactDOM.render(<SidebarApp/>, document.getElementById('sidebar-app'));