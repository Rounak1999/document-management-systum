import React, { useEffect, useState } from 'react'
import * as ApiService from '../../apis'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Back from '../../assets/left-arrow.png';

export default function Login(props) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [displayOtp, setDisplayOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [errMob, SetMobErr] = useState(null);
  const [errOtp, SetOtpErr] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token === "" || token === undefined || token === null) {
      navigate('/');
    } else {
      navigate('/home');
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();

    let data = {
      "mobile_number": mobileNumber,
    }

    try {
      let response = await ApiService.generateOTP(data);
      if (response.status === true) {
        setDisplayOtp(true);
        SetMobErr(null)
      } else {
        SetMobErr(response.data)
      }
    } catch (e) {
      console.log(e);
    }

  }

  const handleSubmitOtp = async (event) => {
    event.preventDefault();

    let data = {
      "mobile_number": mobileNumber,
      "otp": otp
    }

    try {
      let response = await ApiService.validateOTP(data);
      if (response.status === true) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("user_data", JSON.stringify(response.data));
        SetOtpErr(null);
        navigate('/home');
        // redirect to home page
      } else {
        SetOtpErr(response.message);
        // invalid otp
      }
    } catch (e) {
      console.log(e);
    }

  }

  return (
    <Grid container className='main-container'>
      <Grid className='inner-container' style={{ position: 'relative' }}>
        {
          !displayOtp ?
            <Typography variant="h4" className='primary-color'>
              Login
            </Typography>
            :
            <>
              <div style={{ position: 'absolute', color: '#000', top: '35px', left: '30px', cursor: 'pointer' }} onClick={(e) => { setDisplayOtp(false) }}>
                <img src={Back} style={{ width: "30px", height: "30px" }} />
              </div>
              <Typography variant="h4" className='primary-color'>
                OTP
              </Typography>
            </>
        }

        {
          !displayOtp ?
            <>
              <Grid item xs={12} className='input-container'>
                <Typography className='input-label'>
                  Enter Mobile Number
                </Typography>
                <TextField
                  error={errMob ? true : false}
                  id="mobile_number"
                  variant="outlined"
                  size="small"
                  sx={{ color: "rgb(2,0,36)", width: "100%" }}
                  value={mobileNumber}
                  onChange={(event) => {
                    setMobileNumber(event.target.value);
                  }}
                  helperText={errMob ? errMob : null}
                />

              </Grid>
              <Grid item xs={12} className='button-container'>
                <Button variant="contained" className='button-common' onClick={(e) => { handleSubmit(e) }}>Submit</Button>
              </Grid>
            </>
            :
            <>
              <Grid item xs={12} className='input-container'>
                <Typography className='input-label'>
                  Enter OTP
                </Typography>
                <TextField
                  error={errOtp ? true : false}
                  id="otp"
                  variant="outlined"
                  size="small"
                  sx={{ color: "rgb(2,0,36)", width: "100%" }}
                  value={otp}
                  onChange={(event) => {
                    setOtp(event.target.value);
                  }}
                  helperText={errOtp ? errOtp : null}
                />
              </Grid>
              <Grid item xs={12} className='button-container'>
                <Button variant="contained" className='button-common' onClick={(e) => { handleSubmitOtp(e) }}>Validate Otp</Button>
              </Grid>
            </>
        }


      </Grid>
    </Grid>
  )
}
