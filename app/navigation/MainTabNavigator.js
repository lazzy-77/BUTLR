import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {Feather, Ionicons} from '@expo/vector-icons';
import colors from '../configs/colors';
import RequestsScreen from '../screens/RequestsScreen'
import TabCartButton from '../components/TabCartButton'
import CartScreen from '../screens/CartScreen';
import AccountScreen from '../screens/AccountScreen';

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
            <Tab.Screen name="Requests" component={RequestsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="create" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen name="Cart" component={CartScreen}
                options={({ navigation }) => ({
                    tabBarButton: () => <TabCartButton onPress={() => navigation.navigate('Cart')} />
                })}
            />
            <Tab.Screen name="Account" component={AccountScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" color={color} size={size} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}


export default MainTabNavigator;
