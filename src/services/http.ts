import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://www.air-port-codes.com/api/v1/',
  headers: {
    'APC-Auth': 'd3ee3dbfb1',
    'APC-Auth-Secret': '20150f3eed3968e',
  },
});

export const getAirportsApi = async (term: string) => {
  const response = await axiosInstance.get(`multi?term=${term}&type=a&countries=us`);

  return response.data.airports;
}