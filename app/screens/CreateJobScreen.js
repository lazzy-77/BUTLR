import React, {useState} from "react";
import {View, Text, TouchableOpacity, TextInput, Button, ScrollView, StyleSheet} from "react-native";
import {Formik} from "formik";
import * as yup from "yup";
import {Picker} from "@react-native-picker/picker";
import colors from "../configs/colors";
import Screen from "../components/Screen";
import AppHead from "../components/AppHead";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import AppButton from "../components/AppButton";
import tailwind from "tailwind-react-native-classnames";

const FieldErrorMessage = ({error, visible}) => {
    if (!error || !visible) return null;
    return <Text style={{color: "red"}}>{error}</Text>;
}

const validationSchema = yup.object().shape({
    title: yup
        .string()
        .required("Job title is required"),
    category: yup
        .string()
        .required("Job category is required"),
    duration: yup
        .string()
        .required("Job length is required"),
    pay: yup
        .string()
        .required("Job pay is required"),
    description: yup
        .string()
        .required("Job description is required"),
});

const FormExample = () => {
    const [showCategories, setShowCategories] = useState(false);

    return (
        <Screen style={styles.container}>
            <AppHead title="Create Job" icon="create"/>
            <KeyboardAwareScrollView style={styles.wrapper}>
                <Formik
                    initialValues={{
                        title: "",
                        category: "",
                        duration: "",
                        pay: "",
                        description: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => console.log(values)}
                >
                    {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                        <View>
                            <View style={fieldStyles.container}>
                                <Text>Title:</Text>
                                <TextInput
                                    placeholder={"e.g. 'Need a babysitter'"}
                                    onChangeText={handleChange("title")}
                                    onBlur={handleBlur("title")}
                                    value={values.title}
                                    style={fieldStyles.input}
                                />
                                <FieldErrorMessage error={errors.title} visible={touched.title}/>
                            </View>
                            <View style={fieldStyles.container}>
                                <Text>Category:</Text>
                                <TouchableOpacity
                                    style={fieldStyles.input}
                                    onPress={() => setShowCategories(!showCategories)}
                                >
                                    <Text>{values.category || "Select a category"}</Text>
                                </TouchableOpacity>
                                {showCategories && (
                                    <Picker
                                        selectedValue={values.category}
                                        onValueChange={(itemValue) => {
                                            handleChange("category")(itemValue);
                                            setShowCategories(false);
                                        }}
                                    >
                                        <Picker.Item label="Option 1" value="Option 1"/>
                                        <Picker.Item label="Option 2" value="Option 2"/>
                                        <Picker.Item label="Option 3" value="Option 3"/>
                                    </Picker>
                                )}
                                <FieldErrorMessage error={errors.category} visible={touched.category}/>
                            </View>
                            <View style={fieldStyles.container}>
                                <Text>Duration:</Text>
                                <TextInput
                                    onChangeText={handleChange("duration")}
                                    onBlur={handleBlur("duration")}
                                    value={values.duration}
                                    style={fieldStyles.input}
                                    placeholder={"e.g. '1 hour'"}
                                />
                                <FieldErrorMessage error={errors.duration} visible={touched.duration}/>
                            </View>
                            <View style={fieldStyles.container}>
                                <Text>Pay:</Text>
                                <TextInput
                                    onChangeText={handleChange("pay")}
                                    onBlur={handleBlur("pay")}
                                    value={values.pay}
                                    style={fieldStyles.input}
                                    placeholder={"e.g. '£10 per hour' or '£100 for job'"}
                                />
                                <FieldErrorMessage error={errors.pay} visible={touched.pay}/>
                            </View>
                            <View style={fieldStyles.container}>
                                <Text>Description:</Text>
                                <TextInput
                                    onChangeText={handleChange("description")}
                                    onBlur={handleBlur("description")}
                                    value={values.description}
                                    style={[
                                        fieldStyles.input,
                                        tailwind`h-40`
                                    ]}
                                    multiline={true}
                                    placeholder={"e.g. 'Baby sit 2 children, 1 year old and 3 year old'"}
                                />
                                <FieldErrorMessage error={errors.description} visible={touched.description}/>
                            </View>
                            <AppButton title="Submit" onPress={handleSubmit}/>
                        </View>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        justifyContent: 'center',
        flex: 1
    },
    wrapper: {
        paddingHorizontal: 20,
        flex: 1
    },
    form: {
        marginTop: 10,
    },
});

const fieldStyles = StyleSheet.create({
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
        marginTop: 15,
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

export default FormExample;