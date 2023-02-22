import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, Alert, ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import ScreenHeader from "../components/ScreenHeader";
import Screen from '../components/Screen'
import Categories from '../components/Categories'
import SearchBar from '../components/SearchBar'
import ServiceItem from "../components/ServiceItem";
import tailwind from 'tailwind-react-native-classnames';
import colors from '../configs/colors'
import {functions, httpsCallable} from '../configs/firebase';
import {GOOGLE_MAP_APIKEY} from "@env"
import {requestPermission} from '../utils/location';
import * as Location from 'expo-location';
import DropDownPicker from "react-native-dropdown-picker";
import {categoriesDropDownList} from "../data/categoriesData";
import {Slider} from '@miblanchard/react-native-slider';


const RequestsScreen = () => {
    const [serviceData, setServiceData] = useState(null);
    const [city, setCity] = useState("San Francisco");
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filterMenuActive, setFilterMenuActive] = useState(false);
    const [categoryDropDownOpen, setCategoryDropDownOpen] = useState(false);
    const [categories, setCategories] = useState(categoriesDropDownList);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [radius, setRadius] = useState(50000);

    //Get user location on initial load
    useEffect(() => {
        if (location === null) {
            handleUseMyLocation();
        }
    }, [])

    //Get service data when location changes
    useEffect(() => {
        setServiceData(null);
        getServiceData(radius, selectedCategories).then(r => {
            //Service data loaded
        })
    }, [location])

    //Get location permission
    useEffect(() => {
        requestPermission().then(r => {
            //Permission granted
        });

    }, [city])

    useEffect(() => {

    }, [serviceData])

    const handleApplyFilters = () => {
        setFilterMenuActive(false);
        getServiceData(radius, selectedCategories).then(r => {
            //Service data loaded
        }).catch(e => {
            console.log(e)
        })
    }

    const handleClearFilters = () => {
        setFilterMenuActive(false);
        setSelectedCategories([]);
        setRadius(50000);
        getServiceData(50000, []).then(r => {
            //Service data loaded
        }).catch(e => {
            console.log(e)
        })
    }

    const getServiceData = async (radius, selectedCategories) => {

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
            },
            categories: selectedCategories ? selectedCategories : [],
            radius: radius ? radius : 50000,
        }
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
            const radius = radius ? radius : 50000;

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
            <View style={tailwind`mx-4 mt-1 h-6 max-h-6 flex flex-row justify-between`}>
                <View style={tailwind`justify-center items-center h-5 rounded-lg`}>
                    <Text style={tailwind`text-sm font-bold text-gray-500`} onPress={() => {
                        if (filterMenuActive) {
                            setFilterMenuActive(false);
                        } else {
                            setFilterMenuActive(true);
                        }
                    }}>
                        Filter
                    </Text>
                </View>
            </View>
            {filterMenuActive &&
                <View style={tailwind`mx-4 z-50`}>
                    <DropDownPicker
                        value={selectedCategories}
                        items={categories}
                        open={categoryDropDownOpen}
                        setValue={setSelectedCategories}
                        setItems={setCategories}
                        setOpen={setCategoryDropDownOpen}
                        multiple={true}
                        placeholder={"Select categories"}
                        multipleText={selectedCategories.length === 1 ? `${selectedCategories.length} category selected` : `${selectedCategories.length} categories selected`}
                        min={0}
                        max={10}
                        style={tailwind`bg-white border border-gray-400`}
                        dropDownContainerStyle={tailwind`bg-white border border-gray-400`}
                        textStyle={tailwind`text-sm font-bold text-gray-500`}
                        labelStyle={tailwind`text-sm font-bold text-gray-500`}
                    />
                    <View style={tailwind`mt-2`}>
                        <Text style={tailwind`text-sm font-bold text-gray-500`}>
                            Radius
                        </Text>
                        <Text style={tailwind`text-sm font-bold text-gray-500`}>
                            {(radius/1000).toFixed(0)} km
                        </Text>
                        <Slider
                            value={radius}
                            onValueChange={value => setRadius(value)}
                            minimumValue={1}
                            maximumValue={100000}
                            step={1}
                        />
                    </View>
                    <View style={tailwind`flex flex-row items-center h-12 justify-between`}>
                        <TouchableOpacity style={styles.apply_button} onPress={handleApplyFilters}>
                            <Text style={tailwind`text-sm font-bold text-white`}>
                                Apply
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.clear_button} onPress={handleClearFilters}>
                            <Text style={tailwind`text-sm font-bold text-gray-500`}>
                                Clear
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            <ScrollView style={tailwind`flex-1`} showsVerticalScrollIndicator={false}>
                {loading && <ActivityIndicator size="large" color={colors.primary} style={tailwind`mt-2 mb-6`}/>}
                {serviceData === null && !loading ?
                    <Text style={tailwind`text-center text-gray-500 mt-2`}>No requests found</Text>
                    :
                    <ServiceItem serviceData={serviceData} userLocation={location}/>}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    apply_button: {
        backgroundColor: colors.green,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '49%',
        height: 30
    },
    clear_button: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.gray,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '49%',
        height: 30
    }
})

export default RequestsScreen;
