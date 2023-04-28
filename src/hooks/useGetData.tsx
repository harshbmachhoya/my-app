import { useQuery, UseQueryResult } from 'react-query';
import { rawAPI } from '../api/API';
import { endpoints } from '../constants/api.constant';

export const useGetData = (
): UseQueryResult<[]> =>
    useQuery(endpoints.raw, () => rawAPI.getAllRaws(), {
        retry: false,
        retryOnMount: false,
        refetchOnWindowFocus: false,
        enabled: false,
        onSuccess: (res) => res,
        onError: (error: Error) => error,
    });
