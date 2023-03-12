import {Image, Text, View, TouchableOpacity} from "react-native";
import tailwind from "twrnc";
import React, {useState, useEffect} from "react";
import {functions, getDownloadURL, httpsCallable, ref, storage} from "../configs/firebase";
import {useNavigation} from "@react-navigation/core";

function RequestCard(props) {
    const [profilePic, setProfilePic] = useState(null);
    const [userName, setUserName] = useState("Name");
    const getUserByUid = httpsCallable(functions, 'getUserByUid');
    const navigation = useNavigation();

    const getProfilePic = async (uid) => {
        const fileRef = ref(storage, 'users/' + uid + '/profilePic');
        const url = getDownloadURL(fileRef);
        await url.then(r => {
            if (url["_z"] !== undefined) {
                setProfilePic(url["_z"]);
            }
        }).catch(e => {
            console.log(e);
        })
    }

    const handleAccept = () => {
        const acceptJobRequest = httpsCallable(functions, 'acceptJobRequest');
        acceptJobRequest({jobId: props.uid, acceptedUserId: props.uid}).then(r => {
            navigation.goBack()
        }).catch(e => {
            console.log(e);
        })
    }

    useEffect(() => {
        getProfilePic(props.uid).catch((error) => {
            console.error(error);
        });
        getUserByUid({uid: props.uid}).then(r => {
            setUserName(r.data.displayName)
        }).catch(e => {
            console.log(e);
        })
    }, []);

    return (
        <View style={tailwind`flex flex-row items-center p-1`}>
            <Image style={tailwind`w-10 h-10 rounded-full`} source={{uri: profilePic}}/>
            <View style={tailwind`ml-2 flex flex-row justify-between items-center max-w-full flex-1`}>
                <Text style={tailwind`text-lg font-medium w-2/3 max-w-xs`}>{userName}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity style={tailwind`rounded-full bg-green-300`} onPress={() => handleAccept()}>
                        <Text style={tailwind`text-sm text-gray-500 m-1.5`}>Accept</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default RequestCard;