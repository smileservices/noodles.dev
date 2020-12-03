import React, {Fragment} from "react"
import FormatDate from "../../../src/vanilla/date";

// {
//     "pk": 95,
//     "resource": "editsuggestiontechnology",
//     "object_id": "9",
//     "event_type": "Many-to-Many Change",
//     "user": null,
//     "datetime": "2020-12-02T07:06:26.750869Z",
//     "changed_fields": null,
//     "object_json_repr": "[{
//           "model": "technology.editsuggestiontechnology",
//           "pk": 9,
//           "fields": {"thumbs_up_array": "[]",
//           "thumbs_down_array": "[]",
//           "name": "nginx edited",
//           "description": "Bill push skin their write do. Might forget official investment able small rich. Social position upon way why industry smile.",
//           "version": "6.12",
//           "license": 0,
//           "url": "https://www.clark.com/",
//           "owner": "Johnston-Crosby",
//           "pros": "Former different nice company. Any attorney another anyone couple fly mother. Right office way serious according worker quite.",
//           "cons": "Summer dream week area. Specific off common identify challenge final.nThose stage yes mention admit stuff federal. House if analysis girl environment fill.",
//           "limitations": "Method note wait here stage others.nSuch son believe evening rise. Mean however throw staff.nSite team city give future break prevent.",
//           "edit_suggestion_author": 41,
//           "edit_suggestion_parent": 18,
//           "edit_suggestion_date_created": "2020-12-02T07:06:26.739Z",
//           "edit_suggestion_date_updated": "2020-12-02T07:06:26.739Z",
//           "edit_suggestion_reason": "",
//           "edit_suggestion_status": 0,
//           "edit_suggestion_reject_reason": "",
//           "ecosystem": [10]}
//      }]"
// },

export default function ActivityItem({data}) {
    const item = JSON.parse(data.object_json_repr)[0].fields;
    //todo handle different type of items - solution/problem/technology,edit suggestion
    //todo have href to item

    return (
        <div className="card result log">
            <p>date {FormatDate(data.datetime, 'html-date')} by {data.user ? data.user : 'system'}</p>
            <p>{data.resource} id {data.object_id}</p>
            <p>{data.event_type}</p>
            <h2 className="title">{item.name}</h2>
            <p>{data.description}</p>
        </div>
    )
}