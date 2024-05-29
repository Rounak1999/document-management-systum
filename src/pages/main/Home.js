import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import logo from '../../assets/home_upoad.svg';
import { useTheme } from '@mui/material/styles';
import * as ApiService from '../../apis'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Home() {
  const [date, setDate] = useState("");
  const [major, setMajor] = useState("");
  const [minor, setMinor] = useState("");
  const [documentUpload, setDocumentUpload] = useState("");
  const [remarks, setRemarks] = useState("");
  const [tags, setTags] = useState([]);
  const [personName, setPersonName] = useState([]);
  const theme = useTheme();

  let navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");
    console.log("token", token)
    if (!token) {
      navigate('/');
    }
    documentTags();
  }, [])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const documentTags = async (event) => {

    let data = {
      "term": ""
    }

    try {
      let response = await ApiService.documentTags(data);
      console.log('resp-----', response);
      if (response.status === true) {
        setTags(response.data)
      } else {
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleSubmit = async (e) => {
    console.log("e=>", e)
  }

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={0} sm={6} lg={4} xl={4} className='div-center left-side' style={{ background: "#fff", flexDirection: "column" }}>
        <img src={logo} style={{ width: "250px", height: "250px" }} />
        <Typography variant='h6' style={{ color: "rgb(2, 0, 36)" }}>
          Upload Document
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} lg={8} xl={8} style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0px 30px"
      }}>
        <form onSubmit={(e) => { handleSubmit(e) }} style={{ backgroundColor: "#ffffff", display: "flex", flexDirection: "column", borderRadius: '4px', padding: "10px 0px" }}>
          <FormControl className='input-styles'>
            <Typography style={{ color: "rgb(2, 0, 36)", fontSize: "15px" }}>
              Select Document
            </Typography>
            <TextField
              type="file"
              // label="Controlled"
              accept="application/pdf, image/png, image/jpeg"
              value={documentUpload}
              size="small"
              onChange={(event) => { setDocumentUpload(event.target.file) }}
            />
          </FormControl>

          <FormControl className='input-styles'>
            <Typography style={{ color: "rgb(2, 0, 36)", fontSize: "15px" }}>
              Enter Date
            </Typography>
            <TextField
              type="date"
              // label="Controlled"
              value={documentUpload}
              size="small"
              onChange={(event) => { setDocumentUpload(event.target.file) }}
            />
          </FormControl>

          <FormControl className='input-styles'>
            <Typography style={{ color: "rgb(2, 0, 36)", fontSize: "15px" }}>
              Select Major
            </Typography>
            <Select
              labelId="demo-simple-select-label"
              value={major}
              // label="Major"
              size="small"
              onChange={(e) => { setMajor(e.target.value) }}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <FormControl className='input-styles'>
            <Typography style={{ color: "rgb(2, 0, 36)", fontSize: "15px" }}>
              Select Minor
            </Typography>
            <Select
              labelId="demo-simple-select-label"
              value={minor}
              // label="Minor"
              size="small"
              onChange={(e) => { setMinor(e.target.value) }}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>

          <FormControl className='input-styles'>
          <Typography style={{ color: "rgb(2, 0, 36)", fontSize: "15px" }}>
              Add Tags
            </Typography>
          <Select
            id="demo-multiple-chip"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {tags.map((name) => (
              <MenuItem
                key={name.id}
                value={name.label}
                style={getStyles(name, personName, theme)}
              >
                {name.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

          <FormControl className='input-styles'>
            <Typography style={{ color: "rgb(2, 0, 36)", fontSize: "15px" }}>
              Remarks
            </Typography>
            <TextField
              // label="Remarks"
              multiline
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </FormControl>

          <Grid item xs={12} className='button-container'>
            <Button variant="outlined" style={{ color: "rgb(2, 0, 36)", borderColor: "rgb(2, 0, 36)" }} onClick={(e) => { handleSubmit(e) }}>Submit</Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}
