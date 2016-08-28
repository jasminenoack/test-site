import React from "react";
import {Link} from "react-router";

export class Accounts extends React.Component{
    render() {
        return (
            <div
                style={{minWidth: 400, margin: "auto", textAlign: "center"}}
                className="half">
                {
                    this.props.userData.isTeller
                    ?
                        <Link to="/create/account" className="create-account pseudo button">
                            Create Account
                        </Link>
                    : null
                }
                {
                    this.props.accounts.map((account) => {
                        return (
                            <article className="card account" key={account.id}>
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
                                                <td>Address:</td>
                                                <td>{account.address}</td>
                                            </tr>
                                            <tr>
                                                <td>Phone Number:</td>
                                                <td>{account.phone_number}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </footer>
                            </article>
                        );
                    })
                }
            </div>
        )
    };
};

Accounts.propTypes = {
    accounts: React.PropTypes.array.isRequired,
    userData: React.PropTypes.object.isRequired,
}

export default Accounts;
