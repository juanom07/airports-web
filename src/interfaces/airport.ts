export interface Airport {
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