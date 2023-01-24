import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import tailwind from 'tailwind-react-native-classnames';
import {GOOGLE_MAP_APIKEY} from "@env"
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import {Ionicons, FontAwesome5} from '@expo/vector-icons';

const SearchBar = ({setCity, city, handleUseMyLocation}) => {

    return (
        <View style={tailwind`flex-row mt-3 px-4 pb-3 border-b border-gray-100 border-b-2`}>
            <GooglePlacesAutocomplete
                placeholder={city || "Search"}
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={400}
                onPress={data => setCity(data.structured_formatting.main_text)}
                minLength={2}
                fetchDetails={true}
                returnKeyType={"search"}
                onFail={error => console.error(error)}
                query={{
                    key: GOOGLE_MAP_APIKEY,
                    language: 'en',
                }}
                styles={{
                    container: {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    textInput: {
                        fontSize: 15,
                        fontWeight: '700',
                        backgroundColor: '#F3F4F6',
                        marginTop: 4
                    },
                    textInputContainer: {
                        backgroundColor: '#F3F4F6',
                        borderRadius: 40,
                        justifyContent: 'center',
                    }
                }}
                enablePoweredByContainer={false}
                renderLeftButton={() => (
                    <View style={tailwind`self-center ml-3`}>
                        <Ionicons name="ios-location-sharp" size={24} color="#CCCCCC"/>
                    </View>
                )}
                renderRightButton={() => (
                    <TouchableOpacity
                        style={tailwind`self-center ml-3 flex-row items-center bg-white py-2 px-3 rounded-full mr-3`}
                        onPress={handleUseMyLocation}>
                        <FontAwesome5 name="search-location" size={13} color="black"/>
                        <Text style={tailwind`text-xs ml-1`}>Use my location</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({})

export default SearchBar;