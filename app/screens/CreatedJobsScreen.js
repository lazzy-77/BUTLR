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
import {useNavigation} from "@react-navigation/core";
import CompletedJobCard from "../components/CompletedJobCard";
import OpenJobCard from "../components/OpenJobCard";

const CreatedJobsScreen = () => {
    const [openJobsLoading, setOpenJobsLoading] = useState(false);
    const [openJobs, setOpenJobs] = useState(null);
    const [activeJobsLoading, setActiveJobsLoading] = useState(false);
    const [activeJobs, setActiveJobs] = useState(null);
    const [completedJobsLoading, setCompletedJobsLoading] = useState(false);
    const [completedJobs, setCompletedJobs] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        setLoading(true);

        refreshJobs().then(r => {
            //Jobs loaded
        }).catch(e => {
            console.log(e)
        })

        setLoading(false);
    }, [])

    const handlePressActiveJobs = (item) => {
        navigation.navigate("ActiveJobDetailsScreen", {
            item: {...item},
        })
    }

    const handlePressOpenJobs = (item) => {
        navigation.navigate("OpenJobDetailsScreen", {
            item: {...item},
        })
    }

    const handlePressCompletedJobs = (item) => {
        navigation.navigate("CompletedJobDetailsScreen", {
            item: {...item},
        })
    }

    const refreshJobs = async () => {
        //Get pending jobs
        const getOpenJobsCreatedByUser = httpsCallable(functions, 'getOpenJobsCreatedByUser')
        const getActiveJobsCreatedByUser = httpsCallable(functions, 'getActiveJobsCreatedByUser')
        const getCompletedJobsCreatedByUser = httpsCallable(functions, 'getCompletedJobsCreatedByUser')

        setActiveJobsLoading(true)
        const activeJobs = await getActiveJobsCreatedByUser().then(r => {
            setActiveJobs(r.data)
            setActiveJobsLoading(false)
        }).catch(e => {
            console.log(e)
            setActiveJobsLoading(false)
        })

        setOpenJobsLoading(true)
        const openJobs = await getOpenJobsCreatedByUser().then(r => {
            setOpenJobs(r.data.sort((a, b) => b.requestedBy.length - a.requestedBy.length))
            setOpenJobsLoading(false)
        }).catch(e => {
            console.log(e)
            setOpenJobsLoading(false)
        })

        setCompletedJobsLoading(true)
        const completedJobs = await getCompletedJobsCreatedByUser().then(r => {
            setCompletedJobs(r.data.sort( (a, b) => new Date(a.completedAt) - new Date(b.completedAt)))
            setCompletedJobsLoading(false)
        }).catch(e => {
            console.log(e)
            setCompletedJobsLoading(false)
        })
    }


    return (
        <Screen style={styles.container}>
            <View style={tailwind`border-b border-gray-100 pb-2 flex flex-row justify-center items-center`}>
                <ScreenHeader screenName="Created Jobs" headerButton={false}/>
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
                    <View style={tailwind`h-3/8 mx-2`}>
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
                                                    Something title
                                                </Text>
                                                <Text style={tailwind`text-sm font-bold`}>
                                                    Something here
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
                    <View style={tailwind`h-3/8 mx-2`}>
                        <Text style={tailwind`text-lg font-bold underline`} onPress={() => console.log(completedJobs)}>
                            Open Jobs
                        </Text>
                        {completedJobsLoading ? (
                            <View style={tailwind`h-full w-full justify-center items-center`}>
                                <ActivityIndicator size="large" color={colors.primary}/>
                            </View>
                        ) : (
                            <ScrollView style={tailwind`bg-white rounded-xl`}>
                                {openJobs && openJobs.map((job, index) => (
                                    <OpenJobCard
                                        key={index}
                                        job={job}
                                        onPress={() => handlePressOpenJobs(job)}
                                    />
                                ))}
                            </ScrollView>)}
                    </View>
                    <View style={tailwind`h-2/8 mx-2`}>
                        <Text style={tailwind`text-lg font-bold underline`}>
                            Completed Jobs
                        </Text>
                        {completedJobsLoading ? (
                            <View style={tailwind`h-full w-full justify-center items-center`}>
                                <ActivityIndicator size="large" color={colors.primary}/>
                            </View>
                        ) : (
                            <ScrollView style={tailwind`bg-white rounded-xl`}>
                                {completedJobs && completedJobs.map((job, index) => (
                                    <CompletedJobCard
                                        key={index}
                                        job={job}
                                        onPress={() => handlePressCompletedJobs(job)}
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

export default CreatedJobsScreen;
