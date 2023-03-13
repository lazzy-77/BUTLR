import {StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator} from "react-native";
import tailwind from "twrnc";
import React, {useEffect, useState} from "react";
import Constants from "expo-constants";
import {getDownloadURL, ref, storage, auth, httpsCallable, functions} from "../configs/firebase";
import colors from "../configs/colors";

const Conversation = (props) => {
    const [profilePic, setProfilePic] = useState(null);
    const otherUserUid = props.item.participants.filter(participant => participant !== auth.currentUser.uid)[0];
    const getUserByUid = httpsCallable(functions, 'getUserByUid');
    const [userName, setUserName] = useState("Name");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        displayUser().catch((error) => {
                console.error(error);
            });
    }, []);

    const displayUser = async () => {
        setLoading(true)
        await getProfilePic(otherUserUid)
            .catch(e => {
                console.log(e);
            })
        await getUserByUid({uid: otherUserUid}).then(r => {
            setUserName(r.data.displayName)
        }).catch(e => {
            console.log(e);
        })
        setLoading(false)
    }

    const getProfilePic = async (data) => {
        const fileRef = ref(storage, 'users/' + data + '/profilePic');
        const url = getDownloadURL(fileRef);
        await url.then(r => {
            if (url["_z"] !== undefined) {
                setProfilePic(url["_z"]);
            }
        }).catch(e => {
            console.log(e);
        })
    }

    return (
        <View>
        {loading ?
                (<View style={tailwind`flex flex-row w-full py-2 border-b-2 border-gray-200 `}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>)
                :
                (<TouchableOpacity onPress={props.onPress}>
                    <View style={tailwind`flex flex-row w-full py-2 border-b-2 border-gray-200`}>
                        <View
                            style={tailwind`rounded-full w-12 h-12 bg-gray-300 mr-2 flex justify-center items-center`}>
                            {profilePic ?
                                <Image source={{uri: profilePic}} style={tailwind`w-12 h-12 rounded-full`}/>
                                :
                                <Text style={tailwind`text-center text-2xl`}>
                                    {userName.charAt(0)}
                                </Text>
                            }
                        </View>
                        <View style={tailwind`overflow-hidden min-h-14 max-h-14 flex flex-1`}>
                            <View>
                                <Text style={styles.conversationTitle}>
                                    {userName}
                                </Text>
                            </View>
                            <Text numberOfLines={1}
                                  style={styles.conversationLastMessage}>{props.item.lastMessage}</Text>
                            <View style={tailwind`flex-1`}>
                                <Text style={tailwind`text-right text-gray-400`} numberOfLines={1}>
                                    {new Date(props.item.timestamp._seconds * 1000 + props.item.timestamp._nanoseconds / 1000000).toLocaleTimeString(
                                        [], {
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true
                                        })}
                                </Text>
                            </View>
                        </View>

                    </View>
                </TouchableOpacity>)
        }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        flex: 1,
    },
    conversationTitle: {
        fontWeight: "bold",
    },
    conversationLastMessage: {
        color: "#888",
    },
});

export default Conversation;