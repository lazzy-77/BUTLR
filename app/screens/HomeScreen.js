import React, { useEffect, useState } from 'react';
import {StyleSheet, ScrollView, Alert, ActivityIndicator} from 'react-native';
import HeaderTabs from '../components/HeaderTabs';
import Screen from '../components/Screen'
import Categories from '../components/Categories'
import SearchBar from '../components/SearchBar'
import ServiceItem from "../components/ServiceItem";
import tailwind from 'tailwind-react-native-classnames';
import { localServices } from '../data/localServices';
import colors from '../configs/colors'

const YELP_API_KEY = "RF2K7bL57gPbve8oBSiX23GYdCVxIl-KedmS-lyEafEZKNIn6DgsN6j88JvHolhiT4LH-VxT2NvDwgzl9yCTW-5REbbu3Cl5vwqCNUtGhnzzScPinQciOvs6PVBtY3Yx";

const HomeScreen = () => {
    const [serviceData, setServiceData] = useState(localServices)
    const [city, setCity] = useState("San Francisco")
    const [activeTab, setActiveTab] = useState("Delivery");
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState("Home Services")

    const getServicesFromYelp = () => {
        const yelpUrl = `https://api.yelp.com/v3/businesses/search?term=${category}&location=${city}`;

        const apiOptions = {
            headers: {
                Authorization: `Bearer ${YELP_API_KEY}`,
            },
        };
        setLoading(true)
        return fetch(yelpUrl, apiOptions)
            .then((res) => res.json())
            .then((json) => {
                    setLoading(false)
                    if(json.error) return Alert.alert('Sorry', json.error.description);
                    setServiceData(
                        json?.businesses?.filter((business) =>
                            //TODO
                            // business.transactions.includes(activeTab.toLowerCase())
                            business
                            // city.includes(business.location.city)
                        )
                    )
                }
            );
    };

    useEffect(() => {
        getServicesFromYelp();
    }, [city, category]);


    return (
        <Screen style={tailwind`bg-white flex-1`}>
            <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <SearchBar setCity={setCity} city={city} />
            <ScrollView style={tailwind`flex-1`} showsVerticalScrollIndicator={false}>
                <Categories setCategory={setCategory} />
                {loading && <ActivityIndicator size="large" color={colors.primary} style={tailwind`mt-2 mb-6`} />}
                <ServiceItem serviceData={serviceData} />
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({})

export default HomeScreen;