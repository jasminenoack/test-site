jest.dontMock("../accounts");
jest.dontMock("../../utils");

describe("Accounts", function() {
    let React;
    let TestUtils;
    let Accounts;
    let component;
    const chai = require("chai");
    const expect = chai.expect;

    beforeEach(function() {
        React = require("react");
        TestUtils = require("react-addons-test-utils");
    });

    describe("Initial Render", function() {
        beforeEach(function () {
            Accounts = require("../accounts").default;
            component = TestUtils.renderIntoDocument(
                <Accounts
                    userData={{isTeller: false}}
                    accounts={[{"phoneNumber": "9", "balance": 30.0, "user": {"username": "jasminenoack", "id": 1}, "address": "12", "transactions": [{"accountFrom": {"name": null, "id": null}, "id": 1, "accountTo": {"name": "personal", "id": 1}, "transactionType": "deposit", "amount": 30.0}], "id": 1, "name": "personal"}]}
                />
            );
        });

        it("should render", function() {
            expect(component).to.be.ok;
            const accounts = TestUtils.scryRenderedDOMComponentsWithClass(
                component,
                "account"
            );
            expect(accounts.length).to.equal(1);
        });

        it("should render transactions", function() {
            expect(component).to.be.ok;
            const transactions = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "transaction"
            );
            expect(transactions).to.be.ok;
        });

        it("should not render create if not teller", function() {
            expect(component).to.be.ok;
            const accounts = TestUtils.scryRenderedDOMComponentsWithClass(
                component,
                "create-account"
            );
            expect(accounts.length).to.equal(0);
        });

        it("should render create transaction", function() {
            expect(component).to.be.ok;
            const button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "create-transaction"
            );
            expect(button).to.be.ok;
        });

        it("should render filter", function() {
            expect(component).to.be.ok;
            const input = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "filter-accounts"
            );
            expect(input).to.be.ok;
        });

        it("should render make button clickable on change", function() {
            expect(component).to.be.ok;
            let button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "filter-accounts-button"
            );
            expect(button.disabled).to.be.ok;
            const input = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "filter-accounts"
            );
            input.value = "change";
            TestUtils.Simulate.change(input);
            button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "filter-accounts-button"
            );
            expect(button.disabled).not.to.be.ok;
        });

        it("should call filter", function() {
            expect(component).to.be.ok;
            const input = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "filter-accounts"
            );
            input.value="change";
            TestUtils.Simulate.change(input);
            let button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "filter-accounts-button"
            );
            TestUtils.Simulate.click(button);
            let accounts = TestUtils.scryRenderedDOMComponentsWithClass(
                component,
                "account"
            );
            expect(accounts.length).to.equal(0);

            input.value="Jasmine";
            TestUtils.Simulate.change(input);
            button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "filter-accounts-button"
            );
            TestUtils.Simulate.click(button);
            accounts = TestUtils.scryRenderedDOMComponentsWithClass(
                component,
                "account"
            );
            expect(accounts.length).to.equal(1);
        });

        it("should render create if teller", function() {
            component = TestUtils.renderIntoDocument(
                <Accounts
                    userData={{isTeller: true}}
                    accounts={[
                        {
                            balance: "0.00",
                            address: "",
                            phone_number: "",
                            id: 1,
                            user: {
                                username: "jasminenoack",
                                id: 1
                            },
                            name: "personal"
                        },
                        {
                            balance: "0.00",
                            address: "",
                            phone_number: "",
                            id: 2,
                            user: {
                                username: "jasminenoack",
                                id: 1
                            },
                            name: "personal"
                        }
                    ]}/>
            );
            expect(component).to.be.ok;
            const accounts = TestUtils.scryRenderedDOMComponentsWithClass(
                component,
                "create-account"
            );
            expect(accounts.length).to.equal(1);
        });
    });
});
