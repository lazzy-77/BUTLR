import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { jobs } from '../data/jobsData'
import tailwind from 'tailwind-react-native-classnames';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectTotalPrice, updateBasket } from '../redux/slices/basketSlice';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import colors from '../configs/colors';

const MenuItems = ({ resName, resImage }) => {
    const cartItems = useSelector(selectCartItems)
    const dispatch = useDispatch()
    
    const match = id => {
        const resIndex = cartItems.findIndex(item => item.resName === resName)
        if (resIndex >= 0) {
            const menuIndex = cartItems[resIndex].jobs.findIndex(item => item.id === id)
            if (menuIndex >= 0) return true
            return false
        } return false
    }

    const handleAddRemove = (id) => {
        const indexFromJob = jobs.findIndex(x => x.id === id)
        const resIndex = cartItems.findIndex(item => item.resName === resName)
        const jobItem = jobs[indexFromJob]

        if (resIndex >= 0) {
            const menuIndex = cartItems[resIndex].jobs.findIndex(item => item.id === id)
            if (menuIndex >= 0) {
                let oldArrays = [...cartItems]
                let oldjobs = [...oldArrays[resIndex].jobs]
                oldjobs.splice(menuIndex, 1)
                oldArrays.splice(resIndex, 1)
                let newArray = [...oldArrays, { jobs: oldjobs, resName, resImage }]
                dispatch(updateBasket(newArray))
            } else {
                let oldArrays = [...cartItems]
                let newJobArray = [...oldArrays[resIndex].jobs, jobItem]
                oldArrays.splice(resIndex, 1)
                let updatedResArray = [...oldArrays, { jobs: newJobArray, resName, resImage }]
                dispatch(updateBasket(updatedResArray))
            }
        } else {
            let oldArrays = [...cartItems]
            let newResJobArray = [...oldArrays, {
                jobs: [{ ...jobItem }],
                resName,
                resImage
            }]
            dispatch(updateBasket(newResJobArray))
        }
    }

    return (
        <View style={tailwind`mt-5 mb-12`}>
            {jobs?.map(({ title, description, image, price, id }, index) => (
                <View style={tailwind`mb-3 flex-row justify-between items-center pb-3 border-b border-gray-100`} key={index} >
                    <View style={tailwind`flex-1 pr-3 flex-row items-center`}>
                        {match(id) ? (
                            <BouncyCheckbox fillColor={colors.black} isChecked={true} onPress={() => handleAddRemove(id)} />
                        ) : (
                            <BouncyCheckbox fillColor={colors.black} isChecked={false} onPress={() => handleAddRemove(id)} />
                        )}
                        <View style={tailwind`flex-1 pl-2`}>
                            <Text style={[tailwind`text-gray-900 font-bold mb-1`, { fontSize: 16 }]}>{title}</Text>
                            <Text style={tailwind`text-gray-800 text-xs`}>${price}</Text>
                            <Text style={tailwind`text-gray-600 text-xs`}>{description}</Text>
                        </View>
                    </View>
                    <View style={tailwind``} >
                        <Image style={tailwind`h-16 w-16 rounded-lg`} source={{ uri: image }} />
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({})

export default MenuItems;
