import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import RequestsScreen from '../screens/RequestsScreen'

export default function MainNavigator() {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Requests" component={RequestsScreen} />
        </Stack.Navigator>
    )
}