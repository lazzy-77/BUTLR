import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions } from "../configs/firebase";
import Constants from "expo-constants";
import ScreenHeader from "../components/ScreenHeader";
import tailwind from "twrnc";
import Conversation from "../components/Conversation";

const ConversationsScreen = () => {
    const user = auth.currentUser;
    const [conversations, setConversations] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const conversationsRef = collection(db, "conversations");
        const q = query(conversationsRef, where("participants", "array-contains", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const conversations = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                conversations.push({
                    id: doc.id,
                    participants: data.participants,
                    lastMessage: data.lastMessage,
                    timestamp: {
                        _seconds: data.timestamp.seconds,
                        _nanoseconds: data.timestamp.nanoseconds,
                    },
                });
            });
            // Sort the conversations array by timestamp (the newest on top)
            conversations.sort((a, b) => b.timestamp._seconds - a.timestamp._seconds);
            setConversations(conversations);
        });

        return () => unsubscribe();
    }, [user]);

    const handleConversationPress = (conversation) => {
        const otherUserUid = conversation.participants.filter((participant) => participant !== user.uid)[0];

        navigation.navigate("MessageScreen", { conversationId: conversation.id, otherUserUid: otherUserUid });
    };

    return (
        <View style={styles.container}>
            <ScreenHeader screenName="Conversations" headerButton={false} />
            <View style={tailwind`px-4`}>
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Conversation
                            onPress={() => handleConversationPress(item)}
                            item={item}
                            prop2={(participant) => participant !== user?.uid}
                        />
                    )}
                />
            </View>
        </View>
    );
};

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

export default ConversationsScreen;
