import React from "react";
import {Alert, Image, StyleSheet, Text, View} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AppForm from "../components/forms/AppForm";
import Screen from "../components/Screen";
import colors from "../configs/colors";
import * as yup from "yup";
import AppFormFields from "../components/forms/AppFormFields";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import { auth, createUserWithEmailAndPassword } from "../configs/firebase";
import tailwind from 'tailwind-react-native-classnames';

const loginValidationSchema = yup.object().shape({
    name: yup
        .string()
        .min(3, ({min}) => `Name must be at least ${min} characters`)
        .max(50, ({max}) => `Name must be less then ${max} characters`)
        .required("Name is Required"),
    email: yup
        .string()
        .email("Please enter valid email")
        .required("Email Address is Required"),
    password: yup
        .string()
        .min(8, ({min}) => `Password must be at least ${min} characters`)
        .required("Password is required"),
});

function SignupScreen({navigation}) {

    const signUpUser = ({name, email, password}) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                result.user
                    .updateProfile({displayName: name})
                    .then(() => {
                        // User account created & signed in!
                    })
                    .catch((err) => {
                        Alert.alert("Error", err.message)
                    });
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    Alert.alert("Error", "That email address is already in use!")
                }

                if (error.code === "auth/invalid-email") {
                    Alert.alert("Error", "That email address is invalid!")
                }

                Alert.alert('ERROR: ', error.message);
            });
    };

    return (
        <Screen style={styles.container}>
                <KeyboardAwareScrollView style={styles.wrapper}>
                    <View style={tailwind`py-4 rounded-2xl`}>
                        <Image style={styles.logo} source={require("../assets/logo.png")}/>
                    </View>
                    <Text style={styles.welcomeTo}>
                        Join to <Text style={styles.brand}>BUTLR</Text>
                    </Text>
                    <View style={styles.form}>
                        <AppForm
                            initialValues={{name: "", email: "", password: ""}}
                            validationSchema={loginValidationSchema}
                            onSubmit={(values) => signUpUser(values)}
                        >
                            <AppFormFields
                                name="name"
                                placeholder="Your name"
                            />
                            <AppFormFields
                                name="email"
                                placeholder="Your email"
                                keyboardType="email-address"
                            />
                            <AppFormFields
                                name="password"
                                placeholder="Password"
                                autoCompleteType="off"
                                password={true}
                            />
                            <AppSubmitButton title="Sign Up"/>
                        </AppForm>
                    </View>

                    <Text style={styles.join}>
                        Already a member?{" "}
                        <Text
                            onPress={() => navigation.navigate("UserLogin")}
                            style={{color: colors.primary}}
                        >
                            Log In
                        </Text>
                    </Text>
                </KeyboardAwareScrollView>
        </Screen>
    );
}

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
    logo: {
        height: 160,
        resizeMode: "contain",
        alignSelf: "center",
        marginTop: 30,
    },
    welcomeTo: {
        fontSize: 23,
        fontWeight: "700",
        color: colors.secondary,
        marginTop: 20,
        textAlign: "center",
    },
    brand: {
        fontSize: 23,
        color: colors.primary,
        textAlign: "center",
        fontWeight: "500",
    },
    form: {
        marginTop: 10,
    },
    join: {
        marginTop: 16,
        textAlign: "center",
        color: colors.black,
    },
    or: {
        color: colors.gray,
        textAlign: "center",
        marginVertical: 20,
    },
});

export default SignupScreen;