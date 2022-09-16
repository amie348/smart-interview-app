import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { InputAdornment, OutlinedInput, InputLabel } from '@mui/material';

// ----------------------------------------------------------------------

RHFSymbollNumber.propTypes = {
  name: PropTypes.string,
};

export default function RHFSymbollNumber({ name, symboll, label, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
        <InputLabel htmlFor="outlined-adornment-amount">label</InputLabel>
          <OutlinedInput
            {...field}
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">{symboll}</InputAdornment>}
            value={field.value}
            error={!!error}
            helperText={error?.message}            
            {...other}
          />
      </>
      )}
    />
  );
}
