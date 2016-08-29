jest.dontMock('../actionCreators');
import fetch from 'isomorphic-fetch';
import $ from 'jquery';

describe('User actions', function() {
    const chai = require('chai');
    const expect = chai.expect;

    describe('getUserData', function() {
        const {getUserData} = require('../actionCreators');

        it('should request data from fetch and send the response to the reducer', function() {
            fetch.mockClear();
            fetch.mockReturnValueOnce(
                new Promise((resolve, reject) => {resolve(
                    {json: {loggedIn: true}}
                )})
            );
            const dispatchFunction = getUserData();
            dispatchFunction();
            expect(fetch.mock.calls.length).to.equal(1);
            expect(fetch.mock.calls[0][0]).to.equal("/users/data/");
        });
    });

    describe('logout', function() {
        const {logout} = require('../actionCreators');

        it('should log user out', function() {
            fetch.mockClear();
            fetch.mockReturnValueOnce(
                new Promise((resolve, reject) => {resolve(
                    {json: {loggedIn: true}}
                )})
            );
            const dispatchFunction = logout();
            dispatchFunction();
            expect(fetch.mock.calls.length).to.equal(1);
            expect(fetch.mock.calls[0][0]).to.equal("/users/logout/");
        });
    });

    describe('login', function() {
        const {login} = require('../actionCreators');

        it('should log user in', function() {
            $.ajax.mockClear();
            $.ajax.mockReturnValueOnce(
                new Promise((resolve, reject) => {resolve(
                    {json: {loggedIn: true}}
                )})
            );
            const dispatchFunction = login();
            dispatchFunction();
            expect($.ajax.mock.calls.length).to.equal(1);
            expect($.ajax.mock.calls[0][0].url).to.equal("/users/login");
        });

        it('should handle log in error', function() {
            $.ajax.mockClear();
            $.ajax.mockReturnValueOnce(
                new Promise((resolve, reject) => {
                    throw Error;
                })
            );
            const dispatchFunction = login();
            dispatchFunction();
            expect($.ajax.mock.calls.length).to.equal(1);
            expect($.ajax.mock.calls[0][0].url).to.equal("/users/login");
        });
    });

    describe('create', function() {
        const {create} = require('../actionCreators');

        it('should create user in', function() {
            $.ajax.mockClear();
            $.ajax.mockReturnValueOnce(
                new Promise((resolve, reject) => {resolve(
                    {json: {loggedIn: true}}
                )})
            );
            const dispatchFunction = create();
            dispatchFunction();
            expect($.ajax.mock.calls.length).to.equal(1);
            expect($.ajax.mock.calls[0][0].url).to.equal("/users/create");
        });
    });

    describe('getAccounts', function() {
        const {getAccounts} = require('../actionCreators');

        it('should get index', function() {
            fetch.mockClear();
            fetch.mockReturnValueOnce(
                new Promise((resolve, reject) => {resolve(
                    {}
                )})
            );
            const dispatchFunction = getAccounts();
            dispatchFunction();
            expect(fetch.mock.calls.length).to.equal(1);
            expect(fetch.mock.calls[0][0]).to.equal("/accounts/");
        });

        it('should get manage', function() {
            fetch.mockClear();
            fetch.mockReturnValueOnce(
                new Promise((resolve, reject) => {resolve(
                    {}
                )})
            );
            const dispatchFunction = getAccounts(true);
            dispatchFunction();
            expect(fetch.mock.calls.length).to.equal(1);
            expect(fetch.mock.calls[0][0]).to.equal("/accounts/manage/");
        });
    });

    describe('getUsers', function() {
        const {getUsers} = require('../actionCreators');

        it('should get index', function() {
            fetch.mockClear();
            fetch.mockReturnValueOnce(
                new Promise((resolve, reject) => {resolve(
                    {}
                )})
            );
            const dispatchFunction = getUsers();
            dispatchFunction();
            expect(fetch.mock.calls.length).to.equal(1);
            expect(fetch.mock.calls[0][0]).to.equal("/users/index/");
        });

        it('should handle an error', function() {
            fetch.mockClear();
            fetch.mockReturnValueOnce(
                new Promise((resolve, reject) => {
                    throw Error;
                })
            );
            const dispatchFunction = getUsers();
            dispatchFunction();
        });
    });

    describe('createAccount', function() {
        const {createAccount} = require('../actionCreators');

        it('should create account', function() {
            $.ajax.mockClear();
            $.ajax.mockReturnValueOnce(
                new Promise((resolve, reject) => {resolve(
                    {json: {loggedIn: true}}
                )})
            );
            const dispatchFunction = createAccount();
            dispatchFunction();
            expect($.ajax.mock.calls.length).to.equal(1);
            expect($.ajax.mock.calls[0][0].url).to.equal("/accounts/");
        });
    });

     describe('createTransaction', function() {
        const {createTransaction} = require('../actionCreators');

        it('should create transaction', function() {
            $.ajax.mockClear();
            $.ajax.mockReturnValueOnce(
                new Promise((resolve, reject) => {resolve(
                    {json: {loggedIn: true}}
                )})
            );
            const dispatchFunction = createTransaction();
            dispatchFunction();
            expect($.ajax.mock.calls.length).to.equal(1);
            expect($.ajax.mock.calls[0][0].url).to.equal("/transactions/");
        });
    });
});
