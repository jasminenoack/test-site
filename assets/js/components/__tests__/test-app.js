jest.dontMock('../app');

describe('App', function() {
    let React;
    let TestUtils;
    let component;
    const chai = require('chai');
    const expect = chai.expect;
    let mockGetData, mockGetAccounts, mockGetUsers;
    const {shallow} = require('enzyme');

    beforeEach(function() {
        React = require('react');
        TestUtils = require('react-addons-test-utils');
    });

    describe('Initial Render', function() {
        beforeEach(function () {
            mockGetData = jest.genMockFunction();
            mockGetAccounts = jest.genMockFunction();
            mockGetUsers = jest.genMockFunction();

            const {App} = require('../app');
            component = TestUtils.renderIntoDocument(
                <App
                    getUserData={mockGetData}
                    userData={{}}
                    accounts={[]}
                    getUsers={mockGetUsers}
                    users={[]}
                    getAccounts={mockGetAccounts}
                    location={{pathname: "/"}}
                    error=""
                    create={() => {}}
                    createAccount={() => {}}
                    logout={() => {}}
                    login={() => {}}/>
            );
        });

        it('should render', function() {
            expect(component).to.be.ok;
        });

        it('should trigger the load actions', function() {
            expect(mockGetData.mock.calls.length).to.equal(1);
            expect(mockGetAccounts.mock.calls.length).to.equal(1);
            expect(mockGetUsers.mock.calls.length).to.equal(0);
        });


        it('should trigger the getAccounts if permissions change', function() {
            const {App} = require('../app');
            component = shallow(
                <App
                    getUserData={mockGetData}
                    userData={{}}
                    accounts={[]}
                    getUsers={mockGetUsers}
                    users={[]}
                    createAccount={() => {}}
                    getAccounts={mockGetAccounts}
                    location={{pathname: "/"}}
                    error=""
                    create={() => {}}
                    logout={() => {}}
                    login={() => {}}/>
            );
            let numberCalls = mockGetAccounts.mock.calls.length;
            component.setProps({userData: {isTeller: true}});
            expect(mockGetAccounts.mock.calls.length).to.equal(numberCalls + 1);
            expect(mockGetUsers.mock.calls.length).to.equal(1);
        });

        it('should render accounts section', function() {
            const {App} = require('../app');
            component = TestUtils.renderIntoDocument(
                <App
                    getUserData={mockGetData}
                    userData={{isTeller: true}}
                    error=""
                    getUsers={() => {}}
                    users={[]}
                    accounts={[]}
                    getAccounts={mockGetAccounts}
                    location={{pathname: "/"}}
                    createAccount={() => {}}
                    create={() => {}}
                    logout={() => {}}
                    login={() => {}}/>
            );
            let section = TestUtils.findRenderedDOMComponentWithClass(component, "accounts-section");
            expect(section).to.be.ok;
        });

        it('should render create accounts section', function() {
            const {App} = require('../app');
            component = TestUtils.renderIntoDocument(
                <App
                    getUserData={mockGetData}
                    userData={{isTeller: true}}
                    error=""
                    getUsers={() => {}}
                    users={[]}
                    accounts={[]}
                    getAccounts={mockGetAccounts}
                    location={{pathname: "create/account/"}}
                    create={() => {}}
                    createAccount={() => {}}
                    logout={() => {}}
                    login={() => {}}/>
            );
            let section = TestUtils.findRenderedDOMComponentWithClass(component, "create-account-section");
            expect(section).to.be.ok;
        });

        it('should render the create section if appropriate', function() {
            const {App} = require('../app');
            component = TestUtils.renderIntoDocument(
                <App
                    getUserData={mockGetData}
                    userData={{isTeller: true}}
                    error=""
                    getUsers={() => {}}
                    users={[]}
                    accounts={[]}
                    getAccounts={mockGetAccounts}
                    location={{pathname: "/create/"}}
                    create={() => {}}
                    createAccount={() => {}}
                    logout={() => {}}
                    login={() => {}}/>
            );
            let section = TestUtils.findRenderedDOMComponentWithClass(component, "create-section");
            expect(section).to.be.ok;
        });

        it('should render the users section if appropriate', function() {
            const {App} = require('../app');
            component = TestUtils.renderIntoDocument(
                <App
                    getUserData={mockGetData}
                    userData={{isTeller: true}}
                    error=""
                    getUsers={() => {}}
                    users={[]}
                    accounts={[]}
                    getAccounts={mockGetAccounts}
                    location={{pathname: "/view/users"}}
                    create={() => {}}
                    createAccount={() => {}}
                    logout={() => {}}
                    login={() => {}}/>
            );
            let section = TestUtils.findRenderedDOMComponentWithClass(component, "users-section");
            expect(section).to.be.ok;
        });

        it('should render the authenticate section if appropriate', function() {
            const {App} = require('../app');
            component = TestUtils.renderIntoDocument(
                <App
                    getUserData={mockGetData}
                    location={{pathname: "/create/"}}
                    userData={{isTeller: false}}
                    error=""
                    getUsers={() => {}}
                    users={[]}
                    accounts={[]}
                    createAccount={() => {}}
                    getAccounts={mockGetAccounts}
                    create={() => {}}
                    logout={() => {}}
                    login={() => {}}/>
            );
            let section = TestUtils.findRenderedDOMComponentWithClass(component, "authenticate-section");
            expect(section).to.be.ok;
        });
    });
});
