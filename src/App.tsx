/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './index.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getAirports } from './services/http'
import { Wrapper } from "@googlemaps/react-wrapper";
import { calcCrow, middlePoint } from './utils/helpers';
import { Airport } from './interfaces/airport';
import airplane from './assets/airplane.png';
function App() {
  const [usAirports, setUsAirports] = useState<Airport[] | []>([]);
  
  const [valueFrom, setValueFrom] = useState<Airport | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const [valueTo, setValueTo] = useState<Airport | null>(null);
  const [inputValueTo, setInputValueTo] = useState('');
  
  const [distance, setDistance] = useState<number | null>();
  const [map, setMap] = useState<google.maps.Map>();
  const [line, setLine] = useState<google.maps.Polyline>();
  const [markerFrom, setMarkerFrom] = useState<google.maps.Marker>();
  const [markerTo, setMarkerTo] = useState<google.maps.Marker>();
  
  useEffect(() => {
    if (valueFrom) {
      markerFrom && (markerFrom as google.maps.Marker).setMap(null)
      const positionFrom = new google.maps.LatLng(valueFrom.lat, valueFrom.lng)
      setMarkerFrom(new google.maps.Marker({
        position: positionFrom,
          map: map,
          title: valueFrom.name,
          icon: airplane,
      }));
    }else{
      markerFrom && (markerFrom as google.maps.Marker).setMap(null)
      line && (line as google.maps.Polyline).setMap(null)
      setDistance(null)
    }
  }, [valueFrom]);

  useEffect(() => {
    if (valueTo) {
      markerTo && (markerTo as google.maps.Marker).setMap(null)
      const positionFrom = new google.maps.LatLng(valueTo.lat, valueTo.lng)
      setMarkerTo(new google.maps.Marker({
        position: positionFrom,
          map: map,
          title: valueTo.name,
          icon: airplane,
      }));
    }else{
      markerTo && (markerTo as google.maps.Marker).setMap(null)
      line && (line as google.maps.Polyline).setMap(null)
      setDistance(null)
    }
  }, [valueTo]);

  useEffect(() => {
    if (valueFrom && valueTo) {
      const cal = calcCrow(valueFrom.lat, valueFrom.lng, valueTo.lat, valueTo.lng);
      setDistance(cal)
      
      const positionFrom = new google.maps.LatLng(valueFrom.lat, valueFrom.lng)
      const positionTo = new google.maps.LatLng(valueTo.lat, valueTo.lng)
      
      const newCenter: any = middlePoint(valueFrom.lat, valueFrom.lng, valueTo.lat, valueTo.lng);
      (map as google.maps.Map).setCenter(new google.maps.LatLng(newCenter.lat, newCenter.lng));

      line && (line as google.maps.Polyline).setMap(null)
      const newLine = new google.maps.Polyline({
          path: [positionFrom, positionTo],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 3,
      });

      newLine.setMap(map as google.maps.Map);
      setLine(newLine)
    }else{
      setDistance(null)
    }
  }, [valueFrom, valueTo]);

  useEffect(() => {
    const domMap = document.getElementById('map');
    if (usAirports.length > 0 && !map && domMap){
      const mapa = new window.google.maps.Map(domMap as HTMLElement, {
        center,
        zoom: 4,
      });
  
      setMap(mapa);
    }
  }, [usAirports, map]);

  useEffect(() => {
    getAirportsFromApi();
  }, []);

  const getAirportsFromApi = async () => {
    const data: Airport[]  = await getAirports();
    setUsAirports(data);
  }

  const center: google.maps.LatLngLiteral = {lat: 39.7578721, lng: -101.4895165};
  return (
    <div className="flex flex-col md:p-20 p-5 h-screen bg-dark-blue md:items-start items-center">
      <h1 className="md:text-3xl text-2xl font-bold text-white">Airports distance calculator</h1>
      <div className="md:flex md:justify-between md:mt-12 mt-4 h-full w-full">
        <div className="md:w-1/3 w-full text-white flex flex-col ">
          <div className="rounded-xl bg-white p-4">
            <Autocomplete
              className=""
              onChange={(event: any, newValue: any) => {
                setValueFrom(newValue);
              }}
              value={valueFrom}
              inputValue={inputValue} 
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              id="airport-from"
              options={usAirports}    
              getOptionLabel={ (option: string | Airport) => `${(option as Airport).iata_code || 'IATA Code'} - ${(option as Airport).name || 'Airport Name'}`}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="From" />}
            />
            <Autocomplete
              className="mt-10 w-full"
              value={valueTo}
              onChange={(event: any, newValue: any) => {
                setValueTo(newValue);
              }}
              inputValue={inputValueTo}
              onInputChange={(event, newInputValue) => {
                setInputValueTo(newInputValue);
              }}
              id="airport-to"
              options={usAirports}
              getOptionLabel={ (option: string | Airport) => `${(option as Airport).iata_code || 'IATA Code'} - ${(option as Airport).name || 'Airport Name'}`}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="To" />}
            />
            
          </div>
            {distance && valueFrom && valueTo && 
              <div className="rounded-xl mt-4 bg-white p-4">
                <div className="text-dark-blue w-full">
                  <p className="mb-2 text-xl font-bold">Distance information:</p>
                  <p className="ml-4"><strong>From:</strong> {(valueFrom as Airport).name}</p>
                  <p className="ml-4"><strong>To:</strong> {(valueTo as Airport).name}</p>
                  <p className="ml-4"><strong>NMI:</strong> {distance.toFixed(2)}</p>
                </div>
              </div>
            } 
        </div>
        
        <div className="md:w-2/3 border border-black text-white md:ml-8 p-20 md:mt-0 mt-4 rounded-xl md:h-full h-1/2" id="map">
        {usAirports.length > 0 && <Wrapper apiKey={"AIzaSyCXusc3Z113wp1oh98OGoYgQLwEwAoRY54"}>
          <div id="map"></div>
        </Wrapper>}
        </div>
      </div>
    </div>
  );
}

export default App;
