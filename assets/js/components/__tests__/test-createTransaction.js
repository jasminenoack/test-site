jest.dontMock("../createTransaction");
jest.dontMock("classnames")

describe("CreateTransaction", function() {
    let React;
    let TestUtils;
    let CreateTransaction;
    let mockCreate;
    let component;
    const chai = require("chai");
    const expect = chai.expect;

    beforeEach(function() {
        React = require("react");
        TestUtils = require("react-addons-test-utils");
    });

    describe("Initial Render", function() {
        beforeEach(function () {
            CreateTransaction = require("../createTransaction").default;
            mockCreate = jest.genMockFunction();
            component = TestUtils.renderIntoDocument(
                <CreateTransaction
                    error=""
                    createTransaction={mockCreate}
                    accounts={[{name: "test", id: 1, user: {username: "fred"}}]}
                    userData={{isTeller: true}}/>
            );
        });

        it("should render form", function() {
            expect(component).to.be.ok;
            let amount = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "transaction-amount"
            );
            let type = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "transaction-type"
            );
            let accountTo = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "transaction-account-to"
            );
            let accountFrom = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "transaction-account-from"
            );
            let typeOptions = TestUtils.scryRenderedDOMComponentsWithClass(
                component,
                "transaction-type-option"
            );
            let button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "create-button"
            );
            expect(amount).to.be.ok;
            expect(type).to.be.ok;
            expect(accountTo).to.be.ok;
            expect(accountFrom).to.be.ok;
            expect(button).to.be.ok;
            expect(typeOptions).to.have.lengthOf(3);
        });

        it("should render less type options for customers", function() {
            component = TestUtils.renderIntoDocument(
                <CreateTransaction
                    error=""
                    userData
                    createTransaction={mockCreate}
                    accounts={[]}
                    userData={{isTeller: false}}/>
            );
            let typeOptions = TestUtils.scryRenderedDOMComponentsWithClass(
                component,
                "transaction-type-option"
            );
            expect(typeOptions).to.have.lengthOf(1);
        });
    });

    describe("create", function () {
        beforeEach(function () {
            mockCreate = jest.genMockFunction();
            component = TestUtils.renderIntoDocument(
                <CreateTransaction
                    error=""
                    userData
                    createTransaction={mockCreate}
                    accounts={[
                        {id: 11, name: "test1", user: {username: "fred"}},
                        {id: 12, name: "test1", user: {username: "fred"}},
                        {id: 13, name: "test1", user: {username: "fred"}},
                        {id: 14, name: "test1", user: {username: "fred"}},
                    ]}
                    userData={{isTeller: false}}/>
            );
        });

        it("should call create", function() {
            let button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "create-button"
            );
            TestUtils.Simulate.click(button);
            expect(mockCreate.mock.calls).to.have.lengthOf(1);
        });

        it("should handle null accounts", function() {
            let accountFromOptions = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "account-from-option"
            );
            expect(accountFromOptions).to.have.lengthOf(5);

            let button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "create-button"
            );
            TestUtils.Simulate.click(button);
            expect(mockCreate.mock.calls).to.have.lengthOf(1);
            expect(mockCreate.mock.calls[0][0].amount).to.equal("");
            expect(mockCreate.mock.calls[0][0].accountFrom).to.equal(null);
            expect(mockCreate.mock.calls[0][0].accountTo).to.equal(null);
            expect(mockCreate.mock.calls[0][0].transactionType).to.equal("transfer");
        });

        it("should put from account in create", function() {
            let accountFromOptions = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "account-from-option"
            );
            expect(accountFromOptions).to.have.lengthOf(5);
            TestUtils.Simulate.click(accountFromOptions[3]);

            let button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "create-button"
            );
            TestUtils.Simulate.click(button);
            expect(mockCreate.mock.calls).to.have.lengthOf(1);
            expect(mockCreate.mock.calls[0][0].amount).to.equal("");
            expect(mockCreate.mock.calls[0][0].accountFrom).to.equal(13);
            expect(mockCreate.mock.calls[0][0].accountTo).to.equal(null);
            expect(mockCreate.mock.calls[0][0].transactionType).to.equal("transfer");
        });

        it("should put to account in create", function() {
            let accountFromOptions = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "account-to-option"
            );
            expect(accountFromOptions).to.have.lengthOf(5);
            TestUtils.Simulate.click(accountFromOptions[4]);

            let button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "create-button"
            );
            TestUtils.Simulate.click(button);
            expect(mockCreate.mock.calls).to.have.lengthOf(1);
            expect(mockCreate.mock.calls[0][0].amount).to.equal("");
            expect(mockCreate.mock.calls[0][0].accountFrom).to.equal(null);
            expect(mockCreate.mock.calls[0][0].accountTo).to.equal(14);
            expect(mockCreate.mock.calls[0][0].transactionType).to.equal("transfer");
        });
    });

    describe("account select", function () {
        beforeEach(function () {
            component = TestUtils.renderIntoDocument(
                <CreateTransaction
                    error=""
                    userData
                    createTransaction={mockCreate}
                    accounts={[
                        {id: 1, name: "test1", user: {username: "fred"}},
                        {id: 2, name: "test1", user: {username: "fred"}},
                        {id: 3, name: "test1", user: {username: "fred"}},
                        {id: 4, name: "test1", user: {username: "fred"}},
                    ]}
                    userData={{isTeller: false}}/>
            );
        });

        it("should select the from account on click", () => {
            let selectedOption = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "c-menu__item--active"
            );
            expect(selectedOption[0].value).not.to.be.ok;
            expect(selectedOption[1].value).not.to.be.ok;

            let accountFromOptions = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "account-from-option"
            );
            expect(accountFromOptions).to.have.lengthOf(5);
            TestUtils.Simulate.click(accountFromOptions[1]);
            selectedOption = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "c-menu__item--active"
            );
            expect(selectedOption[0].value).to.equal(1);
            expect(selectedOption[1].value).not.to.be.ok;

            accountFromOptions = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "account-from-option"
            );
            expect(accountFromOptions).to.have.lengthOf(5);
            TestUtils.Simulate.click(accountFromOptions[3]);
            selectedOption = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "c-menu__item--active"
            );
            expect(selectedOption[0].value).to.equal(3);
            expect(selectedOption[1].value).not.to.be.ok;

            accountFromOptions = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "account-from-option"
            );
            expect(accountFromOptions).to.have.lengthOf(5);
            TestUtils.Simulate.click(accountFromOptions[0]);
            selectedOption = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "c-menu__item--active"
            );
            expect(selectedOption[0].value).not.to.be.ok;
            expect(selectedOption[1].value).not.to.be.ok;
        });

        it("should select the to account on click", () => {
            let selectedOption = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "c-menu__item--active"
            );
            expect(selectedOption[0].value).not.to.be.ok;
            expect(selectedOption[1].value).not.to.be.ok;

            let accountFromOptions = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "account-to-option"
            );
            expect(accountFromOptions).to.have.lengthOf(5);
            TestUtils.Simulate.click(accountFromOptions[1]);
            selectedOption = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "c-menu__item--active"
            );
            expect(selectedOption[1].value).to.equal(1);
            expect(selectedOption[0].value).not.to.be.ok;

            accountFromOptions = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "account-to-option"
            );
            expect(accountFromOptions).to.have.lengthOf(5);
            TestUtils.Simulate.click(accountFromOptions[3]);
            selectedOption = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "c-menu__item--active"
            );
            expect(selectedOption[1].value).to.equal(3);
            expect(selectedOption[0].value).not.to.be.ok;

            accountFromOptions = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "account-to-option"
            );
            expect(accountFromOptions).to.have.lengthOf(5);
            TestUtils.Simulate.click(accountFromOptions[0]);
            selectedOption = TestUtils.scryRenderedDOMComponentsWithClass(
                component, "c-menu__item--active"
            );
            expect(selectedOption[1].value).not.to.be.ok;
            expect(selectedOption[0].value).not.to.be.ok;
        });
    });
});
