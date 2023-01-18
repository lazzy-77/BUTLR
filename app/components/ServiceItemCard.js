import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'tailwind-react-native-classnames';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const ServiceItemCard = ({ item, onPress }) => {

    return (
        <TouchableOpacity style={tailwind`mx-4 mb-4 max-h-60`} onPress={onPress}>
            <View style={tailwind`flex flex-row`}>
                <Image
                    source={{ uri: item.image_url ? item.image_url : null}}
                    style={tailwind`w-1/2 h-48 rounded-lg`}
                />
                <View style={tailwind`w-1/2 ml-1`}>
                    <View style={tailwind`bg-gray-50 rounded-md h-7 max-h-7`}>
                        <Text style={tailwind`text-gray-700 text-base font-bold ml-1 mr-1`}>{item.categories}</Text>
                    </View>
                    <View style={tailwind`bg-gray-50 rounded-md mt-1 h-40 max-h-40`}>
                        <Text style={tailwind`text-gray-700 text-sm m-1`}>{item.description}</Text>
                    </View>
                </View>
            </View>
            <View style={tailwind`flex-row items-center mt-1`}>
                <View style={tailwind`flex-grow`}>
                    <Text style={tailwind`font-bold text-lg`} numberOfLines={1}>{item.name}</Text>
                    <View style={tailwind`flex-row items-center`}>
                        <MaterialCommunityIcons name="clock-time-four" size={13} color="#06C167" />
                        <Text style={tailwind`text-xs text-gray-700`}> 20-30 • min • {item.price}</Text>
                    </View>
                </View>
                <View style={tailwind`w-8 h-8 justify-center items-center bg-gray-100 rounded-full`}>
                    <Text style={tailwind`text-gray-600 text-xs`}>{item.rating}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ServiceItemCard;