import React from "react";
import {Link} from "react-router";


class NavBar extends React.Component{
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
    }

    render() {
        const that = this;
        return (
            <div>
                <nav>
                    <Link to="/" className="brand">{this.props.userData.username}</Link>
                    <div>
                        {
                            this.props.userData.loggedIn
                            ?
                            <Link to="/" className="pseudo button">Accounts</Link>
                            : null
                        }
                        {
                            this.props.userData.isTeller
                            ?
                                <Link
                                    to="/view/users/"
                                    className="pseudo button users">
                                        Users
                                </Link>
                            : null
                        }
                        {
                            this.props.userData.isTeller
                            ?
                                <Link
                                    to="/create/"
                                    className="pseudo button create">
                                        Create User
                                </Link>
                            : null
                        }
                        {
                            this.props.userData.loggedIn
                            ?
                                <label
                                    href="#"
                                    className="pseudo button logout"
                                    onClick={this.props.logout}>
                                        Sign Out
                                </label>
                            :
                                <label
                                    href="#"
                                    className="pseudo button login"
                                    htmlFor="modal_1">
                                        Sign In
                                </label>
                        }
                    </div>
                </nav>
                {
                    !this.props.userData.loggedIn
                    ?
                        <form className="modal">
                            <input id="modal_1" type="checkbox" />
                            <label htmlFor="modal_1" className="overlay"></label>
                            <article>
                                <header>
                                    <h3>Sign In</h3>
                                    <label htmlFor="modal_1" className="close">&times;</label>
                                </header>
                                {
                                    this.props.error &&
                                        this.props.error.toLowerCase().indexOf("login") !== -1
                                    ?
                                        <span
                                            style={{margin: 0}}
                                            className="label error">
                                                {this.props.error}
                                        </span>
                                    : null
                                }
                                <div className="half" style={{margin: "auto"}}>
                                    <label>Username: <input
                                        ref={(ref) => that.username = ref}
                                        className="username"
                                        placeholder="Username"
                                        required
                                    /></label>
                                    <label>Password: <input
                                        ref={(ref) => that.password = ref}
                                        type="password"
                                        required
                                        className="password"
                                        placeholder="Password" />
                                    </label>
                                </div>
                                <footer>
                                    <a
                                        className="button login-button"
                                        href="#"
                                        onClick={this.signIn}>
                                            Login
                                        </a>
                                    <label htmlFor="modal_1" className="button dangerous">
                                        Cancel
                                    </label>
                                </footer>
                            </article>
                        </form>
                    : null
                }
            </div>
        );
    }

    signIn() {
        const data = {
            username: this.username.value,
            password: this.password.value,
        };
        this.props.login(data);
    }
}

NavBar.propTypes = {
    userData: React.PropTypes.object.isRequired,
    login: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
    error: React.PropTypes.string.isRequired,
};

export default NavBar;
