import axios from 'axios';
import { Airport } from '../interfaces/airport'

const api_key = '7934d237-6768-4cc7-a162-edd9282a3f51'
const axiosInstance = axios.create({
  // baseURL: 'https://airlabs.co/api/v9/'
  baseURL: 'https://www.air-port-codes.com/api/v1/',
  headers: {
    'APC-Auth': 'ba512207df',
    'APC-Auth-Secret': '1f7b0c043f6b7e7',
  },
});

// export const getAirports = async () => {
//   // const response = await axiosInstance.get(`airports?api_key=${api_key}&country_code=US`);
//   const data = {
//     "request": {
//       "lang": "en",
//       "currency": "USD",
//       "time": 614,
//       "id": "ljm816lm380",
//       "server": "z",
//       "host": "airlabs.co",
//       "pid": 1498553,
//       "key": {
//         "id": 19518,
//         "api_key": "7934d237-6768-4cc7-a162-edd9282a3f51",
//         "type": "free",
//         "expired": "2022-09-13T22:00:00.000Z",
//         "registered": "2022-08-12T17:14:29.000Z",
//         "limits_by_hour": 2500,
//         "limits_by_minute": 250,
//         "limits_by_month": 1000,
//         "limits_total": 1000
//       },
//       "params": {
//         "country_code": "US",
//         "lang": "en"
//       },
//       "version": 9,
//       "method": "airports",
//       "client": {
//         "ip": "179.41.4.68",
//         "geo": {
//           "country_code": "AR",
//           "country": "Argentina",
//           "continent": "South America",
//           "city": "Balcarce",
//           "lat": -37.8462,
//           "lng": -58.2552,
//           "timezone": "America/Argentina/Buenos_Aires"
//         },
//         "connection": {
//           "type": "cable/dsl",
//           "isp_code": 22927,
//           "isp_name": "Telefonica de Argentina"
//         },
//         "device": {},
//         "agent": {},
//         "karma": {
//           "is_blocked": false,
//           "is_crawler": false,
//           "is_bot": false,
//           "is_friend": false,
//           "is_regular": true
//         }
//       }
//     },
//     "response": [
//       {
//         "icao_code": "KMIA",
//         "country_code": "US",
//         "iata_code": "MIA",
//         "lng": -80.29,
//         "name": "Miami International Airport",
//         "lat": 25.79
//       },
//       {
//         "icao_code": "KBWI",
//         "country_code": "US",
//         "iata_code": "BWI",
//         "lng": -76.67,
//         "name": "Baltimore-Washington International Airport",
//         "lat": 39.18
//       },
//       {
//         "icao_code": "KDFW",
//         "country_code": "US",
//         "iata_code": "DFW",
//         "lng": -97.04,
//         "name": "Dallas/Fort Worth International Airport",
//         "lat": 32.9
//       },
//       {
//         "icao_code": "KGSP",
//         "country_code": "US",
//         "iata_code": "GSP",
//         "lng": -82.22,
//         "name": "Greenville-Spartanburg International Airport",
//         "lat": 34.89
//       },
//       {
//         "icao_code": "KLAX",
//         "country_code": "US",
//         "iata_code": "LAX",
//         "lng": -118.41,
//         "name": "Los Angeles International Airport",
//         "lat": 33.94
//       },
//       {
//         "icao_code": "KSDF",
//         "country_code": "US",
//         "iata_code": "SDF",
//         "lng": -85.74,
//         "name": "Louisville International Airport",
//         "lat": 38.17
//       },
//       {
//         "icao_code": "KSJC",
//         "country_code": "US",
//         "iata_code": "SJC",
//         "lng": -121.93,
//         "name": "Norman Y. Mineta San Jose International Airport",
//         "lat": 37.36
//       },
//       {
//         "icao_code": "KONT",
//         "country_code": "US",
//         "iata_code": "ONT",
//         "lng": -117.6,
//         "name": "Ontario International Airport",
//         "lat": 34.06
//       },
//       {
//         "icao_code": "KSLC",
//         "country_code": "US",
//         "iata_code": "SLC",
//         "lng": -111.98,
//         "name": "Salt Lake City International Airport",
//         "lat": 40.79
//       }
//     ],
//     "terms": "Unauthorized access is prohibited and punishable by law. \nReselling data 'As Is' without AirLabs.Co permission is strictly prohibited. \nFull terms on https://airlabs.co/. \nContact us info@airlabs.co"
//   }
//   // return response.data.response.filter((airport: Airport) => airport.iata_code);
//   return data.response
// }

export const getAirportsApi = async (term: string) => {
  const response = await axiosInstance.get(`multi?term=${term}&type=a&countries=us`);

  return response.data.airports;
}

export const getAirports = async () => {
  const response = await axiosInstance.get(`multi?type=a&countries=us`);

  return response.data.airports;
}