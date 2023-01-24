import React, { useState } from 'react'
import { useFormikContext } from 'formik'
import { AntDesign } from '@expo/vector-icons';
import AppErrorMessage from './AppErrorMessage'
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import colors from '../../configs/colors'

export default function AppFormFields({name, password = false, title, style, multiline, dropdown, dropdownValues, ...otherProps}) {
    const [showPassword, setShowPassword] = useState(password)
    const {setFieldTouched, handleChange, errors, touched, values } = useFormikContext()

    if (multiline) {
        return (
            <View style={styles.container}>
                {title && <Text style={styles.title}>{title}</Text>}
                <TextInput
                    onBlur={() => setFieldTouched(name)}
                    onChangeText={handleChange(name)}
                    multiline={true}
                    {...otherProps}
                    style={[
                        styles.input,
                        (touched[name] && errors[name]) && {borderColor: colors.danger},
                        style
                    ]}
                    secureTextEntry={showPassword}
                    value={values[name]}
                />
                {password && (
                    <TouchableOpacity style={styles.icon} onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                            <AntDesign name="eye" size={24} color={colors.black}/>
                        ) : (
                            <AntDesign name="eyeo" size={24} color={colors.black}/>
                        )}
                    </TouchableOpacity>
                )}
                <AppErrorMessage visible={touched[name]} error={errors[name]}/>
            </View>
        )
    }

    else {
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
                    secureTextEntry={showPassword}
                    value={values[name]}
                />
                {password && (
                    <TouchableOpacity style={styles.icon} onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                            <AntDesign name="eye" size={24} color={colors.black}/>
                        ) : (
                            <AntDesign name="eyeo" size={24} color={colors.black}/>
                        )}
                    </TouchableOpacity>
                )}
                <AppErrorMessage visible={touched[name]} error={errors[name]}/>
            </View>
        )
    }
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