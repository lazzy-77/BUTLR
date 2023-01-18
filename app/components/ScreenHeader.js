import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import tailwind from 'tailwind-react-native-classnames';
import {MaterialCommunityIcons} from "@expo/vector-icons";

const ScreenHeader = ({activeTab, setActiveTab, screenName}) => {

    return (
        <View style={tailwind`w-full`}>
            <View style={tailwind`flex-row mt-3 justify-between`}>
                <Title style={tailwind`ml-1`}
                              text={screenName}
                              onPress={() => setActiveTab('Yelp')}/>
                <CreateButton style={tailwind`mr-1`}
                              text="BUTLRs"
                              onPress={() => setActiveTab('BUTLRs')}/>
            </View>
        </View>
    );
}

const Title = ({text}) => (
    <Text style={tailwind`ml-4 text-black text-2xl font-bold`}>{text}</Text>
)

const CreateButton = ({onPress}) => (
    <TouchableOpacity style={tailwind`mr-4`} onPress={onPress}>
        <MaterialCommunityIcons name="plus-circle" size={30} color="black" />
    </TouchableOpacity>
)

export default ScreenHeader;
