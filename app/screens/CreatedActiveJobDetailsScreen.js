import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import colors from '../configs/colors';
import {FontAwesome, Foundation, Ionicons, MaterialCommunityIcons, Octicons} from '@expo/vector-icons';
import tailwind from 'twrnc';
import {Video} from "expo-av";
import Constants from "expo-constants";
import RequestCard from "../components/RequestCard";
import {httpsCallable, functions, ref, storage, getDownloadURL} from "../configs/firebase";

const CreatedActiveJobDetailsScreen = ({route, navigation}) => {
    const [loading, setLoading] = useState(false);
    const job = route?.params?.item;
    const [profilePic, setProfilePic] = useState(null);
    const [userName, setUserName] = useState("Name");
    const getUserByUid = httpsCallable(functions, 'getUserByUid');

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

    const handleCancel = () => {
        Alert.alert(
            "Cancel Job",
            "Are you sure you want to cancel this job?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                        setLoading(true)
                        const cancelActiveJob = httpsCallable(functions, 'cancelActiveJob');
                        cancelActiveJob({jobId: job.id}).then(() => {
                            setLoading(false)
                            navigation.goBack();
                            alert("Job cancelled successfully!")
                        }).catch((error) => {
                            setLoading(false)
                            console.log(error);
                        });
                    }
                }
            ],
            {cancelable: false}
        );
    }

    const handleConfirm = () => {
        Alert.alert(
            "Confirm Job",
            "Can you confirm this job has been finished?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                        setLoading(true)
                        const confirmJobCompletion = httpsCallable(functions, 'confirmJobCompletion');
                        confirmJobCompletion({jobId: job.id}).then(() => {
                            setLoading(false)
                            navigation.goBack();
                            alert("Job confirmed successfully!")
                        }).catch((error) => {
                            setLoading(false)
                            console.log(error);
                        });
                    }
                }
            ],
            {cancelable: false}
        );
    }

    const handleReject = () => {
        Alert.alert(
            "Reject Job",
            "Only reject the job if the job is not finished regardless of quality of completed job. Are you sure you want to reject this job?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                        setLoading(true)
                        const rejectJobCompletion = httpsCallable(functions, 'rejectJobCompletion');
                        rejectJobCompletion({jobId: job.id}).then(() => {
                            setLoading(false)
                            navigation.goBack();
                            alert("Job rejected successfully!")
                        }).catch((error) => {
                            setLoading(false)
                            console.log(error);
                        });
                    }
                }
            ],
            {cancelable: false}
        );
    }

    const getStatusColor = () => {
        switch (job.jobStatus) {
            case "Active":
                return "#06c167";
            case "Pending Confirmation":
                return "#7e22ce";
        }
    }

    useEffect(() => {
        getProfilePic(job.jobAcceptedBy).catch((error) => {
            console.error(error);
        });
        getUserByUid({uid: job.jobAcceptedBy}).then(r => {
            setUserName(r.data.displayName)
        }).catch(e => {
            console.log(e);
        })
    }, []);

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
                                <View style={styles.infoItem}>
                                    <FontAwesome name="circle" size={12} color={getStatusColor()}/>
                                    <Text style={styles.infoText}>• {job.jobStatus}</Text>
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
                                    Accepted By:
                                </Text>
                                <View style={tailwind`flex flex-row items-center p-2`}>
                                    {profilePic !== null ?
                                        <Image style={tailwind`w-12 h-12 rounded-full mr-2`}
                                               source={{uri: profilePic}}/>
                                        :
                                        <Text style={tailwind`text-lg font-bold`}>
                                            {userName.charAt(0)}
                                        </Text>
                                    }
                                    <Text style={tailwind`text-lg font-bold`}>
                                        {userName}
                                    </Text>
                                </View>
                            </View>
                            <View style={tailwind`flex flex-row mt-2 items-center h-20 justify-between`}>
                                {job.jobStatus === "Pending Confirmation" ?
                                    <View style={tailwind`flex flex-row`}>
                                        <TouchableOpacity
                                            style={tailwind`p-2 rounded-md flex flex-row justify-center items-center h-12 bg-[#EF4444] flex-1 mr-1`}
                                            onPress={() => handleReject()}
                                        >
                                            <Text style={tailwind`text-xl font-bold text-white`}>
                                                Reject
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={tailwind`p-2 rounded-md flex flex-row justify-center items-center h-12 bg-[#06C167] flex-1 mr-1`}
                                            onPress={() => handleConfirm()}
                                        >
                                            <Text style={tailwind`text-xl font-bold text-white`}>
                                                Confirm
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <TouchableOpacity
                                        style={tailwind`p-2 rounded-md flex flex-row justify-center items-center h-12 bg-[#EF4444] flex-1 mr-1`}
                                        onPress={() => handleCancel()}
                                    >
                                        <Text style={tailwind`text-xl font-bold text-white`}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>}
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

export default CreatedActiveJobDetailsScreen;
