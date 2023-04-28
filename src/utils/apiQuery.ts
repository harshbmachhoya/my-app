import axios from 'axios';
import { baseURLs } from '../constants/api.constant';

const baseURL = baseURLs.csc;
const baseInstance = {
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
};

export const apiQuery = axios.create({
    baseURL,
    ...baseInstance,
});
