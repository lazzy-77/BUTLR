import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import tailwind from 'twrnc';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/core';

const ScreenHeader = ({screenName, headerButton = true}) => {

    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate("CreateJobScreen")
    }

    return (
        <View style={tailwind`w-full`}>
            <View style={tailwind`flex-row mt-3 justify-between`}>
                <Title style={tailwind`ml-1`} text={screenName}/>
                {headerButton && <CreateJobButton style={tailwind`mr-1`} onPress={handlePress}/>}
            </View>
        </View>
    );
}

const Title = ({text}) => (
    <Text style={tailwind`ml-4 text-black text-2xl font-bold`}>{text}</Text>
)

const CreateJobButton = ({onPress}) => (
    <TouchableOpacity style={tailwind`mr-4`} onPress={onPress}>
        <MaterialCommunityIcons name="plus-circle" size={30} color="black" />
    </TouchableOpacity>
)

export default ScreenHeader;
