jest.dontMock('../account');

describe('Account', function() {
    let React;
    let TestUtils;
    let Account;
    let component;
    const chai = require('chai');
    const expect = chai.expect;

    beforeEach(function() {
        React = require('react');
        TestUtils = require('react-addons-test-utils');
    });

    describe('Initial Render', function() {
        beforeEach(function () {
            Account = require('../account').default;
            component = TestUtils.renderIntoDocument(
                <Account
                    userData={{isTeller: false}}
                    account={{"phoneNumber": "9", "balance": 30.0, "user": {"username": "jasminenoack", "id": 1}, "address": "12", "transactions": [{"accountFrom": {"name": null, "id": null}, "id": 1, "accountTo": {"name": "personal", "id": 1}, "transactionType": "deposit", "amount": 30.0}], "id": 1, "name": "personal"}}
                />
            );
        });

        it('should render', function() {
            expect(component).to.be.ok;
            const accounts = TestUtils.scryRenderedDOMComponentsWithClass(
                component,
                "account"
            );
            expect(accounts.length).to.equal(1);
        });

        it('should render transactions', function() {
            expect(component).to.be.ok;
            const transactions = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "transaction"
            );
            expect(transactions).to.be.ok;
        });
    });
});
