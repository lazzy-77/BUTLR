import React, {useState} from "react";
import {View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ActivityIndicator} from "react-native";
import {Formik} from "formik";
import * as yup from "yup";
import {Picker} from "@react-native-picker/picker";
import colors from "../configs/colors";
import Screen from "../components/Screen";
import AppHead from "../components/AppHead";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import AppButton from "../components/AppButton";
import tailwind from "tailwind-react-native-classnames";
import {categoriesList, displayNameToCategoryMap, categoryToDisplayNameMap} from "../data/categoriesData";
import {useNavigation} from "@react-navigation/core";
import {httpsCallable, functions, storage, ref, uploadBytesResumable, getDownloadURL} from "../configs/firebase";
import * as Location from "expo-location";
import ImageInput from "../components/forms/ImageInput";
import uuid from "react-native-uuid";
import {Video} from "expo-av";

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

const CreateJobScreen = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const onSelectImage = async (images) => {
        setFiles(images)
    }

    const uploadMedia = async (media) => {
        const uri = await fetch(media.uri);
        const blob = await uri.blob();
        const fileRef = ref(storage, 'jobMedia/' + uuid.v4());
        const snapshot = uploadBytesResumable(fileRef, blob);
        await snapshot;
        const url = getDownloadURL(fileRef);
        await url;
        return url;
    }

    const handleCreateJob = async (values) => {
        setLoading(true);
        Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation
        }).then(async (location) => {
            const coordinates = [location.coords.latitude, location.coords.longitude];
            values.category = displayNameToCategoryMap[values.category];

            const media = [];
            if (files.length > 0) {
                for (const file of files) {
                    const url = await uploadMedia(file);
                    media.push(url);
                }
            }

            const job = {
                ...values,
                location: coordinates,
                categoryDisplayName: categoryToDisplayNameMap[values.category],
                media: media
            };

            const createJob = httpsCallable(functions, 'createJob');
            await createJob(job).then((result) => {
                alert("Job created successfully");
                setLoading(false);
                navigation.navigate("RequestsScreen");
            }).catch((error) => {
                alert(error.message);
            });
        })
    }

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
                    onSubmit={({title, category, duration, pay, description}) => {
                        const values = {title, category, duration, pay, description};
                        handleCreateJob(values).then(r => {
                            //Result is already handled in the handleCreateJob function
                        })
                    }}
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
                                        {categoriesList.map((category) => (
                                            <Picker.Item label={category.displayName} value={category.displayName}
                                                         key={category.category}/>
                                        ))}
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
                            <View style={fieldStyles.container}>
                                <Text>Pictures and Videos:</Text>
                                <ImageInput
                                    multipleFiles={true}
                                    picturesOnly={false}
                                    onSelectImage={onSelectImage}
                                />
                                {files?.map(file => {

                                    if (file.type === "video") {
                                        return (
                                            <Video
                                                source={file}
                                                style={tailwind`w-48 h-48`}
                                                key={file.assetId}
                                                useNativeControls
                                                resizeMode="cover"
                                            />
                                        )
                                    }

                                    return (
                                        <Image
                                            source={file}
                                            style={tailwind`w-48 h-48`}
                                            key={file.assetId}
                                        />
                                    )
                                })}
                            </View>
                            {loading && <ActivityIndicator size="large" color={colors.primary} style={tailwind`mt-2 mb-6`}/>}
                            {!loading && <AppButton title="Submit" onPress={handleSubmit}/>}
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

export default CreateJobScreen;