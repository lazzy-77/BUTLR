import React from 'react';
import { store } from "./app/redux/store";
import { Provider } from "react-redux";
import AppNavigator from './app/navigation/AppNavigator'
import { LogBox } from 'react-native';

// LogBox.ignoreAllLogs(); // Ignore log notification by message

export default function App() {
    return (
        <Provider store={store}>
            <AppNavigator />
        </Provider>
    );
}