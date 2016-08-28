import * as reducers from "../reducer";
import {createStore, applyMiddleware, combineReducers, compose} from "redux";
import thunk from 'redux-thunk';
import { routerReducer } from "react-router-redux";

const store = createStore(
    combineReducers(
        {...reducers, routing: routerReducer},
    ),
    applyMiddleware(thunk)
);

export default store;
