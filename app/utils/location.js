import * as Location from 'expo-location';

export const requestPermission = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        alert('Permission to access location was denied, we need this for the app to work properly!');
    }
}

export const getUserLocation = async () => {
    return await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation
    })
}

