import axios from 'axios';
import { airportsResponse } from '../mocks/airports'
import { Airport } from '../interfaces/airport'

const api_key = '7934d237-6768-4cc7-a162-edd9282a3f51'
const axiosInstance = axios.create({
  baseURL: 'https://airlabs.co/api/v9/'
});

// export const getAirports = async () => {
//   const response = await axiosInstance.get(`airports?api_key=${api_key}&country_code=US`);
//   return response.data.response.filter((airport: Airport) => airport.iata_code);
// }

export const getAirports = () => {
  return airportsResponse.response.filter((airport: Airport) => airport.iata_code);
}