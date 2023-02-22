import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { faker } from '@faker-js/faker';
import { functions, httpsCallable } from '../configs/firebase';
import {categoriesList, categoryToDisplayNameMap} from "./categoriesData";

const CreateDummyData = () => {

    const categories = categoriesList.map(category => category.category);
    const categoriesDisplayNames = categoriesList.map(category => category.displayName);
    const createDummyData = async () => {
        for (let i = 0; i < 10; i++) {
            const title = faker.commerce.productName();
            const description = faker.commerce.productDescription();
            const category = faker.helpers.arrayElement(categories)
            const categoryDisplayName = categoryToDisplayNameMap[category];
            const location = faker.address.nearbyGPSCoordinate([54.607868, -5.926437], 25, true);
            const duration = `${faker.datatype.number({min: 15, max: 480})} mins`;
            const pay = `${faker.datatype.number({min: 10, max: 100})} ${faker.helpers.arrayElement(["per hour", "per item", "for job"])}`;
            const media = [];
            for (let j = 0; j < 3; j++) {
                const mediaObject = {
                    uri: faker.image.cats(),
                    type: 'image',
                }
                media.push(mediaObject);
            }

            const job = {
                title,
                description,
                category,
                categoryDisplayName,
                location,
                duration,
                pay,
                media
            };

            console.log(job)

// Use Firebase Functions to hit endpoint and upload data
            const createJob = httpsCallable(functions, "createJob");

            createJob(job).then((result) => {
                console.log(`Data for ${job.title} uploaded successfully!`);
            }).catch(err => {
                console.error(err);
            });
        }
    }

    return (
        <TouchableOpacity onPress={createDummyData}>
            <Text>Add dummy job requests from this account</Text>
        </TouchableOpacity>
    );
}

export default CreateDummyData;
