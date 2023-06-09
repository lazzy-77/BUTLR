import React from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AppForm from "../components/forms/AppForm";
import Screen from "../components/Screen";
import colors from "../configs/colors";
import * as yup from "yup";
import AppFormFields from "../components/forms/AppFormFields";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import { auth, signInWithEmailAndPassword } from "../configs/firebase";
import tailwind from 'twrnc';

const loginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .email("Please enter valid email")
        .required("Email Address is Required"),
    password: yup
        .string()
        .min(8, ({ min }) => `Password must be at least ${min} characters`)
        .required("Password is required"),
});

function LoginScreenUser({ navigation }) {

    const LoginUser = ({ email, password }) => {
        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                if (error.code === "auth/invalid-password") {
                    Alert.alert("Error", "Invalid password!")
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
                    <Image style={styles.logo} source={require("../assets/logo.png")} />
                </View>
                <Text style={styles.welcomeTo}>
                    Login to <Text style={styles.brand}>BUTLER</Text>
                </Text>
                <View style={styles.form}>
                    <AppForm
                        initialValues={{ email: "", password: "" }}
                        validationSchema={loginValidationSchema}
                        onSubmit={(values) => LoginUser(values)}
                    >
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
                        <AppSubmitButton title="Login" />
                    </AppForm>
                </View>

                <Text style={styles.join}>
                    Not a member?{" "}
                    <Text
                        onPress={() => navigation.navigate("Signup")}
                        style={{ color: colors.primary }}
                    >
                        Sign Up
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

export default LoginScreenUser;