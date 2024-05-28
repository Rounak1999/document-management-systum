import React, { useState } from 'react'
import * as ApiService from '../../apis'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [displayOtp, setDisplayOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('phone number===>', mobileNumber);

    let data = {
      "mobile_number": mobileNumber,
    }
    console.log('data----', data);

    try {
      let response = await ApiService.generateOTP(data);
      console.log('resp-----', response);
      if (response.status === true) {
        setDisplayOtp(true);
      }
    } catch (e) {
      console.log(e);
    }

  }

  const handleSubmitOtp = async (event) => {
    event.preventDefault();
    console.log('phone number===>', mobileNumber);
    console.log('otp===>', otp);

    let data = {
      "mobile_number": mobileNumber,
      "otp": otp
    }
    console.log('data----', data);

    try {
      let response = await ApiService.validateOTP(data);
      console.log('resp-----', response);
      if (response.status === true) {
        // redirect to home page
      } else {
        // invalid otp
      }
    } catch (e) {
      console.log(e);
    }

  }

  return (
    <Grid container className='main-container'>
      <Grid className='inner-container'>
        <Typography variant="h5" color="primary">
          Login
        </Typography>
        <Grid item xs={12} className='input-container'>
          <TextField
            color="primary"
            label="Enter Mobile Number"
            id="mobile_number"
            variant="outlined"
            size="small"
            value={mobileNumber}
            onChange={(event) => {
              setMobileNumber(event.target.value);
            }}
          />
        </Grid>
        {
          displayOtp ?
            <Grid item xs={12} className='input-container'>
              <TextField
                label="Enter OTP"
                id="mobile_number"
                variant="outlined"
                size="small"
                value={otp}
                onChange={(event) => {
                  setOtp(event.target.value);
                }}
              />
            </Grid>
            : null
        }
        <Grid item xs={12} className='button-container'>
          {
            !displayOtp ?
              <Button variant="outlined" color="primary" onClick={(e) => { handleSubmit(e) }}>Submit</Button> :
              <Button variant="outlined" color="primary" onClick={(e) => { handleSubmitOtp(e) }}>Validate Otp</Button>
          }
        </Grid>
      </Grid>
    </Grid>
  )
}
