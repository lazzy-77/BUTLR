import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser, selectUser } from '../redux/slices/authSlice';
import AuthNavigator from './AuthNavigator';
import { auth } from '../configs/firebase';
import HomeNavigator from './HomeNavigator';
import { LogBox } from 'react-native';
import { Location, Permissions } from 'expo';
LogBox.ignoreLogs(['new NativeEventEmitter']);

export default function AppNavigator() {
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    // const [userLocation, setUserLocation] = useState(null);

    //TODO Revisit after apple app build on expo
    useEffect(() => {
        const unlisten = auth.onAuthStateChanged(async authUser => {
            if (authUser) {

                // const permission = await Permissions.askAsync(Permissions.LOCATION);
                // if (permission.status === 'granted') {
                //     const location = await Location.getCurrentPositionAsync({});
                //     setUserLocation(location);
                // }

                const user = {
                    name: authUser.displayName,
                    image: authUser.photoURL,
                    email: authUser.email,
                    uid: authUser.uid,
                    // location: userLocation,
                }
                dispatch(loginUser(user))
            } else {
                dispatch(logoutUser())
            }
        })
        return () => {
            unlisten();
        }
    }, [])

    return (
        <NavigationContainer>
            {user ? (
                <HomeNavigator />
            ) : (
                <AuthNavigator />
            )}
        </NavigationContainer>
    )


}