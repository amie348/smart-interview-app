import React, {useEffect, useState} from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';


TagsComponent.propTypes = {
  name: PropTypes.string,
};


export default function TagsComponent({name, label, setSkills, skills }) {


  const [value, setValues] = useState([])

  const { control } = useFormContext();
  
  const handleChangeValue = (e,value1) => {

    setSkills(value1)

  }


  return (

    <Controller
    name={name}
    control={control}
    render={({ field, fieldState: {error} }) => {

      field.value = skills;

      if(field.value?.length)
      {
        error = undefined
      }

      return (
       <Autocomplete
        sx={{ width : "100%" }}
        multiple
        options={options}
        getOptionLabel={(option) => option}
        filterSelectedOptions
        onChange={handleChangeValue}
        renderInput={(params) => {

            return (
            
                <TextField
                  {...field}
                  {...params}
                  fullWidth
                  value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
                  error={!!error}
                  helperText={error?.message}
                  label={label}

                />
        
            )}}
        
        />



        )
      
      }}
      
    /> 
    )

    // <Autocomplete
    //     sx={{ width : "100%" }}
    //     multiple
    //     id="tags-outlined"
    //     options={options}
    //     getOptionLabel={(option) => option}
    //     filterSelectedOptions
    //     onChange={handleSetValue}
    //     renderInput={(params) => (
    //       <TextField
    //         {...params}
    //         label={label}
    //         placeholder={name}
    //         // value={value}
    //         // onChange={handleSetValue}
    //       />
    //     )
    //   }
    //   />
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const options = [
  "Nodejs",
  "Reactjs",
  "Expressjs",
  "AWS",
  "Python",
  "Java",
  "C#",
  "C++",
  "Javascript",
  
];
