import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../configs/colors';
import {AntDesign, Entypo, Foundation, Ionicons, MaterialCommunityIcons, Octicons} from '@expo/vector-icons';
import tailwind from 'twrnc';
import ServiceMap from '../components/ServiceMap';
import {getDistance} from "geolib";
import {Video} from "expo-av";
import {auth, functions, getDownloadURL, httpsCallable, ref, storage} from "../configs/firebase";
import MessageScreen from '../screens/MessageScreen';

const CompletedJobDetailsScreen = ({route, navigation}) => {
    const [otherUser, setOtherUser] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [returnToPin, setReturnToPin] = useState(false);
    const [loading, setLoading] = useState(false);
    const {name} = route?.params?.item;
    const otherUserUid = route?.params?.item.createdBy;
    const getUserByUid = httpsCallable(functions, 'getUserByUid');
    const [buttonText, setButtonText] = useState('Apply');
    const [buttonStyle, setButtonStyle] = useState(styles.button);

    const refreshServiceData = route?.params?.refreshServiceData;

    const coordinates = {
        latitude: route?.params?.item.location[0],
        longitude: route?.params?.item.location[1]
    }
    const pointA = {
        latitude: route?.params?.userLocation.latitude,
        longitude: route?.params?.userLocation.longitude
    }
    const job = route?.params?.item;
    const pointB = {
        latitude: job.location[0],
        longitude: job.location[1]
    }

    useEffect(() => {
        setLoading(true);
        getOtherUser().then(() => {
            setLoading(false);
        });

        if (route?.params?.item?.requestedBy && route?.params?.item?.requestedBy.includes(auth.currentUser.uid)) {
            setButtonText('Pending');
            setButtonStyle(styles.button_pending);
        }

    }, [])

    useEffect(() => {
        getProfilePic().then(() => {
            //Profile pic is set
        }).catch(e => {
            console.log(e);
        });
    }, [otherUser])

    const getProfilePic = async () => {
        const fileRef = ref(storage, 'users/' + otherUser.uid + '/profilePic');
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

    const getOtherUser = async () => {
        const response = await getUserByUid({uid: otherUserUid});
        await response;
        setOtherUser(response.data);
    }

    const handleApply = async () => {
        if (buttonText === 'Apply') {
            setLoading(true);
            const addRequestToJob = httpsCallable(functions, 'addRequestToJob');
            await addRequestToJob({jobId: job.id}).then(() => {
                setLoading(false);
                setButtonText('Pending');
                setButtonStyle(styles.button_pending);
                navigation.goBack();
                alert('Request sent!')
            }).catch(e => {
                alert(e);
                setLoading(false);
            })
        } else {
            Alert.alert(
                'Cancel Request',
                'Are you sure you want to cancel your request for this job?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => {
                            //Do nothing
                        },
                        style: 'cancel'
                    },
                    {
                        text: 'Yes',
                        onPress: async () => {
                            setLoading(true);
                            const removeRequestFromJob = httpsCallable(functions, 'removeRequestFromJob');
                            await removeRequestFromJob({jobId: job.id}).then(() => {
                                setLoading(false);
                                setButtonText('Apply');
                                setButtonStyle(styles.button);
                                navigation.goBack();
                                alert('Request cancelled!')
                            }).catch(e => {
                                alert(e);
                                setLoading(false);
                            })
                        }
                    }],
                {cancelable: false}
            );
        }
    };

    const distance = getDistance(pointA, pointB);

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
                    <View style={styles.mapImageWrapper}>
                        <View>
                            <ServiceMap coordinates={coordinates} title={name} returnToPin={returnToPin}
                                        setReturnToPin={setReturnToPin}/>
                        </View>
                    </View>

                    <View style={styles.content}>
                        <View style={tailwind`p-6`} showsVerticalScrollIndicator={false}>
                            <View style={styles.header}>
                                <Text style={styles.title} onPress={() => console.log(route.params?.item)}>{job.title}</Text>
                                <TouchableOpacity onPress={() => setReturnToPin(true)}>
                                    <Entypo name="location" size={24} color={'#000'}/>
                                </TouchableOpacity>
                            </View>
                            <View style={tailwind`flex flex-row justify-between items-start`}>
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
                                        <MaterialCommunityIcons name="compass" size={16} color={colors.slate}/>
                                        <Text style={styles.infoText}>• {getDisplayDistance(distance)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={tailwind`flex flex-row justify-between items-start mt-1`}>
                                <View style={styles.infoItem}>
                                    <Octicons name="apps" size={16} color="#38bdf8"/>
                                    <Text style={styles.infoText}>• {job.categoryDisplayName}</Text>
                                </View>
                            </View>
                            <View style={tailwind`rounded-md mt-1 flex flex-row items-center max-h-12 h-12`}>
                                {
                                    profilePic !== null && otherUser !== null ? (
                                        <Image
                                            style={tailwind`w-10 h-10 mr-1 rounded-full`}
                                            source={profilePic}
                                            key={otherUser.photoURL}
                                        />
                                    ) : (
                                        <AntDesign name="user" size={24} color={colors.primary}
                                                   style={tailwind`w-10 h-10 mr-1 rounded-full`}/>
                                    )
                                }
                                {
                                    otherUser !== null ? (
                                        <Text
                                            style={tailwind`text-lg h-10 mt-2 font-semibold`}>{otherUser.displayName}</Text>
                                    ) : (
                                        <Text style={tailwind`text-lg h-10 mt-2 font-semibold`}>User Name</Text>
                                    )
                                }
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
        flex: 1
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
        zIndex: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: 220,
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    button_pending: {
        backgroundColor: '#38bdf8',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '49%',
        height: 50
    }
})

export default CompletedJobDetailsScreen;
