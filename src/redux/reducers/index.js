// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Import your auth reducer here

const rootReducer = combineReducers({
    auth: authReducer,
    // Add other reducers here as needed
});

export default rootReducer;
