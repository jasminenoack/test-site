jest.dontMock('../authenticate');

describe('Authenticate', function() {
    let React;
    let TestUtils;
    let component;
    let Authenticate;
    const chai = require('chai');
    const expect = chai.expect;

    beforeEach(function() {
        React = require('react');
        TestUtils = require('react-addons-test-utils');
        Authenticate = require('../authenticate').default;
        component = TestUtils.renderIntoDocument(
            <Authenticate/>
        );
    });

    it("should render", () => {
        expect(component).to.be.ok;
    });
});
