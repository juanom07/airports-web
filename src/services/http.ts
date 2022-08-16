import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://www.air-port-codes.com/api/v1/',
  headers: {
    'APC-Auth': 'ba512207df',
    'APC-Auth-Secret': '1f7b0c043f6b7e7',
  },
});

export const getAirportsApi = async (term: string) => {
  const response = await axiosInstance.get(`multi?term=${term}&type=a&countries=us`);

  return response.data.airports;
}