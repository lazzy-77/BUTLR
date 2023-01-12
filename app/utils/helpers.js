import { Alert } from 'react-native'
import { STRIPE_API_URL } from '../configs/apiEndpoints'

export const getAllCartJobs = (items) => {
    let allJobs = []
    const jobsData = items.map(x => x.jobs)
    jobsData.map(job => {
        job.map(x => {
            allJobs = [...allJobs, x]
        })
    })
    return allJobs
}

export const getTotalCartItemPrice = (items) => {
    let allJobs = []
    const jobsData = items.map(x => x.jobs)
    jobsData.map(job => {
        job.map(x => {
            allJobs = [...allJobs, x]
        })
    })
    return allJobs.reduce((total, item) => total + item.price, 0).toFixed(1)
}


export const fetchPublishableKey = async () => {
    try {
        const response = await fetch(
            `${STRIPE_API_URL}/stripe-key`
        );

        const { publishableKey } = await response.json();

        return publishableKey;
    } catch (e) {
        console.warn('Unable to fetch publishable key. Is your server running?');
        Alert.alert(
            'Error',
            'Unable to fetch publishable key. Is your server running?'
        );
        return null;
    }
}
