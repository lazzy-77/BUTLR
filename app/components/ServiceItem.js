import React from 'react';
import { View } from 'react-native';
import ServiceItemCard from "./ServiceItemCard";
import { useNavigation } from '@react-navigation/core';

const ServiceItem = ({ serviceData, userLocation }) => {

    if (!serviceData) {
        return null;
    }

    const navigation = useNavigation()

    const handlePress = (item) => {
        navigation.navigate("DetailsScreen", {
            item: {...item},
            userLocation: {...userLocation}
        })
    }

    return (
        <View>
            {serviceData?.map((item, index) => (
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
