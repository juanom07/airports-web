import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import './index.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { airportsResponse } from './mocks/airports';
import { getAirports } from './services/http'
import { Wrapper, Status } from "@googlemaps/react-wrapper";

interface Airport {
  icao_code: string,
  country_code: string,
  iata_code: string,
  lng: number,
  name: string,
  lat: number
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in nmi)
function calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1R = toRad(lat1);
  var lat2R = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1R) * Math.cos(lat2R); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d / 0.539957;
}

// Converts numeric degrees to radians
function toRad(Value: number) 
{
    return Value * Math.PI / 180;
}

function middlePoint(lat1: number, lng1: number, lat2: number, lng2: number){
  var dLng = toRad((lng2 - lng1));

  lat1 = toRad(lat1);
  lat2 = toRad(lat2);
  lng1 = toRad(lng1);

  var bX = Math.cos(lat2) * Math.cos(dLng);
  var bY = Math.cos(lat2) * Math.sin(dLng);
  var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
  var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

  return {lat: lat3 * 180 / Math.PI, lng: lng3 * 180 / Math.PI};
}


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
    if (valueFrom && valueTo) {
      // Calcular distancia
      const cal = calcCrow(valueFrom.lat, valueFrom.lng, valueTo.lat, valueTo.lng);
      setDistance(cal)
      
      markerFrom && (markerFrom as google.maps.Marker).setMap(null)
      const positionFrom = new google.maps.LatLng(valueFrom.lat, valueFrom.lng)
      setMarkerFrom(new google.maps.Marker({
        position: positionFrom,
          map: map,
          label: 'F',
          title: valueFrom.name,
      }));
      
      markerTo && (markerTo as google.maps.Marker).setMap(null)
      const positionTo = new google.maps.LatLng(valueTo.lat, valueTo.lng)
      setMarkerTo(new google.maps.Marker({
        position: positionTo,
          map: map,
          label: 'T',
          title: valueTo.name,
      }));
      
      const newCenter: any = middlePoint(valueFrom.lat, valueFrom.lng, valueTo.lat, valueTo.lng);
      (map as google.maps.Map).setCenter(new google.maps.LatLng(newCenter.lat, newCenter.lng));
      
      line && (line as google.maps.Polyline).setMap(null)
      var newLine = new google.maps.Polyline({
          path: [positionFrom, positionTo],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
      });

      newLine.setMap(map as google.maps.Map);
      setLine(newLine)
    }else{
      setDistance(null)
    }
  }, [valueFrom, valueTo]);

  useEffect(() => {
    const mapa = new window.google.maps.Map(document.getElementById('map') as HTMLElement, {
      center,
      zoom: 4,
    });

    setMap(mapa);

    const data: Airport[]  = getAirports();

    setUsAirports(data);
  }, []);



  const center: google.maps.LatLngLiteral = {lat: 39.7578721, lng: -101.4895165};
  return (
    <div className="flex flex-col p-20 h-screen">
      <h1 className="text-xl">Airports Search</h1>
      <div className="flex justify-between mt-12 h-full">
      <div className="w-1/3 text-white mr-8 p-4 rounded-xl flex flex-col">
        <Autocomplete
          freeSolo
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
        {distance && <div className="text-black mt-8 w-full">
        <p>Distance between this two airports is {distance.toFixed(2)} nmi</p>
      </div>}        
      </div>
      
      <div className="w-2/3 h-5/6 border border-black text-white ml-8 p-20 rounded-xl" id="map">
      <Wrapper apiKey={"AIzaSyCXusc3Z113wp1oh98OGoYgQLwEwAoRY54"}>
        <div id="map"></div>
        {/* <Marker position={new google.maps.LatLng(39.7578721, -101.4895165)} /> */}

      </Wrapper>
      </div>
      </div>
    </div>
  );
}

export default App;
