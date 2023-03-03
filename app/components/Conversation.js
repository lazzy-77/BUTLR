import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import tailwind from "tailwind-react-native-classnames";
import React, {useEffect} from "react";
import {auth, getDownloadURL, ref, storage} from "../configs/firebase";
import {AntDesign} from "@expo/vector-icons";
import colors from "../configs/colors";

const Conversation = (props) => {
    const [profilePic, setProfilePic] = React.useState(null);

    useEffect(() => {
        getProfilePic(props.item.lastMessage.uidToName).then(r => {
            //profilePic is set
        }).catch(e => {
            console.log(e);
        });
    }, []);

    const getProfilePic = async (data) => {
        const fileRef = ref(storage, 'users/' + getOtherUserUid(data) + '/profilePic');
        const url = getDownloadURL(fileRef);
        await url.then(r => {
            if (url["_z"] !== undefined) {
                setProfilePic(url["_z"]);
            }
        }).catch(e => {
            console.log(e);
        })
    }

    const getOtherUserUid = (data) => {
        const key = auth.currentUser.uid;
        const [otherUserUid, ] = Object.entries(data).find(([k]) => k !== key);
        return otherUserUid;
    }

    return (
        <TouchableOpacity style={tailwind`border-b-2 border-gray-100 flex flex-row items-center justify-between overflow-hidden p-1`}
                          onPress={props.onPress}>
            <View style={tailwind`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center`}>
                {profilePic ? <Image source={{uri: profilePic}} style={tailwind`w-10 h-10 mr-1 rounded-full`}/> :
                    <AntDesign name="user" size={24} color={colors.primary}
                               style={tailwind`w-10 h-10 mr-1 rounded-full`}/>}
            </View>
            <View style={tailwind`py-3 flex-shrink`}>
                <View style={tailwind`flex flex-row items-center justify-between overflow-hidden mr-1`}>
                    <Text style={tailwind`text-lg font-bold mb-1`}>
                        {props.otherUserName}
                    </Text>
                    <Text style={tailwind`text-sm`}>
                        {props.item.lastMessage.createdAt.toDate().toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true
                        })}
                    </Text>
                </View>
                {props.item.lastMessage && (
                    <Text numberOfLines={1} style={styles.message}>
                        {props.item.lastMessage.text}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    message: {
        fontSize: 16,
        color: '#777',
        flex: 1,
        flexWrap: 'wrap',
    },
});

export default Conversation;
