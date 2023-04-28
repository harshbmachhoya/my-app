import { endpoints } from '../constants/api.constant';
import { apiQuery } from '../utils/apiQuery';

// APIs
export const rawAPI = {
    getAllRaws: async (): Promise<any[]> => {
        const { data } = await apiQuery.get(endpoints.raw);
        return data;
    },
    getAllApplications: async (appValue:string|undefined): Promise<any[]> => {
        const { data } = await apiQuery.get(`${endpoints.application}/${appValue}`);        
        return data;
    },
    getAllResources: async (resValue:string|undefined): Promise<any[]> => {
        const { data } = await apiQuery.get(`${endpoints.resources}/${resValue}`);        
        return data;
    }
};
