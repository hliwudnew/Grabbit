import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect({callBack,clear}) {
  const [sort, setSort] = React.useState("Newest");

  const handleChange = (event) => {
    setSort(event.target.value);
    callBack(event.target.value);
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
          {/* <MenuItem value={"No Sorting"}>No Sorting</MenuItem> */}
          <MenuItem value={"Newest"}>Newest</MenuItem>
          <MenuItem value={"Ascending Prices"}>Ascending Prices</MenuItem>
          <MenuItem value={"Descending Prices"}>Descending Prices</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}