import React from "react";
import {makeId} from "./utils";

function SelectLanguageDropdown(props) {

    const changeLanguage = (languageId) => {
        document.cookie="django_language="+languageId+";path=/;max-age="+60*60*24*365;
        document.location.reload();
    }

    return (
        <li className="dropdown">
            <a href="javascript:void(0);" className="dropdown-toggle ink-reaction" data-toggle="dropdown">
                <i className="fa fa-language" aria-hidden="true"> </i> {gettext('Language')}
            </a>
            <ul className="dropdown-menu animation-dock">
                <li className="dropdown-header">{gettext('Select language')}</li>
                 { LANGUAGES.map(language=>(
                    <li><a className={language.id===LANGUAGE_CODE ? "selected" : ""} onClick={event => {
                        event.preventDefault();
                        changeLanguage(language.id)
                    }} key={makeId(7)}>{language.text}</a></li>
                ))}
            </ul>
        </li>
    )
}

export default SelectLanguageDropdown;