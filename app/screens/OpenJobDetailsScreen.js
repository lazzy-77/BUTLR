import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../configs/colors';
import {AntDesign, Entypo, Foundation, Ionicons, MaterialCommunityIcons, Octicons} from '@expo/vector-icons';
import tailwind from 'twrnc';
import ServiceMap from '../components/ServiceMap';
import {getDistance} from "geolib";
import {Video} from "expo-av";
import {
    addDoc,
    auth,
    collection,
    db,
    functions, getDocs,
    getDownloadURL,
    httpsCallable,
    query,
    ref,
    storage,
    where
} from "../configs/firebase";
import Constants from "expo-constants";
import RequestCard from "../components/RequestCard";

const OpenJobDetailsScreen = ({route, navigation}) => {
    const [loading, setLoading] = useState(false);
    const job = route?.params?.item;

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={tailwind`h-full w-full justify-center items-center`}>
                    <ActivityIndicator size="large" color={colors.primary}/>
                </View>
            ) : (
                <View>
                    <TouchableOpacity
                        style={tailwind`absolute top-9 left-4 z-30 w-9 h-9 rounded-full bg-white justify-center items-center shadow`}
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={18} color={colors.black}/>
                    </TouchableOpacity>
                    <View style={styles.content}>
                        <View style={tailwind`p-2`}>
                            <View style={styles.header}>
                                <Text style={styles.title}
                                      onPress={() => console.log(route.params?.item)}>{job.title}</Text>
                            </View>
                            <View style={styles.info}>
                                <View style={styles.infoItem}>
                                    <MaterialCommunityIcons name="clock-time-four" size={14} color="#06C167"/>
                                    <Text style={styles.infoText}>• {job.duration}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Foundation name="dollar" size={16} color={colors.primary}/>
                                    <Text style={styles.infoText}>• {job.pay}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Octicons name="apps" size={16} color="#38bdf8"/>
                                    <Text style={styles.infoText}>• {job.categoryDisplayName}</Text>
                                </View>
                            </View>
                            <ScrollView style={tailwind`bg-gray-50 rounded-md mt-1 h-36 max-h-36`}>
                                <Text style={tailwind`text-lg m-1 font-medium`}>Description</Text>
                                <Text style={tailwind`text-gray-700 text-sm m-1`}>{job.description}</Text>
                            </ScrollView>
                            {job.media.length > 0 && (
                                <View style={tailwind`bg-gray-50 rounded-md mt-1 h-52 max-h-52`}>
                                    <Text style={tailwind`text-lg m-1 font-medium`}>Pictures and Videos
                                        ({job.media.length})</Text>
                                    <ScrollView horizontal={true} style={tailwind`flex flex-row`}>
                                        {job.media.map((media, index) => {
                                            if (media.type === 'video') {
                                                return (
                                                    <Video
                                                        source={{uri: media.uri}}
                                                        key={media.uri}
                                                        resizeMode="cover"
                                                        useNativeControls
                                                        shouldPlay
                                                        isLooping
                                                        style={tailwind`w-40 h-40 m-1 rounded-md`}
                                                    />
                                                )
                                            } else {
                                                return (
                                                    <Image key={index} style={tailwind`w-40 h-40 m-1 rounded-md`}
                                                           source={{uri: media.uri}}/>
                                                )
                                            }
                                        })}
                                    </ScrollView>
                                </View>
                            )}
                            <View style={tailwind`bg-gray-50 mt-1 rounded-md`}>
                                <Text style={tailwind`text-xl m-1`}>
                                    Requests ({job.requestedBy.length})
                                </Text>
                                {job.requestedBy.map((uid, index) => {
                                    return (
                                        <RequestCard key={index} uid={uid}/>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </View>)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        position: 'relative',
        flex: 1,
    },
    mapImageWrapper: {
        width: '100%',
        zIndex: 10,
    },
    image: {
        width: '100%',
        resizeMode: 'cover',
        height: 260
    },
    content: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '100%',
        marginTop: Constants.statusBarHeight
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
    },
    title: {
        fontSize: 23,
        color: colors.title,
        fontWeight: '700',
        maxWidth: '80%'
    },
    price: {
        fontSize: 20,
        color: colors.primary,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 3,
        backgroundColor: colors.light,
        borderRadius: 5,
        marginRight: 7
    },
    infoText: {
        marginLeft: 4,
        fontSize: 12
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '49%',
        height: 50
    },
})

export default OpenJobDetailsScreen;
