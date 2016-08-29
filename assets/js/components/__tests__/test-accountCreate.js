jest.dontMock("../createAccount");

describe("CreateAccount", function() {
    let React;
    let TestUtils;
    let CreateAccount;
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
            CreateAccount = require("../createAccount").default;
            mockCreate = jest.genMockFunction();
            component = TestUtils.renderIntoDocument(
                <CreateAccount
                    error=""
                    createAccount={mockCreate}
                    users={[
                        {id: 1, username: "jack"}
                    ]}/>
            );
        });

        it("should render form", function() {
            expect(component).to.be.ok;
            let name = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "account-name"
            );
            let address = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "account-address"
            );
            let number = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "account-phone-number"
            );
            let balance = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "account-balance"
            );
            let user = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "account-user"
            );
            let button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "create-button"
            );
            expect(name).to.be.ok;
            expect(address).to.be.ok;
            expect(number).to.be.ok;
            expect(balance).to.be.ok;
            expect(user).to.be.ok;
            expect(button).to.be.ok;
        });

        it("should call create", function() {
            let button = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "create-button"
            );
            TestUtils.Simulate.click(button);
            expect(mockCreate.mock.calls.length).to.equal(1);
        });
    });
});
