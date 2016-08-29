import React from "react";
import {Link} from "react-router";

export class Account extends React.Component{

    render() {
        const account = this.props.account;

        return (
            <article style={{textAlign: "center"}} className="card account full" key={account.id}>
                <header>
                    <h3>{account.name}</h3>
                    <h4>Owner: {account.user.username}</h4>
                </header>
                <footer>
                    <div className="half" style={{margin: "auto"}}>
                        <h3>Balance: {account.balance}</h3>
                        <h3>Account Number: {account.id}</h3>
                        <h3>Address: {account.address}</h3>
                        <h3>Phone Number: {account.phoneNumber}</h3>
                    </div>

                    <table className="primary" style={{margin: "auto"}}>
                        <tr>
                            <th>Id</th>
                            <th>Transaction Type</th>
                            <th>Amount</th>
                            <th>From Account</th>
                            <th>To Account</th>
                        </tr>
                        <tbody>
                                {(account.transactions || []).map((transaction) => {
                                let withdrawal = transaction.accountFrom && transaction.accountFrom.id === account.id;
                                return (
                                    <tr className="transaction" key={transaction.id} style={ withdrawal ? {color: "red"} : {color: "blue"}}>
                                        <td>{transaction.id}</td>
                                        <td>{transaction.transactionType}</td>
                                        <td>{transaction.amount}</td>
                                        <td>{transaction.accountFrom && transaction.accountFrom.name}</td>
                                        <td>{transaction.accountTo && transaction.accountTo.name}</td>
                                    </tr>
                                );
                                })}
                        </tbody>
                    </table>
                </footer>
            </article>
        );
    };
};

Account.propTypes = {
    account: React.PropTypes.object.isRequired,
}

export default Account;

