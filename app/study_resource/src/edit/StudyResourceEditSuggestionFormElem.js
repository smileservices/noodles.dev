import React, {useState, useEffect, Fragment} from "react"
import FormatDate from "../../../src/vanilla/date";

export default function StudyResourceEditSuggestionFormElem({data}) {
    return (
        <Fragment>
            <p>{data.name}</p>
            <p>author: {data.edit_suggestion_author.get_full_name}</p>
            <p>reason: {data.edit_suggestion_reason}</p>
            <p>{FormatDate(data.edit_suggestion_date_created, 'datetime')}</p>
        </Fragment>
    )
}