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

    const handlePress = (item) => {
        navigation.navigate("PendingJobDetailsScreen", {
            item: {...item},
            userLocation: {...location},
        })
    }

    const refreshJobs = async () => {
        //Get pending jobs
        const getUserPendingJobs = httpsCallable(functions, 'getUserPendingJobs')
        const getUserActiveJobs = httpsCallable(functions, 'getUserActiveJobs')
        setActiveJobsLoading(true)
        const activeJobs = await getUserActiveJobs().then(r => {
            setActiveJobs(r.data)
            setActiveJobsLoading(false)
        }).catch(e => {
            console.log(e)
            setActiveJobsLoading(false)
        })
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
                            <ScrollView style={tailwind`bg-gray-100 rounded-xl`}>
                                {activeJobs && activeJobs.map((job, index) => (
                                    <View key={index} style={tailwind`border-b border-gray-100`}>
                                        <View style={tailwind`flex flex-row`}>
                                            <View style={tailwind`w-1/2`}>
                                                <Text style={tailwind`text-sm font-bold text-gray-500`}>
                                                    Job ID
                                                </Text>
                                                <Text style={tailwind`text-sm font-bold`}>
                                                    {job.jobId}
                                                </Text>
                                            </View>
                                            <View style={tailwind`w-1/2`}>
                                                <Text style={tailwind`text-sm font-bold text-gray-500`}>
                                                    Job Status
                                                </Text>
                                                <Text style={tailwind`text-sm font-bold`}>
                                                    {job.jobStatus}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={tailwind`flex flex-row`}>
                                            <View style={tailwind`w-1/2`}>
                                                <Text style={tailwind`text-sm font-bold text-gray-500`}>
                                                    Job Type
                                                </Text>
                                                <Text style={tailwind`text-sm font-bold`}>
                                                    {job.jobType}
                                                </Text>
                                            </View>
                                            <View style={tailwind`w-1/2`}>
                                                <Text style={tailwind`text-sm font-bold text-gray-500`}>
                                                    Job Date
                                                </Text>
                                                <Text style={tailwind`text-sm font-bold`}>
                                                    {job.jobDate}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={tailwind`flex flex-row`}>
                                            <View style={tailwind`w-1/2`}>
                                                <Text style={tailwind`text-sm font-bold text-gray-500`}>
                                                    Job Time
                                                </Text>
                                                <Text style={tailwind`text-sm font-bold`}>
                                                    {job.jobTime}
                                                </Text>
                                            </View>
                                            <View style={tailwind`w-1/2`}>
                                                <Text style={tailwind`text-sm font-bold text-gray-500`}>
                                                    Job Location
                                                </Text>
                                                <Text style={tailwind`text-sm font-bold`}>
                                                    {job.jobLocation}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={tailwind`flex flex-row`}>
                                            <View style={tailwind`w-1/2`}>
                                                <Text style={tailwind`text-sm font-bold text-gray-500`}>
                                                    Job Description
                                                </Text>
                                                <Text style={tailwind`text-sm font-bold`}>
                                                    {job.jobDescription}
                                                </Text>
                                            </View>
                                            <View style={tailwind`w-1/2`}>
                                                <Text style={tailwind`text-sm font-bold text-gray-500`}>
                                                    Job Price
                                                </Text>
                                                <Text style={tailwind`text-sm font-bold`}>
                                                    {job.jobPrice}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
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
                                        onPress={() => handlePress(job)}
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
