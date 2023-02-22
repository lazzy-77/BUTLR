import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsScreen from '../screens/DetailsScreen';
import SuccessScreen from '../screens/SuccessScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import MainTabNavigator from './MainTabNavigator';
import CreateJobScreen from "../screens/CreateJobScreen";

const Stack = createStackNavigator();

export default function HomeNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="JobsScreen" component={MainTabNavigator} />
            <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
            <Stack.Screen name="CreateJobScreen" component={CreateJobScreen} />
            <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
        </Stack.Navigator>
    )
}