var React = require("react");

export class Authenticate extends React.Component{
    render() {
        return (
            <div style={{maxWidth: 700, margin: "auto", textAlign: "center"}}>
                <h1>
                    Unfortunately you do not have access to this page
                </h1>
                <p>
                    Please authenticate with an account with the appropriate permissions
                </p>
            </div>
        );
    }
}

export default Authenticate;
