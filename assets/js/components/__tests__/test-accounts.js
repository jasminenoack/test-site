jest.dontMock('../accounts');

describe('Accounts', function() {
    let React;
    let TestUtils;
    let Accounts;
    let component;
    const chai = require('chai');
    const expect = chai.expect;

    beforeEach(function() {
        React = require('react');
        TestUtils = require('react-addons-test-utils');
    });

    describe('Initial Render', function() {
        beforeEach(function () {
            Accounts = require('../accounts').default;
            component = TestUtils.renderIntoDocument(
                <Accounts
                    userData={{isTeller: false}}
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
        });

        it('should render', function() {
            expect(component).to.be.ok;
            const accounts = TestUtils.scryRenderedDOMComponentsWithClass(
                component,
                "account"
            );
            expect(accounts.length).to.equal(2);
        });

        it('should not render create if not teller', function() {
            expect(component).to.be.ok;
            const accounts = TestUtils.scryRenderedDOMComponentsWithClass(
                component,
                "create-account"
            );
            expect(accounts.length).to.equal(0);
        });

        it('should render create if teller', function() {
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
