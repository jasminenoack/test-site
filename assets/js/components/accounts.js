import React from "react";
import {Link} from "react-router";

export class Accounts extends React.Component{
    render() {
        return (
            <div
                style={{minWidth: 400, margin: "auto", textAlign: "center"}}
                className="half">
                <h1>{this.props.userData.isTeller ? "All" : "Your"} Accounts:</h1>
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
                {
                    this.props.accounts.map((account) => {
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
