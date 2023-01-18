import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, Alert, ActivityIndicator} from 'react-native';
import ScreenHeader from "../components/ScreenHeader";
import Screen from '../components/Screen'
import Categories from '../components/Categories'
import SearchBar from '../components/SearchBar'
import ServiceItem from "../components/ServiceItem";
import tailwind from 'tailwind-react-native-classnames';
import {localServices} from '../data/localServices';
import colors from '../configs/colors'

const RequestsScreen = () => {
    const [serviceData, setServiceData] = useState(localServices)
    const [city, setCity] = useState("San Francisco")
    const [activeTab, setActiveTab] = useState("BUTLRs");
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState("Home Services")

    //TODO getBUTLRServices

    useEffect(() => {
        switch (activeTab) {
            case "BUTLRs":
                setServiceData(localServices);
                break;
            default:
                setServiceData(localServices);
        }
    }, [city, category, activeTab]);

    return (
        <Screen style={tailwind`bg-white flex-1`}>
            <ScreenHeader activeTab={activeTab} setActiveTab={setActiveTab} screenName="Requests"/>
            <SearchBar setCity={setCity} city={city}/>
            <ScrollView style={tailwind`flex-1`} showsVerticalScrollIndicator={false}>
                <Categories setCategory={setCategory}/>
                {loading && <ActivityIndicator size="large" color={colors.primary} style={tailwind`mt-2 mb-6`}/>}
                <ServiceItem serviceData={serviceData}/>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({})

export default RequestsScreen;