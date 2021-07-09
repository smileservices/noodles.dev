import React from "react";
import UserListing from "../../users/src/UserListing";
import FormatDate from "../../src/vanilla/date";
import {makeId} from "../../src/components/utils";

function formatChange(field, content) {
    if (field === 'image_file') {
        return (
            <div className="images-diff">
                <div className="image">
                    <span className="image-overlay">Old</span>
                    <img src={content.old.small} alt=""/>
                </div>
                <div className="image">
                    <span className="image-overlay">New</span>
                    <img src={content.new.small} alt=""/>
                </div>
            </div>
        );
    }
    if (typeof content === 'object') return <span dangerouslySetInnerHTML={{__html: content.label}}/>;
    return <span dangerouslySetInnerHTML={{__html: content}}/>;
}

export default function ResourceHistoryListing({data}) {

    const updated_meta = (() => {
        if (data.operation_type_label !== 'update') return '';
        if (data.operation_source_label === 'direct') return (
            <div className="updated_meta">Edited by <UserListing
                data={data.author}/> on {FormatDate(data.created, 'datetime')}</div>
        );
        if (data.operation_source_label === 'edit_suggestion') return (
            <div className="updated_meta"><UserListing data={data.edit_published_by}/> published
                on {FormatDate(data.created, 'datetime')} Edit Suggestion of <UserListing data={data.author}/></div>
        );
        if (data.operation_source_label === 'automatic') return (
            <div className="updated_meta">Automatic Edited on {FormatDate(data.created, 'datetime')}</div>
        );
    })();
    const formatted_changes = (() => {
        const changes_obj = JSON.parse(data.changes);
        return (
            <div className="changes">
                {Object.keys(changes_obj).map(field =>
                    <div key={makeId(4)} className="change">
                        <div className="field">{field}</div>
                        <div className="diff">{formatChange(field, changes_obj[field])}</div>
                    </div>
                )}
            </div>
        );
    })();
    return (
        <div className="card result history-result">
            {updated_meta}
            <h4>Changes</h4>
            {formatted_changes}
            <div className="reason">
                <h4>Reason</h4>
                {data.edit_reason ? data.edit_reason : 'No specified reason'}
            </div>
        </div>
    );
}