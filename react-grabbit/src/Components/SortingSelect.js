import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect({callBack}) {
  const [sort, setSort] = React.useState(0);

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  return (
    <Box style={{width:"12rem", textAlign:"center"}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Sort</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sort}
          label="Sort"
          onChange={handleChange}
        >
          <MenuItem value={0}>No Sorting</MenuItem>
          <MenuItem value={1}>Newest</MenuItem>
          <MenuItem value={2}>Ascending Prices</MenuItem>
          <MenuItem value={3}>Descending Prices</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}