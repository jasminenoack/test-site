var React = require("react")
import {connect} from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import NavBar from './navBar';
import Authenticate from './authenticate';
import Create from './create';

export class App extends React.Component{
    getLocation() {
        const url = this.props.location.pathname
        if (url.indexOf("create") !== -1 && this.props.userData.isTeller) {
            // If the user went to create and the user had permission
            return "create";
        } else if (url.indexOf("create") !== -1) {
            // The user went to a url he didn't have permissions for.
            return "authenticate";
        }
    };

    render() {
        let subSection;
        const current_location = this.getLocation();
        if(current_location === "create") {
            subSection = (
                <div className="create-section">
                    <Create
                        create={this.props.create}
                        error={this.props.error}
                        userData={this.props.userData}/>
                </div>
            );
        } else if (current_location === "authenticate") {
            subSection = <div className="authenticate-section"><Authenticate/></div>;
        }

        return (
            <div>
                <NavBar
                    userData={this.props.userData}
                    error={this.props.error}
                    login={this.props.login}
                    logout={this.props.logout}/>
                <div style={{height: 60}}/>
                {subSection}
            </div>
        )
    };

    componentDidMount() {
        // once the component mounts request the user's data from the server
        this.props.getUserData();
    };
};

App.propTypes = {
    getUserData: React.PropTypes.func.isRequired,
    userData: React.PropTypes.object.isRequired,
    login: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
    error: React.PropTypes.string.isRequired,
    create: React.PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        userData: state.default.get('userData').toJS(),
        error: state.default.get('error'),
    };
};

export default connect(
    mapStateToProps,
    actionCreators
)(App);
