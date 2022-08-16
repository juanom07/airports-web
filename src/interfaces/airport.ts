export interface Airport {
  icao_code: string,
  country_code: string,
  iata_code: string,
  lng: number,
  name: string,
  lat: number
}

export interface NewAirport {
  name: string,
  city: string,
  iata: string,
  latitude: string,
  longitude: string,
  country: {
    name: string,
    iso: string
  },
  state: {
    name: string,
    abbr: string,
    type: string,
  }
}