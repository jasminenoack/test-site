import chai, {expect} from "chai";
jest.dontMock("../utils");

const accounts =[
    {
        "balance": 324.33,
        "phoneNumber": "9176910399",
        "address": "670 1st ave",
        "user": {"id": 3, "username": "frederick"},
        "id": 4,
        "name": "Private Account"
    },
    {
        "balance": 324.33,
        "phoneNumber": "9176910399",
        "address": "670 1st ave",
        "user": {"id": 3, "username": "frederick"},
        "id": 14,
        "name": "Business"
    },
    {
        "balance": 324.33,
        "phoneNumber": "9176910399",
        "address": "670 1st ave",
        "user": {"id": 3, "username": "arno"},
        "id": 2,
        "name": "Public Account"
    },
    {
        "balance": 324.33,
        "phoneNumber": "9176910399",
        "address": "670 1st ave",
        "user": {"id": 3, "username": "jack"},
        "id": 1,
        "name": "Private Account"
    },
];

describe("Utils", () => {
    let React;
    let utils;

    beforeEach(() => {
        utils = require("../utils");
    });

    describe("Filters accounts", function () {
        it("by name", function () {
            expect(utils.matchAccounts("Private Account", accounts).length).to.equal(2);
        });

        it("by account number", function (){
            expect(utils.matchAccounts("2", accounts).length).to.equal(1);
        });

        it("by user", function () {
            expect(utils.matchAccounts("frederick", accounts).length).to.equal(2);
        });

        it("by ignores case", function () {
            expect(utils.matchAccounts("business", accounts).length).to.equal(1);
        });

        it("by finds a partial match name", function () {
            expect(utils.matchAccounts("ivat", accounts).length).to.equal(2);
        });

        it("by finds a partial match username", function () {
            expect(utils.matchAccounts("eder", accounts).length).to.equal(2);
        });

        it("by finds a partial match id", function () {
            expect(utils.matchAccounts("4", accounts).length).to.equal(2);
        });
    });
});
