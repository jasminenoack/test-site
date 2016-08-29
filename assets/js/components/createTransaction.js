import React from "react";


class CreateTransaction extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            error: "",
        };
        this.create = this.create.bind(this);
    }

    render() {
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
                        <label> Account From:
                            <select className="transaction-account-from" ref={(ref) => that.accountFrom = ref}>
                                <option value="">Account From</option>
                                {
                                    this.props.accounts.map((account) => {
                                        return (
                                            <option key={account.id} value={account.id}>
                                                id-{account.id} ::: name-{account.name} ::: balance-{account.balance}
                                            </option>
                                        );
                                    })
                                }
                            </select>
                        </label>
                        <label> Account To:
                            <select className="transaction-account-to" ref={(ref) => that.accountTo = ref}>
                                <option value="">Account To</option>
                                {
                                    this.props.accounts.map((account) => {
                                        return <option key={account.id} value={account.id}>
                                            id-{account.id} ::: name-{account.name} ::: balance-{account.balance}
                                        </option>;
                                    })
                                }
                            </select>
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

    create() {
        const data = {
            amount: this.amount.value,
            accountFrom: this.accountFrom.value ? this.accountFrom.value : null,
            accountTo: this.accountTo.value ? this.accountTo.value : null,
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
