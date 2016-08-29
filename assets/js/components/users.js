import React from "react";
import {Link} from "react-router";

export class Users extends React.Component{
    render() {
        return (
            <div
                style={{minWidth: 400, margin: "auto", textAlign: "center"}}
                className="half">
                <h1>Users:</h1>
                {
                    this.props.users.map((user) => {
                        let role = "Customer";
                        if (user.isManager) {
                            role = "Manager";
                        } else if (user.isTeller) {
                            role = "Teller";
                        }
                        return (
                            <article className="card user" key={user.id}>
                                <header>
                                    <h3>{user.username}:</h3>
                                    <h4>{role}</h4>
                                </header>
                                <footer>
                                <h6>Accounts</h6>
                                    <table className="primary" style={{margin: "auto"}}>
                                        <tbody>
                                        { user.accounts.map(function (account) {
                                            return (
                                                <tr key={account.id}>
                                                    <td>{account.name}</td>
                                                    <td>{account.balance}</td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </footer>
                            </article>
                        );
                    })
                }
            </div>
        );
    }
}

Users.propTypes = {
    users: React.PropTypes.array.isRequired,
    userData: React.PropTypes.object.isRequired,
};

export default Users;
