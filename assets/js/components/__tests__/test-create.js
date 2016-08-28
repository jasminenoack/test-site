jest.dontMock('../create');

describe('Create', function() {
    let React;
    let TestUtils;
    let component;
    const chai = require('chai');
    const expect = chai.expect;
    let Create;

    beforeEach(function() {
        React = require('react');
        TestUtils = require('react-addons-test-utils');
        Create = require('../create').default;
    });

    it('should show form', function() {
        const mockLogin = jest.genMockFunction();
        component = TestUtils.renderIntoDocument(
            <Create create={() => {}} error="" userData={{isManager: true}}/>
        );

        let username = TestUtils.findRenderedDOMComponentWithClass(
            component,
            "create-username"
        );
        let password = TestUtils.findRenderedDOMComponentWithClass(
            component,
            "create-password"
        );
        let password2 = TestUtils.findRenderedDOMComponentWithClass(
            component,
            "create-password2"
        );
        let firstName = TestUtils.findRenderedDOMComponentWithClass(
            component,
            "create-first-name"
        );
        let lastName = TestUtils.findRenderedDOMComponentWithClass(
            component,
            "create-last-name"
        );
        let email = TestUtils.findRenderedDOMComponentWithClass(
            component,
            "create-email"
        );
        let createButton = TestUtils.findRenderedDOMComponentWithClass(
            component,
            "create-button"
        );
        let role = TestUtils.findRenderedDOMComponentWithClass(
            component,
            "role-select"
        );

        expect(email).to.be.ok;
        expect(username).to.be.ok;
        expect(password).to.be.ok;
        expect(createButton).to.be.ok;
        expect(password2).to.be.ok;
        expect(firstName).to.be.ok;
        expect(lastName).to.be.ok;
        expect(role).to.be.ok;
    });

    it('tellers should not see role', function() {
        const mockLogin = jest.genMockFunction();
        component = TestUtils.renderIntoDocument(
            <Create create={() => {}} error="" userData={{isManager: false}}/>
        );

        let role = TestUtils.scryRenderedDOMComponentsWithClass(
            component,
            "role-select"
        );

        expect(role.length).not.to.be.ok;
    });

    it('should create', function() {
        const mockCreate = jest.genMockFunction();
        component = TestUtils.renderIntoDocument(
            <Create create={mockCreate} error="" userData={{}}/>
        );

        let createButton = TestUtils.findRenderedDOMComponentWithClass(
            component,
            "create-button"
        );
        TestUtils.Simulate.click(createButton);
        expect(mockCreate.mock.calls.length).to.equal(1);
    });

    it('should not create if passwords do not match', function() {
        const mockCreate = jest.genMockFunction();
        component = TestUtils.renderIntoDocument(
            <Create create={mockCreate} error="" userData={{}}/>
        );
        component.verifyData = jest.genMockFunction().mockReturnValueOnce(false);

        let createButton = TestUtils.findRenderedDOMComponentWithClass(
            component,
            "create-button"
        );
        TestUtils.Simulate.click(createButton);
        expect(mockCreate.mock.calls.length).to.equal(0);
    });
});
