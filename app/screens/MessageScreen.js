import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {
    db,
    collection,
    doc,
    query,
    where,
    onSnapshot,
    addDoc,
    orderBy,
    auth,
    ref,
    storage,
    getDownloadURL
} from '../configs/firebase';
import tailwind from "tailwind-react-native-classnames";
import Screen from "../components/Screen";
import Constants from "expo-constants";
import colors from "../configs/colors";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/core";

const MessageScreen = ({route}) => {
    const {otherUser} = route.params;
    const currentUser = auth.currentUser;
    const [messages, setMessages] = useState([]);
    const [profilePic, setProfilePic] = useState(null);
    const [displayName, setDisplayName] = useState(null);

    const navigation = useNavigation();

    const getProfilePic = async () => {
        const fileRef = ref(storage, 'users/' + otherUser.uid + '/profilePic');
        const url = getDownloadURL(fileRef);
        await url.then(r => {
            if (url["_z"] !== undefined) {
                setProfilePic(url["_z"]);
            }
        }).catch(e => {
            console.log(e);
        })
    }

    useEffect(() => {
        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, where('users', 'array-contains-any', [currentUser.uid, otherUser.uid]), orderBy('createdAt', 'desc'));

        getProfilePic().then(r => {
            //profilePic is set
        }).catch(e => {
            console.log(e);
        });

        if (!otherUser.name && otherUser.displayName !== null) {
            setDisplayName(otherUser.displayName);
        } else {
            setDisplayName(otherUser.name);
        }

        const unsubscribe = onSnapshot(q, querySnapshot => {
            const newMessages = [];
            querySnapshot.forEach(doc => {
                const message = doc.data();
                newMessages.push({
                    _id: doc.id,
                    text: message.text,
                    createdAt: message.createdAt.toDate(),
                    user: {
                        _id: message.user._id,
                        name: message.user.name,
                    },
                });
            });
            setMessages(newMessages);
        });

        return () => unsubscribe();
    }, [currentUser, otherUser]);

    const handleSend = async newMessages => {
        const message = newMessages[0];
        const uidToName = {}
        uidToName[currentUser.uid] = currentUser.displayName ? currentUser.displayName : currentUser.name;
        uidToName[otherUser.uid] = otherUser.displayName ? otherUser.displayName : otherUser.name
        try {
            await addDoc(collection(db, 'messages'), {
                text: message.text,
                createdAt: new Date(),
                users: [currentUser.uid, otherUser.uid],
                user: {
                    _id: currentUser.uid,
                    name: currentUser.displayName,
                },
                uidToName: uidToName,
            });
        } catch (error) {
            console.error('Error adding message: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={tailwind`absolute top-14 left-4 z-30 w-9 h-9 rounded-full bg-white justify-center items-center shadow`}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={18} color={colors.black}/>
                </TouchableOpacity>
                {profilePic ? <Image source={{uri: profilePic}} style={tailwind`w-9 h-9 mr-1 rounded-full`}/> :
                    <AntDesign name="user" size={24} color={colors.primary}
                               style={tailwind`w-10 h-10 mr-1 rounded-full`}/>}
                <Text style={tailwind`text-xs font-bold`}>{displayName}</Text>
            </View>
            <GiftedChat
                messages={messages}
                onSend={handleSend}
                user={{
                    _id: currentUser.uid,
                    name: currentUser.displayName,
                }}
                messagesContainerStyle={{
                    backgroundColor: '#fff',
                }}
                textInputStyle={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                }}
                renderAvatar={null}
                maxComposerHeight={0}
                scrollToBottom
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: Constants.statusBarHeight,
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        height: 110,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default MessageScreen;
