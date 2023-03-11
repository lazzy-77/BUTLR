import {Image, Text, TouchableOpacity, View} from "react-native";
import tailwind from "twrnc";
import React, {useEffect, useState} from "react";
import {functions, getDownloadURL, httpsCallable, ref, storage} from "../configs/firebase";
import {getDistance} from "geolib";
import {Foundation, MaterialCommunityIcons} from "@expo/vector-icons";
import colors from "../configs/colors";
import {useNavigation} from "@react-navigation/core";

const PendingJobCard = (props) => {
    const {categoryDisplayName, createdBy, createdAt, duration, id, location, pay, title} = props?.job;
    const [user, setUser] = useState(null);
    const {latitude, longitude} = props?.location;
    const [userName, setUserName] = useState("Name");
    const [profilePic, setProfilePic] = useState(null);
    const datetime = new Date(createdAt._seconds * 1000 + createdAt._nanoseconds / 1000000)
        .toLocaleDateString("en-UK", {day: 'numeric', month: 'long', year: 'numeric'});

    const getUserByUid = httpsCallable(functions, 'getUserByUid');
    const jobLocation = {latitude: location[0], longitude: location[1]};
    const userLocation = {latitude: latitude, longitude: longitude};
    const distance = getDistance(jobLocation, userLocation);
    const navigation = useNavigation();

    const getProfilePic = async () => {
        const fileRef = ref(storage, 'users/' + user.uid + '/profilePic');
        const url = getDownloadURL(fileRef);
        await url.then(r => {
            if (url["_z"] !== undefined) {
                setProfilePic({uri: url["_z"]});
            }
        }).catch(e => {
            console.log(e);
        })
    }

    const getDisplayDistance = (distance) => {
        if (distance < 1000) {
            return `${distance}m`
        } else {
            return `${(distance / 1000).toFixed(0)}km`
        }
    }

    const handlePress = (item) => {
        navigation.navigate("PendingJobDetailsScreen", {
            item: {...item},
            userLocation: {...userLocation},
            refreshServiceData: refreshServiceData
        })
    }

    useEffect(() => {
        getUserByUid({uid: createdBy}).then(r => {
            setUser(r.data);
            setUserName(r.data.displayName);
        })
    }, [])

    useEffect(() => {
        getProfilePic().then(r => {
            //profilePic is set
        }).catch(e => {
            console.log(e);
        });
    }, [user])

    return (
        <TouchableOpacity onPress={props.onPress} style={tailwind`max-h-32 flex flex-row border-b border-gray-200 py-2`}>
            <View style={tailwind`w-5/6 pr-2`}>
                <View style={tailwind`h-1/3 justify-start`}>
                    <Text style={tailwind`font-bold text-base`}>{title}</Text>
                    <Text style={tailwind`font-semibold text-sm text-gray-700`}>{categoryDisplayName}</Text>
                </View>
                <View style={tailwind`rounded-md h-2/3 mt-2`}>
                    <View style={tailwind`flex flex-row justify-center`}>
                        <View style={tailwind`w-1/2 justify-center rounded-md`}>
                            <View style={tailwind`flex flex-row items-center`}>
                                <MaterialCommunityIcons name="calendar" size={12} color="black"/>
                                <Text style={tailwind`text-xs ml-1`}>Created</Text>
                            </View>
                            <Text style={tailwind`text-xs text-gray-700`}>{datetime}</Text>
                        </View>
                        <View style={tailwind`w-1/2 justify-center rounded-md`}>
                            <View style={tailwind`flex flex-row items-center`}>
                                <MaterialCommunityIcons name="compass" size={12} color={colors.slate}/>
                                <Text style={tailwind`text-xs ml-1`}>Distance</Text>
                            </View>
                            <Text style={tailwind`text-xs text-gray-700`}>{getDisplayDistance(distance)}</Text>
                        </View>
                    </View>
                    <View style={tailwind`flex flex-row`}>
                        <View style={tailwind`w-1/2 justify-center rounded-md`}>
                            <View style={tailwind`flex flex-row items-center`}>
                                <MaterialCommunityIcons name="clock-time-four" size={12} color="#06c167"/>
                                <Text style={tailwind`text-xs ml-1`}>Duration</Text>
                            </View>
                            <Text style={tailwind`text-xs text-gray-700`}>{duration}</Text>
                        </View>
                        <View style={tailwind`w-1/2 justify-center rounded-md`}>
                            <View style={tailwind`flex flex-row items-center`}>
                                <Foundation name="dollar" size={16} color={colors.primary}/>
                                <Text style={tailwind`text-xs ml-1`}>Pay</Text>
                            </View>
                            <Text style={tailwind`text-xs text-gray-700`}>{pay}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={tailwind`w-1/6 justify-start items-center mt-2`}>
                <Image source={profilePic} style={tailwind`w-8 h-8 rounded-full`}/>
                <Text style={tailwind`font-semibold text-xs mt-0.5`}>{userName}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default PendingJobCard;