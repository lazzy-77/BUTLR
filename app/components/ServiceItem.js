import React from 'react';
import { View } from 'react-native';
import ServiceItemCard from "./ServiceItemCard";

const ServiceItem = ({ serviceData }) => {
    return (
        <View>
            {serviceData?.map((item, index) => (
                <ServiceItemCard key={index} item={item} />
            ))}
        </View>
    );
}

export default ServiceItem;
