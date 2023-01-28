import {View, StyleSheet} from 'react-native';
import tailwind from "tailwind-react-native-classnames";
import AppHead from "../components/AppHead";
import Screen from "../components/Screen";
import * as yup from "yup";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import AppForm from "../components/forms/AppForm";
import AppFormFields from "../components/forms/AppFormFields";
import AppFormDescriptionFields from "../components/forms/AppFormDescriptionFields";
import AppFormJobLocationFields from "../components/forms/AppFormJobLocationFields";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {functions, httpsCallable} from "../configs/firebase";
import colors from "../configs/colors";
import {useNavigation} from "@react-navigation/core";
import * as Location from 'expo-location';

const CreateJobScreen = () => {

    const createJobValidationSchema = yup.object().shape({
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

    const navigation = useNavigation();

    const handleCreateJob = async (values) => {
        // Perform API call or other logic to create the job with the provided data
        Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation
        }).then(async (location) => {
            const coordinates = [location.coords.latitude, location.coords.longitude];
            const job = {...values, location: coordinates};

            const createJob = httpsCallable(functions, 'createJob');
            await createJob(job).then((result) => {
                alert("Job created successfully");
                navigation.navigate("RequestsScreen");
            }).catch((error) => {
                alert(error.message);
            });

            console.log(job)
        })
    }

    return (
        <Screen style={styles.container}>
            <AppHead title="Create Job" icon="create"/>
            <KeyboardAwareScrollView style={styles.wrapper}>
                <View style={styles.form}>
                    <AppForm
                        initialValues={{
                            title: "",
                            category: "",
                            duration: "",
                            pay: "",
                            description: "",
                        }}
                        validationSchema={createJobValidationSchema}
                        onSubmit={({title, category, duration, pay, description}) => {
                            const values = {title, category, duration, pay, description};
                            handleCreateJob(values).then(r => {
                                //Result is already handles in the handleCreateJob function
                            })
                        }}
                    >
                        <AppFormFields
                            name="title"
                            title={"Job Title"}
                            placeholder="Briefly describe the job"
                            keyboardType="text"
                        />
                        <AppFormFields
                            name="category"
                            title={"Job Category"}
                            placeholder="Select a category"
                            keyboardType="text"
                        />
                        <AppFormFields
                            name="duration"
                            title={"Duration"}
                            placeholder="How long will the job take?"
                            keyboardType="text"
                        />
                        <AppFormFields
                            name="pay"
                            title={"Job Pay"}
                            placeholder="How much will you pay?"
                            keyboardType="text"
                        />
                        <AppFormDescriptionFields
                            name="description"
                            title={"Job Description"}
                            placeholder="Describe the job in detail and what needs to be done"
                            keyboardType="text"
                            style={tailwind`h-40`}
                        />
                        <AppSubmitButton title="Create job"/>
                    </AppForm>
                </View>
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
    form: {
        marginTop: 10,
    },
});

export default CreateJobScreen;
