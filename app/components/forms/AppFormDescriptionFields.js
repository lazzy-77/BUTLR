import {useFormikContext} from 'formik'
import AppErrorMessage from './AppErrorMessage'
import {StyleSheet, Text, TextInput, View} from 'react-native'
import colors from '../../configs/colors'

export default function AppFormDescriptionFields({
                                                     name,
                                                     title,
                                                     style,
                                                     multiline,
                                                     ...otherProps
                                                 }) {
    const {setFieldTouched, handleChange, errors, touched, values} = useFormikContext()

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
                value={values[name]}
            />
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