import React, { useState } from 'react';
import '../index.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Airport } from '../interfaces/airport';
import { useMediaQuery, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface TextFieldWrapperProps {
  id: string,
  label: string,
  className: string
  getAirportsOptions: Function,
  value: Airport | null,
  setValue: Function
}

function TextFieldWrapper({id, label, className, getAirportsOptions, value, setValue}: TextFieldWrapperProps) {
  const [airports, setAirports] = useState<Airport[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  
  return (<Autocomplete
    className={className}
    onChange={(event: any, newValue: any) => {
      setValue(newValue);
    }}
    value={value}
    inputValue={inputValue}
    loading={loading}
    onInputChange={async (event, newInputValue) => {
      setLoading(true)
      try {
        await getAirportsOptions(newInputValue, setAirports, setInputValue)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }}
    id={id}
    options={airports}    
    getOptionLabel={ (option: string | Airport) => `${(option as Airport).iata} - ${(option as Airport).name}`}
    renderInput={(params) => <TextField {...params} label={label} size={`${isSmallScreen ? 'small' : 'medium'}`} InputProps={{
      ...params.InputProps,
      endAdornment: (
        <React.Fragment>
          {loading ? (
            <CircularProgress size={20}/>
          ) : null}
          {params.InputProps.endAdornment}
        </React.Fragment>
      ),
    }}/>}
  />);
};

export default TextFieldWrapper;