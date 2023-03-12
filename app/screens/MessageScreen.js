import React, {useState, useEffect, useRef} from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
} from "react-native";
import {
    auth,
    functions,
    httpsCallable,
    db,
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    ref, storage, getDownloadURL
} from "../configs/firebase";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import colors from "../configs/colors";
import Constants from "expo-constants";
import tailwind from "twrnc";
import {useNavigation} from "@react-navigation/core";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const MessageScreen = ({route}) => {
    const user = auth.currentUser;
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [userName, setUserName] = useState("Name");
    const {conversationId, otherUserUid} = route.params;
    const flatListRef = useRef(null);

    const getUserByUid = httpsCallable(functions, "getUserByUid");
    const navigation = useNavigation();

    const displayUser = async () => {
        await getProfilePic(otherUserUid)
            .catch(e => {
                console.log(e);
            })
        await getUserByUid({uid: otherUserUid}).then(r => {
            setUserName(r.data.displayName)
        }).catch(e => {
            console.log(e);
        })
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

    useEffect(() => {
        displayUser().catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        const messagesRef = collection(db, "messages");
        const conversationMessagesQuery = query(
            messagesRef,
            where("conversationId", "==", conversationId),
            orderBy("timestamp", "asc")
        );
        const unsubscribeMessages = onSnapshot(conversationMessagesQuery, (snapshot) => {
            const newMessages = snapshot.docs.map((doc) => {
                return {id: doc.id, ...doc.data()};
            });
            setMessages(newMessages);
        });

        return () => {
            unsubscribeMessages();
        };
    }, [conversationId]);

    const handleSend = () => {
        if (messageText.trim() === "") {
            return;
        }
        const addMessage = httpsCallable(functions, "addMessage");
        addMessage({conversationId, message: messageText}).catch((error) => {
            console.error(error);
        });
        setMessageText("");
    };

    return (
        <View style={styles.container}>
            <View style={tailwind`h-16 bg-white items-center justify-center flex flex-row`}>
                <TouchableOpacity
                    style={tailwind`absolute top-3 left-4 z-30 w-9 h-9 rounded-full bg-white justify-center items-center shadow`}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={18} color={colors.black}/>
                </TouchableOpacity>
                <View
                    style={tailwind`w-8 h-8 rounded-full overflow-hidden bg-gray-200 justify-center items-center mr-2`}>
                    {profilePic !== null ? (
                        <Image source={{uri: profilePic}} style={tailwind`w-full h-full`}/>
                    ) : (
                        <Text style={tailwind`text-2xl text-center`}>{userName.split(" ")[0].charAt(0)}</Text>
                    )}
                </View>
                <Text style={tailwind`text-xl font-bold`}>{userName.split(" ")[0]}</Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View style={item.senderId === user?.uid ? styles.senderMessage : styles.receiverMessage}>
                        <Text
                            style={item.senderId === user?.uid ? tailwind`text-white` : tailwind`text-black`}>
                            {item.message}
                        </Text>
                    </View>
                )}/>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                onLayout={() => flatListRef.current.scrollToEnd({animated: true})}
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={messageText}
                    onChangeText={(text) => setMessageText(text)}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <MaterialCommunityIcons name={"send"} size={24} color={colors.slate}/>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Constants.statusBarHeight,
    },
    senderMessage: {
        backgroundColor: "#0284C7",
        padding: 10,
        borderRadius: 10,
        alignSelf: "flex-end",
        margin: 5,
        maxWidth: "80%",
    },
    receiverMessage: {
        backgroundColor: "#E7E5E4",
        padding: 10,
        borderRadius: 10,
        alignSelf: "flex-start",
        margin: 5,
        maxWidth: "80%",
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
        width: "100%",
        position: "absolute",
        bottom: 5,
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 5,
    },
    sendButton: {
        padding: 10,
        borderRadius: 5,
    },
    sendButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default MessageScreen;
