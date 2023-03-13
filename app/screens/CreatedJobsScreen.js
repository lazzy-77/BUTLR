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
import CreatedActiveJobCard from "../components/CreatedActiveJobCard";

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
        navigation.navigate("CreatedActiveJobDetailsScreen", {
            item: {...item},
        })
    }

    const handlePressOpenJobs = (item) => {
        navigation.navigate("OpenJobDetailsScreen", {
            item: {...item},
        })
    }


    const refreshJobs = async () => {
        //Get pending jobs
        const getActiveJobsCreatedByUser = httpsCallable(functions, 'getActiveJobsCreatedByUser');
        const getOpenJobsCreatedByUser = httpsCallable(functions, 'getOpenJobsCreatedByUser');
        const getCompletedJobsCreatedByUser = httpsCallable(functions, 'getCompletedJobsCreatedByUser');
        const getPendingConfirmationJobsCreatedByUser = httpsCallable(functions, 'getPendingConfirmationJobsCreatedByUser');

        setActiveJobsLoading(true);

        const [activeJobs, pendingConfirmationJobs] = await Promise.all([
            getActiveJobsCreatedByUser().then((r) => r.data),
            getPendingConfirmationJobsCreatedByUser().then((r) => r.data),
        ]).catch((e) => {
            console.log(e);
            setActiveJobsLoading(false);
        });

        const combinedJobs = [...pendingConfirmationJobs, ...activeJobs];
        const sortedJobs = combinedJobs.sort((a, b) => {
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

        setActiveJobs(sortedJobs);
        setActiveJobsLoading(false);

        setOpenJobsLoading(true);
        const openJobs = await getOpenJobsCreatedByUser()
            .then((r) => {
                setOpenJobs(r.data.sort((a, b) => b.requestedBy.length - a.requestedBy.length));
                setOpenJobsLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setOpenJobsLoading(false);
            });

        setCompletedJobsLoading(true);
        const completedJobs = await getCompletedJobsCreatedByUser()
            .then((r) => {
                setCompletedJobs(r.data.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt)));
                setCompletedJobsLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setCompletedJobsLoading(false);
            });
    };

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
                            <ScrollView style={tailwind`rounded-xl`}>
                                {activeJobs && activeJobs.map((job, index) => (
                                    <CreatedActiveJobCard
                                        key={index}
                                        job={job}
                                        onPress={() => handlePressActiveJobs(job)}
                                    />
                                ))}
                            </ScrollView>)}
                    </View>
                    <View style={tailwind`h-3/8 mx-2`}>
                        <Text style={tailwind`text-lg font-bold underline`}>
                            Open Jobs
                        </Text>
                        {openJobsLoading ? (
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
