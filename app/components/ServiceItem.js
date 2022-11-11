import React from 'react';
import { View } from 'react-native';
import ServiceItemCard from "./ServiceItemCard";
import { useNavigation } from '@react-navigation/core';

const ServiceItem = ({ serviceData }) => {
    const navigation = useNavigation()

    const handlePress = (item) => {
        navigation.navigate("DetailsScreen", {
            item: {...item}
        })
    }

    return (
        <View>
            {serviceData?.map((item, index) => (
                <ServiceItemCard key={index} item={item} onPress={() => handlePress(item)} />
            ))}
        </View>
    );
}

export default ServiceItem;
