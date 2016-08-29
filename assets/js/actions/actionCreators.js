import fetch from "isomorphic-fetch";
import {ACTIONS} from "./actionConstants";
import cookie from "react-cookie";
import $ from "jquery";
import { browserHistory } from "react-router";

const fetchOptions = {
    credentials: "same-origin",
    headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookie.load("csrftoken")
    },
};

export const getUserData = () => {
    return dispatch => {
        fetch("/users/data/", fetchOptions).then(
            response => response.json()
        ).then(
            json => dispatch({type: ACTIONS.GET_USER_DATA, data: json})
        );
    };
};

export const logout = () => {
    return dispatch => {
        fetch("/users/logout/", fetchOptions).then(
            response => response.json()
        ).then(
            json => dispatch(getUserData())
        );
    };
};

const postData = (dispatch, endpoint, data, error, callback) => {
    // We are using ajax because cookies are not consistent
    // in the fetch polyfills.
    $.ajax({
        type:"POST",
        url: endpoint,
        data: JSON.stringify(data),
        headers: {"X-CSRFToken": cookie.load("csrftoken")},
        success: function(response){
            dispatch(getUserData());
            if (callback) {
                return callback();
            }
        },
        error: () => {
            dispatch({
                type: ACTIONS.ERROR,
                data: error
            });
        }
    });
};

export const login = (data) => {
    return dispatch => {
        postData(
            dispatch,
            "/users/login",
            data,
            "Login failed please try again"
        );
    };
};

export const create = (data) => {
    return dispatch => {
        postData(
            dispatch,
            "/users/create",
            data,
            "Create failed please try again",
            () => {
                dispatch(getUsers());
                browserHistory.push("/view/users/");
            }
        );
    };
};

export const getAccounts = (manage) => {
    let url;
    if (manage) {
        url = "/accounts/manage/";
    } else {
        url = "/accounts/";
    }
    return dispatch => {
        fetch(url, fetchOptions).then(
            response => response.json()
        ).then(
            json => dispatch({type: ACTIONS.GET_ACCOUNTS, data: json})
        );
    };
};

export const getUsers = () => {
    let url = "/users/index/";
    return (dispatch, getState) => {
        fetch(url, fetchOptions).then(
            response => response.json()
        ).then(
            json => dispatch({type: ACTIONS.GET_USERS, data: json})
        ).catch(
            err => dispatch({type: ACTIONS.GET_USERS, data: []})
        );
    };
};

export const createAccount = (data) => {
    return (dispatch, getState) => {
        postData(
            dispatch,
            "/accounts/",
            data,
            "Create account failed",
            () => {
                dispatch(
                    getAccounts(
                        getState().default.getIn(["userData", "isTeller"])
                    )
                );
                browserHistory.push("/");
            }
        );
    };
};

export const createTransaction = (data) => {
    return (dispatch, getState) => {
        postData(
            dispatch,
            "/transactions/",
            data,
            "Create transaction failed",
            () => {
                dispatch(
                    getAccounts(
                        getState().default.getIn(["userData", "isTeller"])
                    )
                );
                browserHistory.push("/");
            }
        );
    };
};
