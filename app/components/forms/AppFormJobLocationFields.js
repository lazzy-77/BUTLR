import {useFormikContext} from 'formik'
import AppErrorMessage from './AppErrorMessage'
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import colors from '../../configs/colors'
import tailwind from "tailwind-react-native-classnames";
import {FontAwesome5} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {getUserLocation} from "../../utils/location";

export default function AppFormJobLocationFields({
                                          name,
                                          title,
                                          style,
                                          ...otherProps
                                      }) {
    const {setFieldTouched, handleChange, errors, touched, values} = useFormikContext()

    const [location, setLocation] = useState(values[name]);

    const getLocation = async () => {
        const location = await getUserLocation();
        const {latitude, longitude} = location.coords;
        setLocation(`${latitude}, ${longitude}`);
        values[name] = location;
    }

    useEffect(() => {

    }, [values[name]])

    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            <TextInput
                onBlur={() => setFieldTouched(name)}
                onChangeText={handleChange(name)}
                {...otherProps}
                style={[
                    styles.input,
                    (touched[name] && errors[name]) && {borderColor: colors.danger},
                ]}
                value={values[name]}
            >
            </TextInput>
            <TouchableOpacity
                style={tailwind`self-center ml-3 flex-row items-center bg-white py-2 px-3 rounded-full mr-3`}
                onPress={getLocation}
            >
                <FontAwesome5 name="search-location" size={13} color="black"/>
                <Text style={tailwind`text-xs ml-1`}>Use my location</Text>
            </TouchableOpacity>
            <AppErrorMessage visible={touched[name]} error={errors[name]}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginBottom: 20
    },
    input: {
        borderColor: colors.medium,
        backgroundColor: colors.light,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 15
    },
    inputError: {
        borderColor: colors.danger
    },
    icon: {
        position: 'absolute',
        right: 15,
        top: 32
    }
})