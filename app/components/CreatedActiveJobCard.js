import {Image, Text, TouchableOpacity, View} from "react-native";
import tailwind from "twrnc";
import React, {useEffect, useState} from "react";
import {functions, getDownloadURL, httpsCallable, ref, storage} from "../configs/firebase";
import {Entypo, FontAwesome, Foundation, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import colors from "../configs/colors";

const CreatedActiveJobCard = (props) => {
    const {title, duration, pay, id, jobStatus, jobAcceptedBy} = props?.job;
    const [userName, setUserName] = useState("Name");
    const [profilePic, setProfilePic] = useState(null);

    const getStatusColor = () => {
        switch (jobStatus) {
            case "Active":
                return "#06c167";
            case "Pending Confirmation":
                return "#7e22ce";
        }
    }

    const getUserByUid = httpsCallable(functions, 'getUserByUid');

    const getProfilePic = async () => {
        const fileRef = ref(storage, 'users/' + jobAcceptedBy + '/profilePic');
        const url = getDownloadURL(fileRef);
        await url.then(r => {
            if (url["_z"] !== undefined) {
                setProfilePic({uri: url["_z"]});
            }
        }).catch(e => {
            console.log(e);
        })
    }

    useEffect(() => {
        getUserByUid({uid: jobAcceptedBy}).then(r => {
            setUserName(r.data.displayName);
        }).catch(e => {
            console.log(e);
        })

        getProfilePic().then(r => {
            //profilePic is set
        }).catch(e => {
            console.log(e);
        });
    }, [])


    return (
        <TouchableOpacity onPress={props.onPress}
                          style={tailwind`max-h-32 flex flex-row border-b border-gray-200 py-2`}>
            <View style={tailwind`w-full pr-2`}>
                <View style={tailwind`justify-start`}>
                    <Text style={tailwind`font-bold text-base`}>{title}</Text>
                </View>
                <View style={tailwind`flex flex-row justify-between items-center`}>
                    <View style={tailwind`flex flex-row justify-center rounded-md mt-1 flex-1`}>
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
                                <FontAwesome name="circle" size={12} color={getStatusColor()}/>
                                <Text style={tailwind`text-xs ml-1`}>Status</Text>
                            </View>
                            <Text style={tailwind`text-xs text-gray-700`}>{jobStatus}</Text>
                        </View>
                    </View>
                    <View style={tailwind`justify-center items-center rounded-md`}>
                        {profilePic !== null ?
                            <Image source={profilePic} style={tailwind`w-5 h-5 rounded-full`}/>
                            :
                            <View style={tailwind`w-6 h-6 rounded-full bg-gray-200 justify-center items-center`}>
                                <Text style={tailwind`text-center text-gray-500`}>{userName.charAt(0)}</Text>
                            </View>
                        }
                        <Text style={tailwind`text-xs text-gray-700`}>{userName.split(' ')[0]}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default CreatedActiveJobCard;