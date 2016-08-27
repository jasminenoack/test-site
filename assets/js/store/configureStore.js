import * as reducers from "../reducer";
import {createStore, applyMiddleware, combineReducers, compose} from "redux";
import thunkMiddleware from "redux-thunk";
import { routerReducer } from "react-router-redux";

const finalCreateStore = compose(
    applyMiddleware(
        thunkMiddleware
    ),
    window.devToolsExtension && environmentName !== "Production" ? window.devToolsExtension() : f => f
)(createStore);

const store = finalCreateStore(combineReducers({
    ...reducers,
    routing: routerReducer
}));

export default store;
