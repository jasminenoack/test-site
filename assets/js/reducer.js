import Immutable from "immutable";
import {ACTIONS} from "./actions/actionConstants";

const initialState = Immutable.fromJS({
    userData: {loggedIn: false},
    error: "",
    accounts: [],
    users: []
});

const setUserData = (state, data) => {
    return state.set("userData", Immutable.fromJS(data));
};

const setError = (state, error) => {
    return state.set("error", error);
};

const setAccounts = (state, accounts) => {
    return state.set("accounts", Immutable.fromJS(accounts));
};

const setUsers = (state, users) => {
    return state.set("users", Immutable.fromJS(users));
};

export default (state = initialState, action) => {
    // Reset the error message if the user has moved on
    state = setError(state, "");
    switch(action.type) {
    case ACTIONS.GET_USER_DATA:
        return setUserData(state, action.data);
    case ACTIONS.ERROR:
        return setError(state, action.data);
    case ACTIONS.GET_ACCOUNTS:
        return setAccounts(state, action.data);
    case ACTIONS.GET_USERS:
        return setUsers(state, action.data);
    }
    return state;
};
