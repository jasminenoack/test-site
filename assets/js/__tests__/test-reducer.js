import Immutable from 'immutable';
import chai, {expect} from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);
jest.dontMock('../reducer');
jest.dontMock('../actions/actionConstants');

describe('Reducer', () => {
    let React;
    let reducer;
    let ACTIONS;

    beforeEach(() => {
        React = require('react');
        reducer = require('../reducer').default;
        ACTIONS = require('../actions/actionConstants').ACTIONS;
    });


    it('handles GET_USER_DATA', () => {
        const state = Immutable.Map();
        const data = {loggedIn: true};
        const newState = reducer(state, {
            type: ACTIONS.GET_USER_DATA,
            data: data
        });
        const expectedState = Immutable.fromJS({
            userData: data,
            error: "",
        });
        expect(newState).to.equal(expectedState);
    });

    it('handles GET_ACCOUNTS', () => {
        const state = Immutable.Map();
        const data = [{id: 1}];
        const newState = reducer(state, {
            type: ACTIONS.GET_ACCOUNTS,
            data: data
        });
        const expectedState = Immutable.fromJS({
            accounts: data,
            error: "",
        });
        expect(newState).to.equal(expectedState);
    });

    it('handles GET_USERS', () => {
        const state = Immutable.Map();
        const data = [{id: 1}];
        const newState = reducer(state, {
            type: ACTIONS.GET_USERS,
            data: data
        });
        const expectedState = Immutable.fromJS({
            users: data,
            error: "",
        });
        expect(newState).to.equal(expectedState);
    });

    it('handles ERROR', () => {
        const state = Immutable.Map();
        const data = "error";
        const newState = reducer(state, {
            type: ACTIONS.ERROR,
            data: data
        });
        const expectedState = Immutable.fromJS({
            error: data
        });
        expect(newState).to.equal(expectedState);
    });
});
