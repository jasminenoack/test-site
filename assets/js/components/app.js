var React = require("react");
import {connect} from "react-redux";
import * as actionCreators from "../actions/actionCreators";
import NavBar from "./navBar";
import Authenticate from "./authenticate";
import Create from "./create";
import Accounts from "./accounts";
import CreateAccount from "./createAccount";
import Users from "./users";
import CreateTransaction from "./createTransaction";

export class App extends React.Component{
    getLocation() {
        const url = this.props.location.pathname;
        if(url.indexOf("create/account") !== -1 && this.props.userData.isTeller) {
            return "createAccount";
        } else if (url.indexOf("create/transaction") !== -1 && this.props.userData.loggedIn) {
            return "createTransaction";
        } else if(url.indexOf("create") !== -1 && this.props.userData.isTeller) {
            // If the user went to create and the user had permission
            return "create";
        } else if (url.indexOf("users") !== -1 && this.props.userData.isTeller) {
            return "users";
        } else if (
            // We need to be a teller if
            (
                // if we are creating anything but a transaction
                url.indexOf("create") !== -1 && url.indexOf("transaction") === -1
            )
            // if we are viewing users.
            || url.indexOf("users") !== -1
            || !this.props.userData.loggedIn
        ) {
            // The user went to a url he didn't have permissions for.
            return "authenticate";
        }
    }

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
        } else if (current_location === "createAccount") {
            subSection = (
                <div className="create-account-section">
                    <CreateAccount
                        createAccount={this.props.createAccount}
                        users={this.props.users}
                        error={this.props.error}/>
                </div>
            );
        } else if (current_location === "users") {
            subSection = (
                <div className="users-section">
                    <Users users={this.props.users} userData={this.props.userData}/>
                </div>
            );
        } else if (current_location === "createTransaction") {
            subSection = (
                <div className="create-transaction-section">
                    <CreateTransaction
                        accounts={this.props.accounts}
                        userData={this.props.userData}
                        error={this.props.error}
                        createTransaction={this.props.createTransaction}
                    />
                </div>
            );
        } else {
            subSection = (
                <div className="accounts-section">
                    <Accounts
                        accounts={this.props.accounts}
                        userData={this.props.userData}/>
                </div>
            );
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
        );
    }

    componentDidMount() {
        // once the component mounts request the user's data from the server
        this.props.getUserData();
        this.props.getAccounts(this.props.userData.isTeller);
        if (this.props.userData.isTeller) {
            this.props.getUsers();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.userData.isTeller !== nextProps.userData.isTeller ||
            this.props.userData.loggedIn !== nextProps.userData.loggedIn
        ) {
            this.props.getAccounts(nextProps.userData.isTeller);
            if (nextProps.userData.isTeller) {
                this.props.getUsers();
            }
        }
    }
}

App.propTypes = {
    getUserData: React.PropTypes.func.isRequired,
    userData: React.PropTypes.object.isRequired,
    login: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
    error: React.PropTypes.string.isRequired,
    create: React.PropTypes.func.isRequired,
    getAccounts: React.PropTypes.func.isRequired,
    accounts: React.PropTypes.array.isRequired,
    createAccount: React.PropTypes.func.isRequired,
    getUsers: React.PropTypes.func.isRequired,
    users: React.PropTypes.array.isRequired,
    createTransaction: React.PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        userData: state.default.get("userData").toJS(),
        error: state.default.get("error"),
        accounts: state.default.get("accounts").toJS(),
        users: state.default.get("users").toJS(),
    };
}

export default connect(
    mapStateToProps,
    actionCreators
)(App);
