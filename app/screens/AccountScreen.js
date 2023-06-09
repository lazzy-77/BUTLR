import React, {useState, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import Screen from '../components/Screen'
import tailwind from 'twrnc';
import AppHead from '../components/AppHead';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/slices/authSlice'
import {AntDesign} from '@expo/vector-icons';
import {Ionicons} from '@expo/vector-icons';
import {auth, signOut, ref, storage, updateProfile, uploadBytesResumable, getDownloadURL} from '../configs/firebase';
import ImageInput from "../components/forms/ImageInput";
import CreateDummyData from "../data/createDummyData";

const defaultProfilePic = require('../assets/images/avatar.gif');

const AccountScreen = () => {
    const user = useSelector(selectUser)
    const [photo, setPhoto] = useState(defaultProfilePic);
    const [photoUrl, setPhotoUrl] = useState(null);

    useEffect(() => {
        async function getProfilePic() {
            const fileRef = ref(storage, 'users/' + auth.currentUser.uid + '/profilePic');
            const url = getDownloadURL(fileRef);
            await url.then(r => {
                if (url["_z"] !== undefined) {
                    setPhoto({uri: url["_z"]});
                }
            }).catch(e => {
                console.log(e);
            })
        }

        getProfilePic()
    }, [])

    const uploadProfilePic = async (image, currentUser) => {
        const fileRef = ref(storage, 'users/' + currentUser.uid + '/profilePic');
        const snapshot = uploadBytesResumable(fileRef, image);
        await snapshot;
        const url = getDownloadURL(fileRef);
        await url;
        setPhotoUrl(url["_z"]);
    }

    const onSelectImage = async (image) => {
        const uri = await fetch(image)
        const blob = await uri.blob();

        await uploadProfilePic(blob, auth.currentUser)
            .then(() => {
                setPhoto(image);
                console.log(image)
                updateProfile(auth.currentUser, {photoURL: photoUrl})
                    .then(() => {
                        alert('Profile picture updated successfully')
                    }).catch((error) => {
                    console.log(error);
                })
            }).catch((error) => {
                console.log(error);
            })
    }

    return (
        <Screen style={tailwind`flex-1 bg-white`}>
            <AppHead title={`Account`} icon="settings-outline"/>
            <View style={tailwind`w-full relative`}>
                <View style={tailwind`justify-center items-center `}>
                    <View style={tailwind`rounded-full overflow-hidden w-48 h-48 mt-4`}>
                        <Image
                            source={photoUrl ? {uri: photoUrl} : photo}
                            style={tailwind`w-48 h-48`}
                            key={photo}
                        />
                    </View>
                    <View style={tailwind`absolute top-5 right-5`}>
                        <ImageInput
                            picturesOnly={true}
                            onSelectImage={onSelectImage}
                            multipleFiles={false}
                        />
                    </View>
                    <Text style={tailwind`mt-4 text-3xl font-bold`}>{user?.name}</Text>
                    <Text style={tailwind`text-lg text-indigo-900`}>{user?.email}</Text>
                </View>
            </View>
            <View style={tailwind`mx-4 border-t border-t-2 mt-5 border-gray-100`}>
                <Text style={tailwind`text-gray-800 mt-2 text-lg`}>Other options</Text>
                <TouchableOpacity onPress={() => signOut(auth)}>
                    <Text style={tailwind`text-green-900 mt-2`}>Sign out</Text>
                </TouchableOpacity>
                <CreateDummyData/>
            </View>
        </Screen>
    );
}

export default AccountScreen;
