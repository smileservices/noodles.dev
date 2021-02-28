import React, {useState, Fragment} from "react";

export default function TruncatedTextComponent({fullText, charLimit, action}) {
    const [showAll, setShowAll] = useState(false);
    if (fullText.length <= charLimit) return fullText;
    if (showAll) {
        return (
            <Fragment>
                {fullText}
                <span className="read-more" onClick={e => setShowAll(false)}>hide</span>
            </Fragment>
        )
    } else {
        return (
            <Fragment>
                {fullText.substring(0, charLimit)}...
                <span className="read-more" onClick={e => action ? action : setShowAll(true)}>show more</span>
            </Fragment>
        )
    }
}