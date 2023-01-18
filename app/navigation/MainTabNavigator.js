import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Feather } from '@expo/vector-icons';
import colors from '../configs/colors';
import RequestsScreen from '../screens/RequestsScreen'
import TabCartButton from '../components/TabCartButton'
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import BrowseScreen from '../screens/BrowseScreen';
import CartScreen from '../screens/CartScreen';
import GroceryScreen from '../screens/GroceryScreen';
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
                        <AntDesign name="form" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen name="Cart" component={CartScreen}
                options={({ navigation }) => ({
                    tabBarButton: () => <TabCartButton onPress={() => navigation.navigate('Cart')} />
                })}
            />
            {/*TODO*/}
            {/*<Tab.Screen name="Grocery" component={GroceryScreen}*/}
            {/*    options={{*/}
            {/*        tabBarIcon: ({ color, size }) => (*/}
            {/*            <Feather name="shopping-bag" color={color} size={size} />*/}
            {/*        )*/}
            {/*    }}*/}
            {/*/>*/}
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
