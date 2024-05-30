import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import Uploadlogo from '../../assets/upload.svg';
import Searchlogo from '../../assets/search.svg';
import { IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';


export default function Home() {

  let navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token === "" || token === undefined || token === null) {
      console.log("true")
      navigate('/');
    } else {
      console.log("false")
    }
  }, [])

  const handleCardClick = (e) => {
    if (e === "upload") {
      navigate('/upload_document');
    } else {
      navigate('/search_document');
    }
  }

  const handleLogout = (e) => {
    localStorage.clear()
    navigate('/');
  }

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12} sm={12} lg={12} xl={12} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', color: 'rgb(2,0,36)', position: 'fixed', width: '100%', height: '50px', zIndex: '100', }}>
        <Grid>

        </Grid>
        <Typography variant='h6' className='primary-color'>
          Home
        </Typography>
        <Grid onClick={() => { handleLogout() }}>
          <IconButton style={{ color: 'rgb(2,0,36)' }} aria-label="download">
            <LogoutIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6} className='div-center' style={{ marginTop: "40px" }}>
        <div className='div-center card' onClick={() => { handleCardClick("upload") }}>
          <img src={Uploadlogo} className='home-logo' />
          <Typography variant='h6' className='primary-color'>
            Upload Document
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6} className='div-center'>
        <div className='div-center card' onClick={() => { handleCardClick("search") }}>
          <img src={Searchlogo} className='home-logo' />
          <Typography variant='h6' className='primary-color'>
            Search Document
          </Typography>
        </div>
      </Grid>
    </Grid>
  )
}
