import { browserHistory } from 'react-router';
import { syncHistory } from 'react-router-redux';
import * as reducers from '../reducer';
import Immutable from 'immutable';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = Immutable.fromJS({
    location: {}
});

const routeReducerImmutable = (state = initialState, action) => {
    if (action.type === LOCATION_CHANGE) {
        return state.merge({
            location: action.payload
        });
    };

    return state;
};

const history = syncHistory(browserHistory, store, {
    selectLocationState(state) {
        return state.getIn([
            'route',
            'location'
        ]).toJS();
    }
});

const finalCreateStore = compose(
    applyMiddleware(
        history,
        thunkMiddleware
    ),
    window.devToolsExtension && environmentName !== 'Production' ? window.devToolsExtension() : f => f
)(createStore);

const store = finalCreateStore(combineReducers({
    ...reducers,
    routing: routeReducerImmutable
}));

export default store;
