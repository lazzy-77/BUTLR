import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsScreen from '../screens/DetailsScreen';
import SuccessScreen from '../screens/SuccessScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import MainTabNavigator from './MainTabNavigator';
import CreateJobScreen from "../screens/CreateJobScreen";
import SelectedJobsScreen from "../screens/SelectedJobsScreen";
import PendingJobDetailsScreen from "../screens/PendingJobDetailsScreen";
import ConversationsScreen from "../screens/ConversationsScreen";
import MessageScreen from "../screens/MessageScreen";
import CreatedJobsScreen from "../screens/CreatedJobsScreen";
import CompletedJobDetailsScreen from "../screens/CompletedJobDetailsScreen";
import OpenJobDetailsScreen from "../screens/OpenJobDetailsScreen";

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
            <Stack.Screen name="SelectedJobsScreen" component={SelectedJobsScreen} />
            <Stack.Screen name="PendingJobDetailsScreen" component={PendingJobDetailsScreen} />
            <Stack.Screen name="ConversationsScreen" component={ConversationsScreen} />
            <Stack.Screen name="CreatedJobsScreen" component={CreatedJobsScreen} />
            <Stack.Screen name="CompletedJobDetailsScreen" component={CompletedJobDetailsScreen} />
            <Stack.Screen name="OpenJobDetailsScreen" component={OpenJobDetailsScreen} />
            <Stack.Screen name="MessageScreen" component={MessageScreen} />
        </Stack.Navigator>
    )
}