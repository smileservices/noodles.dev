export function Waiting({text}) {
    return (
        <div className="waiting-container">
            <p className="text">{text}</p>
            <i className="fas fa-cog spinning"> </i>
        </div>
    )
}