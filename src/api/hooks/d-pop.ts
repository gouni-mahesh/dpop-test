import { QueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { axiosClient  } from '../axiosinstance';
// import * as ApiTypes from '../../types/Avoota';
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useRef } from 'react';
import * as ApiTypes from '../../types/dpop';
import { createDPoPProof, createKeys, loadKeys } from '../../utils/dpop';
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
  access_token: string;
  token_type: string;
  expires_in: number;
  cnf: {
    jkt: string;
  };
}


const getDeviceToken = async (): Promise<string | null> => {
  let token: string | null = localStorage.getItem('deviceToken');

  // Load or create DPoP keys
  let keys = await loadKeys();
  if (!keys) keys = await createKeys();

  if (!token) {
    try {
      // Generate a DPoP proof BEFORE fetching token
      const proof = await createDPoPProof({
        privateKey: keys.privateKey,
        publicJwk: keys.publicJwk,
        htm: 'GET',
        htu: 'http://localhost:10008/api/token',
      });

      const { data } = await axios.get<DeviceTokenApiResponse>(
        'http://localhost:10008/api/token',
        {
          headers: {
            'Content-Type': 'application/json',
            'DPoP': proof,
            'X-Correlation-Id': `${Date.now()}`,
          },
        }
      );

      token = data?.access_token || '';
      if (token) {
        localStorage.setItem('deviceToken', token);
        console.log('New token fetched and stored:', token);
      } else {
        console.error('No access_token in response', data);
        return null;
      }
    } catch (err) {
      console.error('Error fetching token:', err);
      return null;
    }
  }

  return token;
};



export const useTestDpop = () => {
  return useMutation({
    mutationFn: async () => {
      // Get or generate a device token (with proper DPoP proof)
      
      const token = await getDeviceToken();
      console.log("Device token generated:", token);

      if (!token) {
        throw new Error("Device token not available");
      }

      // Use axiosClient with token → automatically adds DPoP proof header
      const { data } = await axiosClient(token).get('/api/hello');
      return data;
    },
  });
};
