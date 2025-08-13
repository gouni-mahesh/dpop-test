import { QueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { axiosClient  } from '../axiosinstance';
// import * as ApiTypes from '../../types/Avoota';
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useRef } from 'react';
import * as ApiTypes from '../../types/dpop';
import { createKeys, loadKeys } from '../../utils/dpop';
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnMount: false,
    },
  },
});
interface DeviceTokenApiResponse {
  token: string;
}

const getDeviceToken = async (): Promise<string | null> => {
  let token: string | null = localStorage.getItem('deviceToken');

  // Ensure DPoP keys exist before fetching token
  let keys = await loadKeys();
  if (!keys) {
    keys = await createKeys();
  }

  if (!token || typeof token !== 'string') {
    try {
      const { data } = await axiosClient().get<DeviceTokenApiResponse>(
        // 'api/neoteric/generateDeviceToken'
        'api/generate-token'
      );

      token = data?.token || '';

      if (token) {
        localStorage.setItem('deviceToken', token);
        console.log('New token fetched and stored:', token);
      } else {
        console.error('No token found in backend response:', data);
        return null;
      }
    } catch (error) {
      console.error('Error fetching device token:', error);
      return null;
    }
  }

  return token;
};


export const useSaveAccountDetails = () => {
  return useMutation<
    // ApiTypes.ApiResponseObject,
    Error
    // ApiTypes.AccountDetailsRequest
  >({
    mutationFn: async (payload) => {
      const token = await getDeviceToken();
      const { data } = await axiosClient(token).put('/saveProfile', payload);
      queryClient.invalidateQueries({ queryKey: ['accountInfo'] });
      return data;
    },
  });
};

export const useSendOtp = () => {
  // This probably doesn't need auth header, but needs deviceToken in body
  return useMutation<ApiTypes.ApiResponseString, Error, ApiTypes.SignupRequest>(
    {
      mutationFn: async (payload) => {
        const token = await getDeviceToken();
        // No setAuthHeader needed if API doesn't expect it here
        const { data } = await axiosClient(token).post('/signup', payload);
        return data;
      },
    }
  );
};

export const useTestDpop = () => {
  return useMutation({
    mutationFn: async () => {
      const token = await getDeviceToken(); // get your device/access token
      const { data } = await axiosClient(token).get('/api/protected/hello'); 
      // no payload since it's a GET request
      queryClient.invalidateQueries({ queryKey: ['dpopTest'] });
      return data;
    },
  });
};