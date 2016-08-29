import React from "react";


class CreateAccount extends React.Component{
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
                        <h3>Create Account:</h3>
                    </header>
                    {
                        this.props.error &&
                            this.props.error.toLowerCase().indexOf("account") !== -1
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
                        <label> Name: <input
                            required
                            ref={(ref) => that.name = ref}
                            className="account-name"
                            placeholder="name"
                        /></label>
                        <label>Address: <input
                            required
                            ref={(ref) => that.address = ref}
                            className="account-address"
                            placeholder="address"
                        /></label>
                        <label>Phone Number: <input
                            required
                            ref={(ref) => that.number = ref}
                            className="account-phone-number"
                            placeholder="phone number"
                        /></label>
                        <label>Balance: <input
                            required
                            ref={(ref) => that.balance = ref}
                            className="account-balance"
                            placeholder="balance"
                        /></label>
                        <label>
                            User:
                            <select className="account-user" ref={(ref) => that.user = ref}>
                                {
                                    this.props.users.map((user) => {
                                        return <option key={user.id} value={user.id}>{user.username}</option>
                                    })
                                }
                            </select>
                        </label>
                    </div>
                    <a
                        className="button create-button"
                        href="#"
                        onClick={this.create}>
                            Create Account
                    </a>
                </article>
            </form>
        );
    };

    create() {
        const data = {
            name: this.name.value,
            balance: this.balance.value,
            address: this.address.value,
            phoneNumber: this.number.value,
            user: this.user.value,
        };
        this.props.createAccount(data);
        this.setState({status: `Creating Account: ${data.name}`})
    };
};

CreateAccount.propTypes = {
    createAccount: React.PropTypes.func.isRequired,
    error: React.PropTypes.string.isRequired,
    users: React.PropTypes.array.isRequired,
};

export default CreateAccount;
