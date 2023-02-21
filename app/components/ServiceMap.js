import React, {useEffect, useRef} from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import tailwind from 'tailwind-react-native-classnames';
import { Entypo } from '@expo/vector-icons';

const ServiceMap = ({ coordinates, title, returnToPin, setReturnToPin }) => {
    const mapRef = useRef(null)

    useEffect(() => {
        if (returnToPin) {
            mapRef.current.animateToRegion({
                ...coordinates,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }, 1000)
            setReturnToPin(false);
        }
    }, [returnToPin])

    return (
        <View style={[tailwind`bg-blue-300 relative `, { height: 250 }]}>
            <MapView
                initialRegion={{
                    ...coordinates,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
                showsUserLocation={true}
                ref={mapRef}
                style={tailwind`h-full z-10`}
            >
                {coordinates && (
                    <Marker
                        coordinate={{
                            ...coordinates
                        }}
                        identifier="job"
                        anchor={{ x: 0.5, y: 0.5 }}
                        title={title}
                    >
                        <Entypo name="location-pin" size={24} color="black" />
                    </Marker>
                )}
            </MapView >
        </View >
    );
}

const styles = StyleSheet.create({})

export default ServiceMap;