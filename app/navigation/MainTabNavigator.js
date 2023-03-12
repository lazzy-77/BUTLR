import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {AntDesign, Entypo, Feather, Ionicons} from '@expo/vector-icons';
import colors from '../configs/colors';
import JobsScreen from '../screens/JobsScreen'
import AccountScreen from '../screens/AccountScreen';
import SelectedJobsScreen from "../screens/SelectedJobsScreen";
import ConversationsScreen from "../screens/ConversationsScreen";
import CreatedJobsScreen from "../screens/CreatedJobsScreen";

const Tab = createBottomTabNavigator()

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.activeTintColor,
                tabBarInactiveTintColor: colors.inActiveTintColor,
                headerShown: false,
                tabBarStyle: {
                    borderTopWidth: 0,
                    paddingTop: 10,
                    paddingBottom: 10,
                    height: 60,
                },
            }}
        >
            <Tab.Screen name="Jobs" component={JobsScreen}
                        options={{
                            tabBarIcon: ({color, size}) => (
                                <Ionicons name="create" color={color} size={size}/>
                            )
                        }}
            />
            <Tab.Screen name="Selected" component={SelectedJobsScreen}
                        options={{
                            tabBarIcon: ({color, size}) => (
                                <AntDesign name="checkcircle" color={color} size={size}/>
                            )
                        }}
            />
            <Tab.Screen name="Created" component={CreatedJobsScreen}
                        options={{
                            tabBarIcon: ({color, size}) => (
                                <Entypo name="suitcase" size={size} color={color} />
                            )
                        }}
            />
            <Tab.Screen name="Messages" component={ConversationsScreen}
                        options={{
                            tabBarIcon: ({color, size}) => (
                                <Feather name="message-square" color={color} size={size}/>
                            ),
                        }}
            />
            <Tab.Screen name="Account" component={AccountScreen}
                        options={{
                            tabBarIcon: ({color, size}) => (
                                <Feather name="user" color={color} size={size}/>
                            )
                        }}
            />
        </Tab.Navigator>
    );
}


export default MainTabNavigator;
