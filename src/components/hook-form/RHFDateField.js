import {useState} from "react";
import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// ----------------------------------------------------------------------

RHFDateField.propTypes = {
  name: PropTypes.string,
};

export default function RHFDateField({ type, name, label }) {
  const { control } = useFormContext();
  const [value, setValue] = useState(new Date());

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
                
        return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          
        {type === "dateTime" ? 
        <DateTimePicker
          {...field}
          label={label}
          value={field.value}
          inputFormat="MM dd yyyy, h:mm:ss a"
          renderInput={(params) => {
              
              if(value){
                error = null;
              }              

              return (<TextField
              fullWidth
              error={!!error}
              helperText={error?.message}
              {...params}  
              />)
            }
          }
        />
        :
        <MobileDatePicker
          {...field}
          label={label}
          inputFormat="dd/MM/yyyy"
          value={field.value}
          renderInput={(params) => {
              
              if(value){
                error = null;
              }              

              return (<TextField
              fullWidth
              error={!!error}
              helperText={error?.message}
              {...params}  
              />)
            }
          }
        />
      }
        </LocalizationProvider>
      )}}
    />
  );
}
