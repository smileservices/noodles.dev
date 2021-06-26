import React from "react";
import TruncatedTextComponent from "../../src/components/TruncatedTextComponent";

export default function CategorySearchListing({data, addFilter}) {
    return (
        <div className="result card category">
            <header>
                <div className="right">
                    <h4 className="title"><a href={data.url}>{data.name}</a></h4>
                </div>
                <div className="tags">
                        <span>{data.parent}</span>
                    </div>
            </header>
            <div className="description">
                <TruncatedTextComponent fullText={data.description} charLimit={250} />
            </div>
        </div>
    )
}