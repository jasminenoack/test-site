import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { Router, Route, browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer } from "react-router-redux";
import App from "./components/app";
import store from "./store/configureStore";

const history = syncHistoryWithStore(browserHistory, store);


ReactDOM.render(
    <Provider store={store}>
        <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
            <Route path="/" component={App}/>
            <Route path="create/" component={App}/>
            <Route path="create/account" component={App}/>
            <Route path="view/users" component={App}/>
            <Route path="create/transaction" component={App}/>
    	</Router>
  	</Provider>,
  document.getElementById("outer_container")
);
