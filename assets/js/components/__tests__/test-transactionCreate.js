jest.dontMock('../createTransaction');

describe('CreateTransaction', function() {
    let React;
    let TestUtils;
    let CreateTransaction;
    let mockCreate;
    let component;
    const chai = require('chai');
    const expect = chai.expect;

    beforeEach(function() {
        React = require('react');
        TestUtils = require('react-addons-test-utils');
    });

    describe('Initial Render', function() {
        beforeEach(function () {
            CreateTransaction = require('../createTransaction').default;
            mockCreate = jest.genMockFunction();
            component = TestUtils.renderIntoDocument(
                <CreateTransaction
                    error=""
                    createTransaction={mockCreate}
                    accounts={[{name: "test", id: 1, user: {username: "fred"}}]}
                    userData={{isTeller: true}}/>
            );
        });

        it('should render form', function() {
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
            expect(typeOptions.length).to.equal(3);
        });

        it('should render less type options for customers', function() {
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
            expect(typeOptions.length).to.equal(1);
        });

        it('should call create', function() {
            let button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "create-button"
            );
            TestUtils.Simulate.click(button);
            expect(mockCreate.mock.calls.length).to.equal(1);
        });
    });
});
