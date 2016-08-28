jest.dontMock('../navBar');

describe('navBar', function() {
    let React;
    let TestUtils;
    let component;
    const chai = require('chai');
    const expect = chai.expect;
    let NavBar

    beforeEach(function() {
        React = require('react');
        TestUtils = require('react-addons-test-utils');
    });

    describe('Initial Render', function() {
        beforeEach(function () {
            NavBar = require('../navBar').default;
        });

        it('should render', function() {
            component = TestUtils.renderIntoDocument(
                <NavBar
                    userData={{loggedIn: false}}
                    logout={() => {}}
                    login={() => {}}
                    error=""/>
            );
            expect(component).to.be.ok;
        });

        it('should renders a login button if no user', function() {
            component = TestUtils.renderIntoDocument(
                <NavBar
                    userData={{loggedIn: false}}
                    logout={() => {}}
                    login={() => {}}
                    error=""/>
            );
            let button = TestUtils.findRenderedDOMComponentWithClass(component, "login");
            expect(button).to.be.ok;
            let hiddenButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "logout");
            expect(hiddenButton.length).not.to.be.ok;
        });

        it('should renders a logout button if user signed in', function() {
            component = TestUtils.renderIntoDocument(
                <NavBar
                    userData={{loggedIn: true}}
                    logout={() => {}}
                    login={() => {}}
                    error=""/>
            );
            let button = TestUtils.findRenderedDOMComponentWithClass(component, "logout");
            expect(button).to.be.ok;
            let hiddenButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "login");
            expect(hiddenButton.length).not.to.be.ok;
        });

        it('should render create user for tellers', function() {
            component = TestUtils.renderIntoDocument(
                <NavBar
                    userData={{loggedIn: true, isTeller: true}}
                    logout={() => {}}
                    login={() => {}}
                    error=""/>
            );
            let button = TestUtils.findRenderedDOMComponentWithClass(component, "create");
            expect(button).to.be.ok;
        });

        it('should not render create user for base accounts', function() {
            component = TestUtils.renderIntoDocument(
                <NavBar
                    userData={{loggedIn: true, isTeller: false}}
                    logout={() => {}}
                    login={() => {}}
                    error=""/>
            );
            let hiddenButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "create");
            expect(hiddenButton.length).not.to.be.ok;
        });
    });

    describe('Events', function() {
        beforeEach(function () {
            NavBar = require('../navBar').default;
        });

        it('should logout', function() {
            const mockLogout = jest.genMockFunction();
            component = TestUtils.renderIntoDocument(
                <NavBar
                    userData={{loggedIn: true}}
                    login={() => {}}
                    logout={mockLogout}
                    error=""
                />
            );
            let button = TestUtils.findRenderedDOMComponentWithClass(component, "logout");
            TestUtils.Simulate.click(button);
            expect(mockLogout.mock.calls.length).to.equal(1);
        });

        it('should show login modal', function() {
            const mockLogin = jest.genMockFunction();
            component = TestUtils.renderIntoDocument(
                <NavBar
                    userData={{loggedIn: false}}
                    login={mockLogin}
                    logout={() => {}}
                    error=""
                />
            );
            let button = TestUtils.findRenderedDOMComponentWithClass(component, "login");
            TestUtils.Simulate.click(button);

            let username = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "username"
            );
            let password = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "password"
            );
            let loginButton = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "login-button"
            );

            expect(username).to.be.ok;
            expect(password).to.be.ok;
            expect(loginButton).to.be.ok;
        });

        it('should login', function() {
            const mockLogin = jest.genMockFunction();
            component = TestUtils.renderIntoDocument(
                <NavBar
                    userData={{loggedIn: false}}
                    login={mockLogin}
                    logout={() => {}}
                    error=""
                />
            );
            let button = TestUtils.findRenderedDOMComponentWithClass(component, "login");
            TestUtils.Simulate.click(button);

            let loginButton = TestUtils.findRenderedDOMComponentWithClass(
                component,
                "login-button"
            );
            TestUtils.Simulate.click(loginButton);
            expect(mockLogin.mock.calls.length).to.equal(1);
        });

        it('should show login error', function() {
            const mockLogin = jest.genMockFunction();
            component = TestUtils.renderIntoDocument(
                <NavBar
                    userData={{loggedIn: false}}
                    login={mockLogin}
                    logout={() => {}}
                    error="Login failed please try again"
                />
            );
            let error = TestUtils.findRenderedDOMComponentWithClass(component, "error");
            expect(error).to.be.ok;
        });
    });
});
