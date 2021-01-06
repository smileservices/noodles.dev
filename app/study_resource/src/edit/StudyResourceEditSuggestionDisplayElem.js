import React, {useState, useEffect, Fragment} from "react"
import FormatDate from "../../../src/vanilla/date";

export default function StudyResourceEditSuggestionDisplayElem({data}) {
    return (
        <Fragment>
            <p>{data.name}</p>
        </Fragment>
    )
}