import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, Alert, ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import ScreenHeader from "../components/ScreenHeader";
import Screen from '../components/Screen'
import Categories from '../components/Categories'
import SearchBar from '../components/SearchBar'
import ServiceItem from "../components/ServiceItem";
import tailwind from 'tailwind-react-native-classnames';
import {localServices} from '../data/localServices';
import colors from '../configs/colors'
import {functions, httpsCallable, db, doc, getDocs,} from '../configs/firebase';
import {GOOGLE_MAP_APIKEY} from "@env"
import {requestPermission} from '../utils/location';
import * as Location from 'expo-location';


const RequestsScreen = () => {
    const [serviceData, setServiceData] = useState(null);
    const [city, setCity] = useState("San Francisco");
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("Home Services");

    //Get user location on initial load
    useEffect(() => {
        handleUseMyLocation();
    }, [])

    //Get service data when location changes
    useEffect(() => {
        setServiceData(null);
        getServiceData().then(r => {
            //Service data loaded
        })
    }, [location])


    //Get location permission
    useEffect(() => {
        requestPermission().then(r => {
            //Permission granted
        });

    }, [city, category])

    const getServiceData = async () => {

        if (location === null) {
            return;
        }

        setLoading(true);

        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        const object = {
            location: {
                latitude: latitude,
                longitude: longitude
            }
        }
        console.log("SENDING OBJECT: ", object);
        const getJobsWithRadius = httpsCallable(functions, 'getJobsWithRadius');
        await getJobsWithRadius(object).then((result) => {
            if (result.data.length === 0) {
                Alert.alert("No results found", "Try a different location, category or radius");
                setServiceData(null);
            } else {
                setServiceData(result.data);
            }
        });
        setLoading(false);
    }

    const handleUseMyLocation = () => {
        setLoading(true);
        // Coordinates of the location you want to search near
        Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation
        }).then((location) => {
            setLocation(location);
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
        }).catch((error) => {
            Alert.alert("Error", "Please check your internet connection and try again." + error);
            setLoading(false);
            console.log(error);
        })
    }

    return (
        <Screen style={tailwind`bg-white flex-1`}>
            <ScreenHeader screenName="Requests"/>
            <SearchBar
                setCity={setCity}
                city={city}
                handleUseMyLocation={handleUseMyLocation}
                location={location}
                setLocation={setLocation}
            />
            <ScrollView style={tailwind`flex-1`} showsVerticalScrollIndicator={false}>
                <Categories setCategory={setCategory}/>
                {loading && <ActivityIndicator size="large" color={colors.primary} style={tailwind`mt-2 mb-6`}/>}
                {serviceData === null && !loading ? <Text style={tailwind`text-center text-gray-500 mt-2`}>No requests found</Text>
                    :
                    <ServiceItem serviceData={serviceData} userLocation={location}/>}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({})

export default RequestsScreen;
