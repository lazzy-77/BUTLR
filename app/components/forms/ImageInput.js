import React, {useEffect} from 'react'
import {Image, StyleSheet, View, TouchableWithoutFeedback, Alert, Text} from 'react-native'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import colors from '../../configs/colors'

//Props list:
//onSelectImage: function to be called when image is selected
//PicturesOnly: boolean to specify if only pictures should be selected
//multipleFiles: boolean to specify if multiple files should be selected
const ImageInput = (props) => {
    const requestPermissions = async () => {
        const {status} = await Promise.all([
            ImagePicker.requestMediaLibraryPermissionsAsync(),
            ImagePicker.requestCameraPermissionsAsync()
        ])
        if (status === 'denied') {
            alert('Sorry, we need camera roll and camera permissions to make this work!');
        }
    }

    useEffect(() => {
        requestPermissions().then(r => {
            //Permission granted
        })
    }, [])

    const selectImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: props.picturesOnly ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.All,
                quality: 0.5,
                allowsMultipleSelection: props.multipleFiles === true,
            })
            if (!result.canceled) props.onSelectImage(result.assets[0].uri)
        } catch (error) {
            console.log("Error Reading an image", error)
        }
    }

    const takePicture = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: props.picturesOnly ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.All,
                quality: 0.5,
            });
            if (!result.canceled) props.onSelectImage(result.assets[0].uri);
        } catch (error) {
            console.log("Error taking a picture", error);
        }
    };


    const handlePress = () => {
        Alert.alert(
            'Select Image',
            'Where would you like to select the image from?',
            [
                {text: 'Take Picture', onPress: takePicture},
                {text: 'Gallery', onPress: selectImage},
                {text: 'Cancel', style: 'cancel'},
            ],
            {cancelable: true},
        );
    }

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.container}>
                <MaterialCommunityIcons name="camera" color={colors.medium} size={35}/>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.light,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 50,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    }
})

export default ImageInput