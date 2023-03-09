import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';

const HeaderTabs = ({ activeTab, setActiveTab }) => {

    return (
        <View style={tailwind`flex-row justify-center mt-3`}>
            <HeaderButton text="Yelp" active={activeTab === "Yelp"} onPress={() => setActiveTab('Yelp')} />
            <HeaderButton text="BUTLRs" active={activeTab === "BUTLRs"} onPress={() => setActiveTab('BUTLRs')} />
        </View>
    );
}

const HeaderButton = ({ text, onPress, active }) => (
    <TouchableOpacity style={tailwind`bg-white px-7 py-2 rounded-full ${active && 'bg-black'}`} onPress={onPress}>
        <Text style={tailwind`text-black font-bold ${active && 'text-white'}`}>{text}</Text>
    </TouchableOpacity>
)

export default HeaderTabs;
