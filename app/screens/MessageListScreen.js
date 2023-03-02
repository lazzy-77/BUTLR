import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {collection, query, where, orderBy, onSnapshot, db, auth} from '../configs/firebase';
import ScreenHeader from "../components/ScreenHeader";
import Screen from '../components/Screen'
import tailwind from "tailwind-react-native-classnames";

const MessageListScreen = ({navigation}) => {
    const [conversations, setConversations] = useState([]);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, where('users', 'array-contains', currentUser.uid), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, querySnapshot => {
            const newConversations = [];
            querySnapshot.forEach(doc => {
                const message = doc.data();
                const otherUserId = message.users.find(uid => uid !== currentUser.uid);
                const conversation = newConversations.find(conversation => conversation.user.uid === otherUserId);

                if (conversation) {
                    if (message.createdAt > conversation.lastMessage.createdAt) {
                        conversation.lastMessage = message;
                    }
                } else {
                    newConversations.push({
                        user: {
                            uid: otherUserId,
                            name: message.user.name,
                            avatar: message.user.avatar,
                        },
                        lastMessage: message,
                    });
                }
            });
            setConversations(newConversations);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handlePress = data => {
        const key = auth.currentUser.uid;

        const [otherUserID, otherUserName] = Object.entries(data).find(([k]) => k !== key);

        navigation.navigate('MessageScreen', {
            otherUser: {
                uid: otherUserID,
                name: otherUserName,
            },
        });
    };

    const getOtherUserName = data => {
        const key = auth.currentUser.uid;
        const [, otherUserName] = Object.entries(data).find(([k]) => k !== key);
        return otherUserName;
    }

    return (
        <Screen style={styles.container}>
            <View style={tailwind`border-b border-gray-100 pb-2`}>
                <ScreenHeader screenName="Messages" headerButton={false}/>
            </View>
            <FlatList
                data={conversations}
                keyExtractor={item => item.user.uid}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => handlePress(item.lastMessage.uidToName)}>
                        <View style={styles.conversation}>
                            <View style={tailwind`flex flex-row items-center justify-between`}>
                                <Text style={styles.username}>
                                    {getOtherUserName(item.lastMessage.uidToName)}
                                </Text>
                                <Text>
                                    {item.lastMessage.createdAt.toDate().toLocaleTimeString()}
                                </Text>
                            </View>
                            {item.lastMessage && (
                                <Text numberOfLines={1} style={styles.message}>
                                    {item.lastMessage.text}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
            <Text onPress={() => console.log(JSON.stringify(conversations[0]))}>
                Print conversations
            </Text>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    conversation: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    message: {
        fontSize: 16,
        color: '#777',
    },
});

export default MessageListScreen;
