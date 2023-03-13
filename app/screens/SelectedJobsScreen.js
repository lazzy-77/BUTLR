import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityBase,
    View
} from 'react-native';
import ScreenHeader from "../components/ScreenHeader";
import Screen from '../components/Screen'
import tailwind from "twrnc";
import {functions, httpsCallable, auth} from '../configs/firebase';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import colors from "../configs/colors";
import * as PropTypes from "prop-types";
import PendingJobCard from "../components/PendingJobCard";
import * as Location from "expo-location";
import {useNavigation} from "@react-navigation/core";
import SelectedActiveJobCard from "../components/SelectedActiveJobCard";

const SelectedJobsScreen = () => {
    const [pendingJobsLoading, setPendingJobsLoading] = useState(false);
    const [pendingJobs, setPendingJobs] = useState(null);
    const [activeJobsLoading, setActiveJobsLoading] = useState(false);
    const [activeJobs, setActiveJobs] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const userUid = auth.currentUser.uid;
    const navigation = useNavigation();

    useEffect(() => {
        setLoading(true);

        Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation
        }).then(r => {
            setLocation(r.coords)
        }).catch(e => {
            console.log(e)
        })

        refreshJobs().then(r => {
            //Jobs loaded
        }).catch(e => {
            console.log(e)
        })

        setLoading(false);
    }, [])

    const handleActiveJobPress = (item) => {
        navigation.navigate("SelectedActiveJobDetailsScreen", {
            item: {...item},
            userLocation: {...location},
        })
    }

    const handlePendingJobPress = (item) => {
        navigation.navigate("PendingJobDetailsScreen", {
            item: {...item},
            userLocation: {...location},
        })
    }

    const refreshJobs = async () => {
        //Get pending jobs
        const getUserPendingJobs = httpsCallable(functions, 'getUserPendingJobs')
        const getUserActiveJobs = httpsCallable(functions, 'getUserActiveJobs')
        const getUserPendingConfirmationJobs = httpsCallable(functions, 'getUserPendingConfirmationJobs')

        setActiveJobsLoading(true)
        const [activeJobs, pendingConfirmationJobs] = await Promise.all([
            getUserActiveJobs().then(r => r.data),
            getUserPendingConfirmationJobs().then(r => r.data),
        ]).catch(e => {
            console.log(e)
            setActiveJobsLoading(false)
        })

        const allActiveJobs = [...pendingConfirmationJobs, ...activeJobs];
        const sortedActiveJobs = allActiveJobs.sort((a, b) => {
            if (a.status === "Pending Confirmation" && b.status === "Pending Confirmation") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (a.status === "Pending Confirmation") {
                return -1;
            } else if (b.status === "Pending Confirmation") {
                return 1;
            } else {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
        setActiveJobs(sortedActiveJobs);
        setActiveJobsLoading(false);

        setPendingJobsLoading(true)
        const pendingJobs = await getUserPendingJobs().then(r => {
            setPendingJobs(r.data)
            setPendingJobsLoading(false)
        }).catch(e => {
            console.log(e)
            setPendingJobsLoading(false)
        })
    }


    return (
        <Screen style={styles.container}>
            <View style={tailwind`border-b border-gray-100 pb-2 flex flex-row justify-center items-center`}>
                <ScreenHeader screenName="Selected Jobs" headerButton={false}/>
                <TouchableOpacity style={tailwind`absolute right-0 pr-3`} onPress={() => {
                    refreshJobs().then(r => {
                        //Jobs loaded
                    }).catch(e => {
                        console.log(e)
                    })
                }}>
                    <MaterialCommunityIcons name="refresh" size={26} color="black"/>
                </TouchableOpacity>
            </View>
            {loading ? (
                <View style={tailwind`h-full w-full justify-center items-center`}>
                    <ActivityIndicator size="large" color={colors.primary}/>
                </View>
            ) : (
                <View style={tailwind`h-full mt-2`}>
                    <View style={tailwind`h-2/5 mx-2`}>
                        <Text style={tailwind`text-lg font-bold`}>
                            Active Jobs
                        </Text>
                        {activeJobsLoading ? (
                            <View style={tailwind`h-full w-full justify-center items-center`}>
                                <ActivityIndicator size="large" color={colors.primary}/>
                            </View>
                        ) : (
                            <ScrollView style={tailwind`rounded-xl`}>
                                {activeJobs && activeJobs.map((job, index) => (
                                    <SelectedActiveJobCard
                                        key={index}
                                        job={job}
                                        location={location}
                                        onPress={() => handleActiveJobPress(job)}
                                    />
                                ))}
                            </ScrollView>)}
                    </View>
                    <View style={tailwind`h-3/5 mx-2`}>
                        <Text style={tailwind`text-lg font-bold underline`} onPress={() => console.log(pendingJobs)}>
                            Pending Jobs
                        </Text>
                        {pendingJobsLoading ? (
                            <View style={tailwind`h-full w-full justify-center items-center`}>
                                <ActivityIndicator size="large" color={colors.primary}/>
                            </View>
                        ) : (
                            <ScrollView style={tailwind`bg-white rounded-xl`}>
                                {pendingJobs && pendingJobs.map((job, index) => (
                                    <PendingJobCard
                                        key={index}
                                        job={job}
                                        location={location}
                                        onPress={() => handlePendingJobPress(job)}
                                    />
                                ))}
                            </ScrollView>)}
                    </View>
                </View>)}
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

export default SelectedJobsScreen;
