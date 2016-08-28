import React from "react";


class Create extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            error: "",
        };
        this.create = this.create.bind(this);
    };

    render() {
        const that = this;
        return (
            <form className="half" style={{margin: "auto"}}>
                <article>
                    <header>
                        <h3>Create User</h3>
                    </header>
                    {
                        this.props.error &&
                            this.state.error ||
                            this.props.error.toLowerCase().indexOf("create") !== -1
                        ?
                            <span
                                style={{margin: 0}}
                                className="label error">
                                    {this.state.error || this.props.error}
                            </span>
                        : null
                    }
                    {
                        this.state.status
                        ?
                            <span
                                style={{margin: 0}}
                                className="label success">
                                    {this.state.status}
                            </span>
                        : null
                    }

                    <div className="full" style={{margin: "auto"}}>
                        <label>First Name: <input
                            required
                            ref={(ref) => that.firstName = ref}
                            className="create-first-name"
                            placeholder="first name"
                        /></label>
                        <label>Last Name: <input
                            required
                            ref={(ref) => that.lastName = ref}
                            className="create-last-name"
                            placeholder="last name"
                        /></label>
                        <label>Username: <input
                            required
                            ref={(ref) => that.username = ref}
                            className="create-username"
                            placeholder="username"
                        /></label>
                        <label>Email: <input
                            required
                            ref={(ref) => that.email = ref}
                            className="create-email"
                            placeholder="email"
                        /></label>
                        <label>Password: <input
                            required
                            ref={(ref) => that.password = ref}
                            type="password"
                            className="create-password"
                            placeholder="Password" />
                        </label>
                        <label>Repeat Password: <input
                            required
                            ref={(ref) => that.password2 = ref}
                            type="password"
                            className="create-password2"
                            placeholder="Password" />
                        </label>
                        {
                            this.props.userData.isManager
                            ?
                                <label>
                                    Role:
                                    <select className="role-select" ref={(ref) => that.role = ref}>
                                        <option>Customer</option>
                                        <option>Teller</option>
                                        <option>Manager</option>
                                    </select>
                                </label>
                            : null
                        }
                    </div>
                    <a
                        className="button create-button"
                        href="#"
                        onClick={this.create}>
                            Create
                    </a>
                </article>
            </form>
        );
    };

    verifyData(data) {
        return data.password === data.password2;
    };

    create() {
        const data = {
            firstName: this.firstName.value,
            lastName: this.lastName.value,
            username: this.username.value,
            password: this.password.value,
            password2: this.password2.value,
            email: this.email.value
        };
        if (this.role) {
            data.role = this.role.value;
        }
        if (this.verifyData(data)) {
            this.props.create(data);
            this.setState({status: `Creating user: ${data.username}`})
        } else {
            this.setState({error: "Passwords do not match"});
        };
    };
};

Create.propTypes = {
    create: React.PropTypes.func.isRequired,
    error: React.PropTypes.string.isRequired,
    userData: React.PropTypes.object.isRequired
};

export default Create;
