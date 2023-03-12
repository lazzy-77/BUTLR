import {Image, Text, TouchableOpacity, View} from "react-native";
import tailwind from "twrnc";
import React, {useEffect, useState} from "react";
import {functions, getDownloadURL, httpsCallable, ref, storage} from "../configs/firebase";
import {getDistance} from "geolib";
import {FontAwesome, Foundation, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import colors from "../configs/colors";
import {useNavigation} from "@react-navigation/core";

const CompletedJobCard = (props) => {
    const {createdAt, title, completedAt, completedBy} = props?.job;
    const [userName, setUserName] = useState("Name");
    const datetime = new Date(createdAt._seconds * 1000 + createdAt._nanoseconds / 1000000)
        .toLocaleDateString("en-UK", {day: 'numeric', month: 'long', year: 'numeric'});

    const getUserByUid = httpsCallable(functions, 'getUserByUid');

    useEffect(() => {
        getUserByUid({uid: completedBy}).then(r => {
            setUserName(r.data.displayName);
        }).catch(e => {
            console.log(e);
        })
    }, [])

    return (
        <TouchableOpacity onPress={() => props.onPress} style={tailwind`max-h-32 flex flex-row border-b border-gray-200 py-2`}>
            <View style={tailwind`w-full pr-2`}>
                <View style={tailwind`justify-start`}>
                    <Text style={tailwind`font-bold text-base`}>{title}</Text>
                </View>
                <View style={tailwind`rounded-md mt-1`}>
                    <View style={tailwind`flex flex-row justify-center`}>
                        <View style={tailwind`w-1/3 justify-center rounded-md`}>
                            <View style={tailwind`flex flex-row items-center`}>
                                <MaterialCommunityIcons name="calendar" size={12} color="black"/>
                                <Text style={tailwind`text-xs ml-1`}>Created</Text>
                            </View>
                            <Text style={tailwind`text-xs text-gray-700`}>{datetime}</Text>
                        </View>
                        <View style={tailwind`w-1/3 justify-center rounded-md`}>
                            <View style={tailwind`flex flex-row items-center`}>
                                <FontAwesome name="calendar-check-o" size={12} color="black" />
                                <Text style={tailwind`text-xs ml-1`}>Completed</Text>
                            </View>
                            <Text style={tailwind`text-xs text-gray-700`}>{completedAt}</Text>
                        </View>
                        <View style={tailwind`w-1/3 justify-center rounded-md`}>
                            <View style={tailwind`flex flex-row items-center`}>
                                <Ionicons name="person" size={12} color="black" />
                                <Text style={tailwind`text-xs ml-1`}>Completed By</Text>
                            </View>
                            <Text style={tailwind`text-xs text-gray-700`}>{userName}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default CompletedJobCard;