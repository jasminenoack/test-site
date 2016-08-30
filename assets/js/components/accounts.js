import React from "react";
import {Link} from "react-router";
import {matchAccounts} from "../utils";

export class Accounts extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            filteredAccounts: this.props.accounts || [],
            changed: false,
            filter: ""
        };
        this.filterAccounts = this.filterAccounts.bind(this);
    }

    filterAccounts() {
        this.setState({
            filteredAccounts: matchAccounts(
                this.filter.value,
                this.props.accounts
            ),
            filter: this.filter.value
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.accounts) {
            this.setState({
                filteredAccounts: matchAccounts(
                    this.state.filter,
                    nextProps.accounts
                ),
            });
        }
    }

    render() {
        const that = this;
        return (
            <div
                style={{minWidth: 400, margin: "auto", textAlign: "center"}}
                className="half">
                <h1>{this.props.userData.isTeller ? "All" : "Your"} Accounts(Total {this.state.filteredAccounts.length}):</h1>
                {
                    this.props.userData.isTeller
                    ?
                        <Link to="/create/account" className="create-account pseudo button">
                            Create Account
                        </Link>
                    : null
                }
                <Link to="/create/transaction" className="create-transaction pseudo button">
                    Create Transaction
                </Link>

                <div style={{position: "relative"}}>
                    <input
                        ref={(ref) => this.filter = ref}
                        onChange={() => {that.setState({changed: true});}}
                        className="c-field c-field--success filter-accounts"
                        type="text"
                        style={{width: "calc(100% - 150px)"}}
                        placeholder="Account Name, Account #, Username"
                    />
                    <button
                        style={{float: "right", position: "absolute", top: 0, right: 0, margin: 0}}
                        disabled={!this.state.changed}
                        className="c-button--secondary filter-accounts-button"
                        onClick={this.filterAccounts}
                    >
                        Filter Accounts
                    </button>
                </div>

                {
                    this.state.filteredAccounts.map((account) => {
                        return (
                            <Link to={`/view/accounts/${account.id}`} key={account.id}>
                                <article className="card account">
                                    <header>
                                        <h3>{account.name}</h3>
                                        <h4>Owner: {account.user.username}</h4>
                                    </header>
                                    <footer>
                                        <table className="primary" style={{margin: "auto"}}>
                                            <tbody>
                                                <tr>
                                                    <td>Balance:</td>
                                                    <td>{account.balance}</td>
                                                </tr>
                                                <tr>
                                                    <td>Account Number:</td>
                                                    <td>{account.id}</td>
                                                </tr>
                                                <tr>
                                                    <td>Transactions:</td>
                                                    <td>{(account.transactions || []).map((transaction) => {
                                                        let withdrawal = transaction.accountFrom && transaction.accountFrom.id === account.id;
                                                        return (
                                                            <h6 className="transaction" key={transaction.id} style={ withdrawal ? {color: "red"} : {color: "blue"}}>
                                                                {transaction.transactionType}:{transaction.amount}
                                                            </h6>
                                                        );
                                                    })}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </footer>
                                </article>
                            </Link>
                        );
                    })
                }
            </div>
        );
    }
}

Accounts.propTypes = {
    accounts: React.PropTypes.array.isRequired,
    userData: React.PropTypes.object.isRequired,
};

export default Accounts;
