import React from "react";
import classNames from 'classnames';


class CreateTransaction extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            accountFrom: null,
            accountTo: null
        };
        this.create = this.create.bind(this);
        this.setAccountFrom = this.setAccountFrom.bind(this);
        this.setAccountTo = this.setAccountTo.bind(this);
    }

    render() {
        const menuData = {fontSize: 12};
        const that = this;
        return (
            <form className="half" style={{margin: "auto"}}>
                <article>
                    <header>
                        <h3>Create Transaction:</h3>
                    </header>
                    {
                        this.props.error && this.props.error.toLowerCase().indexOf("transaction") !== -1
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
                        <label> Type:
                            <select className="transaction-type" ref={(ref) => that.type = ref}>
                                <option className="transaction-type-option" value="transfer">Transfer</option>
                                {
                                    this.props.userData.isTeller
                                    ?
                                        <option className="transaction-type-option" value="withdrawal">Withdrawal</option>
                                    : null
                                }
                                {
                                    this.props.userData.isTeller
                                    ?
                                        <option className="transaction-type-option" value="deposit">Deposit</option>
                                    : null
                                }
                            </select>
                        </label>
                        <label className="transaction-account-from">
                            Account From:
                            <ul className="c-menu c-menu--high">
                                <li
                                    className={classNames(
                                        "c-menu__item",
                                        "account-from-option",
                                        { "c-menu__item--active": !this.state.accountFrom}
                                    )}
                                    onClick={this.setAccountFrom}>
                                    <div style={menuData}>Select None</div>
                                </li>
                                {
                                    this.props.accounts.map((account) => {
                                        return (
                                            <li
                                                className={classNames(
                                                    "c-menu__item",
                                                    "account-from-option",
                                                    { "c-menu__item--active": this.state.accountFrom === account.id }
                                                )}
                                                key={account.id}
                                                value={account.id}
                                                onClick={this.setAccountFrom}>
                                                <div style={menuData}>Account Number: {account.id}</div>
                                                <div style={menuData}>Name: {account.name}</div>
                                                <div style={menuData}>Balance: ${account.balance}</div>
                                                <div style={menuData}>Owner: {account.user.username}</div>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </label>
                        <label className="transaction-account-to">
                            Account To:
                            <ul className="c-menu c-menu--high">
                                <li
                                    className={classNames(
                                        "c-menu__item",
                                        "account-to-option",
                                        { "c-menu__item--active": !this.state.accountTo}
                                    )}
                                    onClick={this.setAccountTo}>
                                    <div style={menuData}>Select None</div>
                                </li>
                                {
                                    this.props.accounts.map((account) => {
                                        return (
                                            <li
                                                className={classNames(
                                                    "c-menu__item",
                                                    "account-to-option",
                                                    { "c-menu__item--active": this.state.accountTo === account.id }
                                                )}
                                                key={account.id}
                                                value={account.id}
                                                onClick={this.setAccountTo}>
                                                <div style={menuData}>Account Number: {account.id}</div>
                                                <div style={menuData}>Name: {account.name}</div>
                                                <div style={menuData}>Balance: ${account.balance}</div>
                                                <div style={menuData}>Owner: {account.user.username}</div>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </label>
                        <label>Amount: <input
                            required
                            ref={(ref) => that.amount = ref}
                            className="transaction-amount"
                            placeholder="amount"
                        /></label>
                    </div>
                    <a
                        className="button create-button"
                        href="#"
                        onClick={this.create}>
                            Create Transaction
                    </a>
                </article>
            </form>
        );
    }

    setAccountFrom(event) {
        this.setState({accountFrom: event.currentTarget.value});
    }

    setAccountTo(event) {
        this.setState({accountTo: event.currentTarget.value});
    }

    create() {
        const data = {
            amount: this.amount.value,
            accountFrom: this.state.accountFrom ? this.state.accountFrom : null,
            accountTo: this.state.accountTo ? this.state.accountTo : null,
            transactionType: this.type.value,
        };
        this.props.createTransaction(data);
        this.setState({status: "Creating Transaction"});
    }
}

CreateTransaction.propTypes = {
    createTransaction: React.PropTypes.func.isRequired,
    error: React.PropTypes.string.isRequired,
    accounts: React.PropTypes.array.isRequired,
    userData: React.PropTypes.object.isRequired,
};

export default CreateTransaction;
