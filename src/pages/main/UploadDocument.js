import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import logo from '../../assets/home_upoad.svg';
import * as ApiService from '../../apis'
import moment from 'moment';
import Swal from 'sweetalert2';

const minor_personal = [
    'John', 'Tom', 'Emily'
]
const minor_professional = [
    'Accounts', 'HR', 'IT', 'Finance'
]

export default function UploadDocument() {
    const [date, setDate] = useState("");
    const [major, setMajor] = useState("");
    const [minor, setMinor] = useState("");
    const [documentUpload, setDocumentUpload] = useState("");
    const [remarks, setRemarks] = useState("");
    const [tags, setTags] = useState([]);
    const [chips, setChips] = useState([]);
    const [inputValue, setInputValue] = useState('');

    let navigate = useNavigate();

    useEffect((e) => {
        let token = localStorage.getItem("token");
        if (token === "" || token === undefined || token === null) {
            navigate('/');
        }
        documentTags();
    }, [])

    const documentTags = async (event) => {

        let data = {
            "term": ""
        }

        try {
            let response = await ApiService.documentTags(data);
            if (response.status === true) {
                setTags(response.data)
                let data = response.data.map((e) => { return e.label })
                setChips(data)
            } else {
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleSubmit = async (e) => {

        let user = JSON.parse(localStorage.getItem("user_data"));

        let chips_data = chips.map((e) => {
            return { tag_name: e }
        })

        let data = {
            document_date: moment(date).format("DD-MM-yyyy"),
            major_head: major,
            minor_head: minor,
            document_remarks: remarks,
            tags: chips_data,
            user_id: user.user_id
        }

        let formdata = new FormData();

        formdata.append("file", documentUpload);
        formdata.append("data", JSON.stringify(data));

        try {
            let response = await ApiService.saveDocumentEntry(formdata);
            if (response.status === true) {
                Swal.fire({
                    text: "Document Saved!",
                    icon: "success"
                });
            } else {
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            setChips([inputValue.trim(), ...chips]);
            setInputValue('');
        }
    };

    const handleChipDelete = (chipIndex) => {
        setChips(chips.filter((_, index) => index !== chipIndex));
    };

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
                <form onSubmit={(e) => { handleSubmit(e) }} className='main-form'>
                    <FormControl className='input-styles'>
                        <Typography className='input-label'>
                            Select Document
                        </Typography>
                        <TextField
                            type="file"
                            accept="application/pdf, image/png, image/jpeg"
                            // value={documentUpload}
                            size="small"
                            onChange={(event) => { setDocumentUpload(event.target.files[0]) }}
                        />
                    </FormControl>

                    <FormControl className='input-styles'>
                        <Typography className='input-label'>
                            Enter Date
                        </Typography>
                        <TextField
                            type="date"
                            value={date}
                            size="small"
                            onChange={(event) => { setDate(event.target.value) }}
                        />
                    </FormControl>

                    <FormControl className='input-styles'>
                        <Typography className='input-label'>
                            Select Major
                        </Typography>
                        <Select
                            value={major}
                            size="small"
                            onChange={(e) => { setMajor(e.target.value) }}
                        >
                            <MenuItem value='Personal' key={1}>Personal</MenuItem>
                            <MenuItem value='Professional' key={2}>Professional</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl className='input-styles'>
                        <Typography className='input-label'>
                            Select Minor
                        </Typography>
                        <Select
                            value={minor}
                            size="small"
                            onChange={(e) => { setMinor(e.target.value) }}
                        >
                            {
                                major === 'Personal' ?
                                    minor_personal.map((e, i) => {
                                        return <MenuItem value={e} key={i}>{e}</MenuItem>
                                    })
                                    : major === 'Professional' ? minor_professional.map((e, i) => {
                                        return <MenuItem value={e} key={i}>{e}</MenuItem>
                                    })
                                        : <MenuItem value=''>Select Minor</MenuItem>
                            }
                        </Select>
                    </FormControl>

                    <FormControl className='input-styles'>
                        <Typography style={{ color: "rgb(2, 0, 36)", fontSize: "15px" }}>
                            Add Tags
                        </Typography>
                        <TextField
                            size="small"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                        />
                        <div className="chips-container">
                            {chips.map((chip, index) => (
                                <div key={index} className="chip">
                                    {chip}
                                    <span className="close-btn" onClick={() => handleChipDelete(index)}>x</span>
                                </div>
                            ))}
                        </div>
                    </FormControl>

                    <FormControl className='input-styles'>
                        <Typography className='input-label'>
                            Remarks
                        </Typography>
                        <TextField
                            multiline
                            rows={2}
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </FormControl>

                    <Grid item xs={12} className='button-container'>
                        <Button variant="contained" style={{ color: "#fff", background: "rgb(2, 0, 36)" }} onClick={(e) => { handleSubmit(e) }}>Submit</Button>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}
