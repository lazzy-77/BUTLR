import {Image, Text, TouchableOpacity, View} from "react-native";
import tailwind from "twrnc";
import React, {useEffect, useState} from "react";
import {functions, getDownloadURL, httpsCallable, ref, storage} from "../configs/firebase";
import {FontAwesome, Foundation, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import colors from "../configs/colors";

const OpenJobCard = (props) => {
    const {title, duration, pay, requestedBy, id} = props?.job;

    return (
        <TouchableOpacity onPress={props.onPress} style={tailwind`max-h-32 flex flex-row border-b border-gray-200 py-2`}>
            <View style={tailwind`w-full pr-2`}>
                <View style={tailwind`justify-start`}>
                    <Text style={tailwind`font-bold text-base`}>{title}</Text>
                </View>
                <View style={tailwind`rounded-md mt-1`}>
                    <View style={tailwind`flex flex-row justify-center`}>
                        <View style={tailwind`w-1/3 justify-center rounded-md`}>
                            <View style={tailwind`flex flex-row items-center`}>
                                <MaterialCommunityIcons name="clock-time-four" size={12} color="#06c167"/>
                                <Text style={tailwind`text-xs ml-1`}>Duration</Text>
                            </View>
                            <Text style={tailwind`text-xs text-gray-700`}>{duration}</Text>
                        </View>
                        <View style={tailwind`w-1/3 justify-center rounded-md`}>
                            <View style={tailwind`flex flex-row items-center`}>
                                <Foundation name="dollar" size={16} color={colors.primary}/>
                                <Text style={tailwind`text-xs ml-1`}>Pay</Text>
                            </View>
                            <Text style={tailwind`text-xs text-gray-700`}>{pay}</Text>
                        </View>
                        <View style={tailwind`w-1/3 justify-center rounded-md`}>
                            <View style={tailwind`flex flex-row items-center`}>
                                <Ionicons name="person" size={12} color="#0284C7" />
                                <Text style={tailwind`text-xs ml-1`}>Requests</Text>
                            </View>
                            <Text style={tailwind`text-xs text-gray-700`}>{requestedBy.length}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default OpenJobCard;