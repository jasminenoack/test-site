jest.dontMock('../app');

describe('App', function() {
    let React;
    let TestUtils;
    let component;
    const chai = require('chai');
    const expect = chai.expect;
    let mockGetData;

    beforeEach(function() {
        React = require('react');
        TestUtils = require('react-addons-test-utils');
    });

    describe('Initial Render', function() {
        beforeEach(function () {
            mockGetData = jest.genMockFunction();
            const {App} = require('../app');
            component = TestUtils.renderIntoDocument(
                <App
                    getUserData={mockGetData}
                    userData={{}}
                    location={{pathname: "/"}}
                    error=""
                    create={() => {}}
                    logout={() => {}}
                    login={() => {}}/>
            );
        });

        it('should render', function() {
            expect(component).to.be.ok;
        });

        it('should trigger the getUserData action', function() {
            expect(mockGetData.mock.calls.length).to.equal(1);
        });

        it('should render the create section if appropriate', function() {
            const {App} = require('../app');
            component = TestUtils.renderIntoDocument(
                <App
                    getUserData={mockGetData}
                    userData={{isTeller: true}}
                    error=""
                    location={{pathname: "/create/"}}
                    create={() => {}}
                    logout={() => {}}
                    login={() => {}}/>
            );
            let section = TestUtils.findRenderedDOMComponentWithClass(component, "create-section");
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
                    create={() => {}}
                    logout={() => {}}
                    login={() => {}}/>
            );
            let section = TestUtils.findRenderedDOMComponentWithClass(component, "authenticate-section");
            expect(section).to.be.ok;
        });
    });
});
