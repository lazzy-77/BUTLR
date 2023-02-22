import React from 'react';
import { View } from 'react-native';
import ServiceItemCard from "./ServiceItemCard";
import { useNavigation } from '@react-navigation/core';
import {getDistance} from "geolib";

const ServiceItem = ({ serviceData, userLocation }) => {

    if (!serviceData) {
        return null;
    }

    const navigation = useNavigation()

    const userLocationCoords = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude
    }

    const sortedServiceDataByDistance = serviceData.sort((a, b) => {
        const pointA = {
            latitude: a.location[0],
            longitude: a.location[1]
        }

        const pointB = {
            latitude: b.location[0],
            longitude: b.location[1]
        }

        const distanceA = getDistance(userLocationCoords, pointA);
        const distanceB = getDistance(userLocationCoords, pointB);

        return distanceA - distanceB;
    })

    const handlePress = (item) => {
        navigation.navigate("DetailsScreen", {
            item: {...item},
            userLocation: {...userLocation}
        })
    }

    return (
        <View>
            {sortedServiceDataByDistance?.map((item, index) => (
                <ServiceItemCard
                    key={index}
                    item={item}
                    userLocation={userLocation}
                    onPress={() => handlePress(item)}
                />
            ))}
        </View>
    );
}

export default ServiceItem;
