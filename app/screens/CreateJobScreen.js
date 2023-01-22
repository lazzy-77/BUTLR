import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';

const CreateRequestScreen = () => {
    const [requestName, setRequestName] = useState('');
    const [description, setDescription] = useState('');
    const [timeLength, setTimeLength] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    const handleImageUpload = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                setImage(response);
            }
        });
    }

    const handleCreateRequest = () => {
        // Perform API call or other logic to create the request with the provided data
    }

    return (
        <View>
            <Text>Request Name:</Text>
            <TextInput value={requestName} onChangeText={setRequestName} />
            <Text>Description:</Text>
            <TextInput value={description} onChangeText={setDescription} />
            <Text>Time Length:</Text>
            <TextInput value={timeLength} onChangeText={setTimeLength} />
            <Text>Price:</Text>
            <TextInput value={price} onChangeText={setPrice} />
            <TouchableOpacity onPress={handleImageUpload}>
                <Text>Upload Image</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
            <TouchableOpacity onPress={handleCreateRequest}>
                <Text>Create Request</Text>
            </TouchableOpacity>
        </View>
    );
}

export default CreateRequestScreen;
