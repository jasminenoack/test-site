jest.dontMock("../users");

describe("Users", function() {
    let React;
    let TestUtils;
    let Users;
    let component;
    const chai = require("chai");
    const expect = chai.expect;

    beforeEach(function() {
        React = require("react");
        TestUtils = require("react-addons-test-utils");
    });

    describe("Initial Render", function() {
        beforeEach(function () {
            Users = require("../users").default;
            component = TestUtils.renderIntoDocument(
                <Users
                    userData={{isTeller: false}}
                    users={[
                        {"username": "mazmine", "firstName": "Jasmine", "id": 5, "accounts": [], "isTeller": true, "isManager": false, "lastName": "Noack"},
                        {"username": "username", "firstName": "frank", "id": 4, "accounts": [], "isTeller": true, "isManager": true, "lastName": "sam"}
                    ]}/>
            );
        });

        it("should render", function() {
            expect(component).to.be.ok;
            const users = TestUtils.scryRenderedDOMComponentsWithClass(
                component,
                "user"
            );
            expect(users.length).to.equal(2);
        });
    });
});
