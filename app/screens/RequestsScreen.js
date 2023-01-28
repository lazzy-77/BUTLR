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
import {GOOGLE_MAP_APIKEY} from "@env"
import { requestPermission,  getUserLocation} from '../utils/location';

const RequestsScreen = () => {
    const [serviceData, setServiceData] = useState(localServices);
    const [city, setCity] = useState("San Francisco");
    const [location, setLocation] = useState(null);
    const [activeTab, setActiveTab] = useState("BUTLRs");
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("Home Services");

    useEffect(() => {
        requestPermission().then(r => {
            //Permission granted
        });
        switch (activeTab) {
            case "BUTLRs":
                setServiceData(localServices);
                break;
            default:
                setServiceData(localServices);
        }
    }, [city, category, activeTab]);

    const handleUseMyLocation = async () => {
        setLoading(true);
        // Coordinates of the location you want to search near
        let currentLocation = await getUserLocation();
        setLocation(currentLocation);

        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        // Search radius in meters
        const radius = 50000;

        // Make a GET request to the Google Places API
        fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=town&key=${GOOGLE_MAP_APIKEY}`)
            .then(response => response.json())
            .then(data => {
                // The API returns an array of nearby places
                const places = data.results;

                // Find the first place that has the "locality" or "political" type
                const nearestTown = places.find(place => place.types.includes("locality") || place.types.includes("political"));

                // Log the name of the nearest town
                console.log(nearestTown.name);
                setCity(nearestTown.name);

                setLoading(false);
            })
            .catch(error => console.error(error));
    }

    return (
        <Screen style={tailwind`bg-white flex-1`}>
            <ScreenHeader activeTab={activeTab} setActiveTab={setActiveTab} screenName="Requests"/>
            <SearchBar setCity={setCity} city={city} handleUseMyLocation={handleUseMyLocation} location={location}/>
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
