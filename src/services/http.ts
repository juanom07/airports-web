import axios from 'axios';
import { airportsResponse } from '../mocks/airports'

const api_key = '7934d237-6768-4cc7-a162-edd9282a3f51'
const axiosInstance = axios.create({
  baseURL: 'https://airlabs.co/api/v9/'
});

interface Airport {
  icao_code: string,
  country_code: string,
  iata_code: string,
  lng: number,
  name: string,
  lat: number
}

// interface APIAirportsResponse {
//   data: [Airports]
// }
export const getAirports = () => {
  // const response = axiosInstance.get(`airports?api_key=${api_key}&search=${search}`);

  const response = airportsResponse.response.filter((airport: Airport) => airport.iata_code);

  return response;
}