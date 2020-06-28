import React, {useState} from "react";
import ReactDOM from "react-dom";
import {makeId} from "./utils";
import onClickOutside from "react-onclickoutside";

function SelectLanguageDropdown(props) {
    const [expanded, setExpanded] = useState(false);

    SelectLanguageDropdown.handleClickOutside = () => {
        setExpanded(false);
    }

    const changeLanguage = (languageId) => {
        document.cookie="django_language="+languageId+";path=/;max-age="+60*60*24*365;
        document.location.reload();
    }

    return (
        <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" onClick={event => {
                event.preventDefault();
                setExpanded(!expanded);
            }}>
                <i className="fas fa-globe-americas"></i>
            </a>
            <div className={expanded ? "dropdown-menu dropdown-menu-language show" : "dropdown-menu"}>
                { LANGUAGES.map(language=>(
                    <a className={language.id===LANGUAGE_CODE ? "dropdown-item selected" : "dropdown-item"} onClick={event => {
                        event.preventDefault();
                        changeLanguage(language.id)
                    }} key={makeId(7)}>{language.text}</a>
                ))}
            </div>
        </li>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => SelectLanguageDropdown.handleClickOutside
};

export default onClickOutside(SelectLanguageDropdown, clickOutsideConfig);