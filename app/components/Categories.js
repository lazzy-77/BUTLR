import React from 'react';
import { StyleSheet, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tailwind from 'twrnc';
import { categoriesData } from '../data/categoriesData'

const Categories = (props) => {
    return (
        <View style={tailwind`mx-3`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categoriesData.map(({ image, text }, index) => (
                    <TouchableOpacity key={index} onPress={() => props.setCategory(text)} style={tailwind`mx-1 my-3 items-center bg-gray-50 px-3 py-2 rounded-lg`}>
                        <Image
                            source={image}
                            style={tailwind`w-10 h-10`}
                        />
                        <Text style={tailwind`text-center mt-1 text-xs`}>{text}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Categories;