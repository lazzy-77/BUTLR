import React, { useEffect } from 'react'
import { Image, StyleSheet, View, TouchableWithoutFeedback, Alert } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import colors from '../../configs/colors'

function ImageInput({imageUri, onChangeImage}) {

    const requestPermissions = async () => {
        const { status } = await Promise.all([
            ImagePicker.requestMediaLibraryPermissionsAsync(),
            ImagePicker.requestCameraPermissionsAsync()
        ])
        if (status === 'denied') {
            alert('Sorry, we need camera roll and camera permissions to make this work!');
        }
    }

    useEffect(() => {
        requestPermissions()
    }, [])

    const selectImage = async () =>{
        try {
          const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              quality: 0.5,
              allowsEditing: true,
              aspect: [4, 3],
          })
          if(!result.cancelled) onChangeImage(result.uri)
        } catch (error) {
          console.log("Error Reading an image", error)
        }
    }

    const takePicture = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 0.5,
                allowsEditing: true,
                aspect: [4, 3],
            });
            if (!result.cancelled) onChangeImage(result.uri);
        } catch (error) {
            console.log("Error taking a picture", error);
        }
    };


    const handlePress = () => {
        if(!imageUri) {
            Alert.alert(
                'Select Image',
                'Where would you like to select the image from?',
                [
                    { text: 'Take Picture', onPress: takePicture },
                    { text: 'Gallery', onPress: selectImage },
                    { text: 'Cancel', style: 'cancel' },
                ],
                { cancelable: true },
            );
        }
        else {
            Alert.alert('Delete', 'Are you sure you want to delete this image?', [
                {text: 'yes', onPress: () => onChangeImage(null)},
                {text: 'no'}
            ])
        }
    }


    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.container}>
                {!imageUri ? (<MaterialCommunityIcons name="camera" color={colors.medium} size={35}/>) : 
                (
                    <Image style={styles.image} source={{uri: imageUri}}/>
                )}
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
        height: 100,
        width: 100,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    }
})

export default ImageInput