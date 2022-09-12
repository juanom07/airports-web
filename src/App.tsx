/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './index.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getAirportsApi } from './services/http'
import { Wrapper } from "@googlemaps/react-wrapper";
import { calcCrow, middlePoint } from './utils/helpers';
import { Airport } from './interfaces/airport';
import airplane from './assets/airplane.png';
import { useMediaQuery, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Flight, FiberManualRecordOutlined } from '@mui/icons-material';


function App() {
  const [airportsFrom, setAirportsFrom] = useState<Airport[] | []>([]);
  const [airportsTo, setAirportsTo] = useState<Airport[] | []>([]);
  
  const [valueFrom, setValueFrom] = useState<Airport | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const [valueTo, setValueTo] = useState<Airport | null>(null);
  const [inputValueTo, setInputValueTo] = useState('');
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);
  
  const [distance, setDistance] = useState<number | null>();
  const [map, setMap] = useState<google.maps.Map>();
  const [line, setLine] = useState<google.maps.Polyline>();
  const [markerFrom, setMarkerFrom] = useState<google.maps.Marker>();
  const [markerTo, setMarkerTo] = useState<google.maps.Marker>();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  
  const getAirportsOptions = async (term: string, saveData: Function, saveState: Function) => {
    saveState(term);
    if (term.length > 2) {
      const response = await getAirportsApi(term);
      saveData(response || [])
    }
  }

  useEffect(() => {
    if (valueFrom) {
      markerFrom && (markerFrom as google.maps.Marker).setMap(null)
      const positionFrom = new google.maps.LatLng(parseFloat(valueFrom.latitude), parseFloat(valueFrom.longitude))
      setMarkerFrom(new google.maps.Marker({
        position: positionFrom,
          map: map,
          title: valueFrom.name,
          icon: airplane,
      }));
      (map as google.maps.Map).setCenter(positionFrom);
      (map as google.maps.Map).setZoom(5);
    }else{
      markerFrom && (markerFrom as google.maps.Marker).setMap(null)
      line && (line as google.maps.Polyline).setMap(null)
      setDistance(null)
    }
  }, [valueFrom]);

  useEffect(() => {
    if (valueTo) {
      markerTo && (markerTo as google.maps.Marker).setMap(null)
      const positionTo = new google.maps.LatLng(parseFloat(valueTo.latitude), parseFloat(valueTo.longitude))
      setMarkerTo(new google.maps.Marker({
        position: positionTo,
          map: map,
          title: valueTo.name,
          icon: airplane,
      }));
      (map as google.maps.Map).setCenter(positionTo);
      (map as google.maps.Map).setZoom(5);
    }else{
      markerTo && (markerTo as google.maps.Marker).setMap(null)
      line && (line as google.maps.Polyline).setMap(null)
      setDistance(null)
    }
  }, [valueTo]);

  useEffect(() => {
    if (valueFrom && valueTo) {
      const cal = calcCrow(parseFloat(valueFrom.latitude), parseFloat(valueFrom.longitude), parseFloat(valueTo.latitude), parseFloat(valueTo.longitude));
      setDistance(cal)
      
      const positionFrom = new google.maps.LatLng(parseFloat(valueFrom.latitude), parseFloat(valueFrom.longitude))
      const positionTo = new google.maps.LatLng(parseFloat(valueTo.latitude), parseFloat(valueTo.longitude))
      
      const newCenter: any = middlePoint(parseFloat(valueFrom.latitude), parseFloat(valueFrom.longitude), parseFloat(valueTo.latitude), parseFloat(valueTo.longitude));
      (map as google.maps.Map).setCenter(new google.maps.LatLng(newCenter.lat, newCenter.lng));

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(positionFrom);
      bounds.extend(positionTo);
      (map as google.maps.Map).fitBounds(bounds);

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
    if (!map && domMap){
      const mapa = new window.google.maps.Map(domMap as HTMLElement, {
        center,
        zoom: 4
      });
  
      setMap(mapa);
    }
  }, []);

  const center: google.maps.LatLngLiteral = {lat: 39.7578721, lng: -101.4895165};
  return (
    <div className="flex flex-col md:p-20 md:px-5 px-2 pt-5 md:pb-5 p-1 min-h-screen w-full md:items-start items-center">
      <h1 className="md:text-3xl text-2xl font-bold text-black">Airports distance calculator</h1>
      <div className="flex flex-col md:flex-row md:justify-between md:mt-12 mt-4 md:h-2/3 h-full w-full md:w-2/3 bg-white rounded-xl p-1">
        <div className="md:w-1/3 w-full text-white flex flex-col">
          <div className="rounded-xl bg-white md:p-4 p-2">
            <Autocomplete
              className=""
              onChange={(event: any, newValue: any) => {
                setValueFrom(newValue);
              }}
              value={valueFrom}
              inputValue={inputValue}
              loading={loadingFrom}
              onInputChange={async (event, newInputValue) => {
                setLoadingFrom(true)
                try {
                  await getAirportsOptions(newInputValue, setAirportsFrom, setInputValue)
                  setLoadingFrom(false)
                } catch (error) {
                  setLoadingFrom(false)
                }
              }}
              id="airport-from"
              options={airportsFrom}    
              getOptionLabel={ (option: string | Airport) => `${(option as Airport).iata} - ${(option as Airport).name}`}
              renderInput={(params) => <TextField {...params} label="From" size={`${isSmallScreen ? 'small' : 'medium'}`} InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingFrom ? (
                      <CircularProgress size={20}/>
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}/>}
            />
            <Autocomplete
              className="md:mt-6 mt-4 w-full"
              value={valueTo}
              onChange={(event: any, newValue: any) => {
                setValueTo(newValue);
              }}
              inputValue={inputValueTo}
              loading={loadingTo}
              onInputChange={async (event, newInputValue) => {
                setLoadingTo(true);
                try {
                  await getAirportsOptions(newInputValue, setAirportsTo, setInputValueTo)
                  setLoadingTo(false);
                } catch (error) {
                  setLoadingTo(false);
                }
              }}
              id="airport-to"
              options={airportsTo}
              getOptionLabel={ (option: string | Airport) => `${(option as Airport).iata} - ${(option as Airport).name}`}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="To" size={`${isSmallScreen ? 'small' : 'medium'}`} InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingTo ? (
                      <CircularProgress size={20}/>
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}/>}
            />
            
          </div>
            <div className="rounded-xl md:mt-4 mt-2 bg-white md:px-4 px-2">
              <div className="text-dark-blue w-full flex flex-col">
                <p className="mb-2 text-xl font-bold">Distance information:</p>
                <div className='flex'>
                  <div className='h-24 md:h-48 w-1/12 flex flex-col items-baseline justify-center'>
                    <div className='rounded-full flex ml-0.5 mb-1'>
                      <FiberManualRecordOutlined sx={{color:'grey'}} />
                    </div>
                    <div className='h-full m-auto border-l-4 border-dotted border-grey'></div>
                    <div className='pb-2  pt-1'>
                      <Flight sx={{transform: "rotate(180deg)"}}/>
                    </div>
                  </div>
                  <div className='h-24 md:h-48 flex flex-col justify-between pl-2'>
                    <p className="md:text-md text-sm"><strong>From:</strong> {valueFrom &&(valueFrom as Airport).name}</p>
                    <div className='flex flex-col'>
                      <p className="md:text-md text-sm"><strong>To:</strong> {valueTo && (valueTo as Airport).name}</p>
                      <p className="md:text-md text-sm"><strong>NMI:</strong> {distance && distance.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        
        <div className="md:w-2/3 text-white md:p-20 p-8 md:mt-0 mt-1 rounded-xl grow" id="map">
        <Wrapper apiKey={"AIzaSyCXusc3Z113wp1oh98OGoYgQLwEwAoRY54"}>
          <div id="map"></div>
        </Wrapper>
        </div>
      </div>
    </div>
  );
}

export default App;
