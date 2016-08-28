import fetch from 'isomorphic-fetch';
import {ACTIONS} from './actionConstants';
import cookie from "react-cookie";
import $ from 'jquery';

const fetchOptions = {
    credentials: 'same-origin',
    headers: {
        'X-CSRF-Token': cookie.load("csrftoken"),
        'Content-Type': 'application/json'
    },
}

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

const postUser = (dispatch, endpoint, data, error) => {
    // We are using ajax because cookies are not consistent
    // in the fetch polyfills.
    $.ajax({
        type:"POST",
        url: endpoint,
        data: JSON.stringify(data),
        success: function(response){
            return dispatch(getUserData())
        },
        error: () => {
            dispatch({
                type: ACTIONS.ERROR,
                data: error
            });
        }
    });
}

export const login = (data) => {
    return dispatch => {
        postUser(
            dispatch,
            '/users/login',
            data,
            "Login failed please try again"
        );
    };
};

export const create = (data) => {
    return dispatch => {
        postUser(
            dispatch,
            '/users/create',
            data,
            "Create failed please try again"
        );
    };
};
