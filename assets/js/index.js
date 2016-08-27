import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';

import store from './store/configureStore';


ReactDOM.render(
    <Provider store={store}>
        <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
            <Route path={'/'} component={<div>Hello</div>} />
    	</Router>
  	</Provider>,
  document.getElementById('outer_container')
);
