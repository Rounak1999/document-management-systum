import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as ApiService from '../../apis'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, OutlinedInput, Typography } from '@mui/material';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import JSZip from "jszip";
import axios from 'axios';

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

const minor_personal = [    //dummy data for major
    'John', 'Tom', 'Emily'
]
const minor_professional = [   // dummy data for minor
    'Accounts', 'HR', 'IT', 'Finance'
]

function getStyles(name, chips, theme) {
    return {
        fontWeight:
            chips.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function SearchDocument() {
    const theme = useTheme();
    const [chips, setChips] = React.useState([]);
    const [documents, setDocuments] = useState([]);
    const [from_date, setFromDate] = useState("");
    const [to_date, setToDate] = useState("");
    const [major, setMajor] = useState("");
    const [minor, setMinor] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [tags, setTags] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([])

    let navigate = useNavigate();

    useEffect((e) => {
        let token = localStorage.getItem("token");
        if (token === "" || token === undefined || token === null) {
            navigate('/');
        }
        getDocumentEntry("", "", "", "", []);  // for fetching all data
        documentTags(); // for fetching all tags
    }, [])

    const documentTags = async (event) => {

        let data = {
            "term": ""
        }

        try {
            let response = await ApiService.documentTags(data);
            if (response.status === true) {
                setTags(response.data)
            } else {
            }
        } catch (e) {
            console.log(e);
        }
    }

    const getDocumentEntry = async (major, minor, from_date, to_date, chips) => {

        let chips_data = chips.length ? chips.map((e) => {
            return { tag_name: e }
        }) : [{ tag_name: "" }]

        let data = {
            "major_head": major,
            "minor_head": minor,
            "from_date": from_date ? moment(from_date).format("DD-MM-yyyy") : "",
            "to_date": to_date ? moment(to_date).format("DD-MM-yyyy") : "",
            "tags": chips_data,
            "uploaded_by": "",
            "start": 0,
            "length": 1000,
            "filterId": "",
            "search": {
                "value": ""
            }
        }

        try {
            let response = await ApiService.searchDocumentEntry(data);
            if (response.status === true) {
                setDocuments(response.data)
                setLoading(false)
                let image_data = response.data.length ? response.data.map((e) => {
                    return e.file_url;
                }) : []
                setImages(image_data)
            } else {
                setLoading(false)
            }
        } catch (e) {
            console.log(e);
            setLoading(false)
        }
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setChips(typeof value === 'string' ? value.split(',') : value);
        getDocumentEntry(major, minor, from_date, to_date, typeof value === 'string' ? value.split(',') : value);
    };

    const handleClickOpen = (url) => {
        setPreviewImage(url)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    // function for download all images as zip 
    const handleZip = async () => {
        const zip = new JSZip();
        const promises = [];

        // Fetch images and add them to the zip file
        images.forEach((imageUrl, index) => {
            const fileName = `image${index + 1}.jpg`;
            const promise = axios.get(imageUrl, { responseType: 'arraybuffer' })
                .then(response => {
                    zip.file(fileName, response.data, { binary: true });
                })
                .catch(error => {
                    console.error(`Failed to fetch ${imageUrl}:`, error);
                });
            promises.push(promise);
        });

        // Wait for all image fetch requests to complete
        await Promise.all(promises);

        // Generate the zip file
        const content = await zip.generateAsync({ type: 'blob' });

        // Create a temporary download link and trigger download
        const url = window.URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <Grid container style={{ backgroundColor: "#fff", height: "100vh", overflowY: "scroll", overflowX: "hidden" }}>
            <Grid item xs={12} sm={12} lg={12} xl={12} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: 'rgb(2,0,36)', color: '#fff', position: 'fixed', width: '100%', height: '50px', zIndex: '100' }}>
                <Grid>
                    <IconButton onClick={() => { navigate('/home'); }} style={{ color: "#fff" }} aria-label="Back to home">
                        <HomeIcon />
                    </IconButton>
                </Grid>
                <Grid>Documents</Grid>
                <Grid onClick={() => { handleZip() }}>
                    <IconButton style={{ color: "#fff" }} aria-label="download">
                        <FolderZipIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} lg={12} xl={12} style={{ marginTop: "60px" }}>
                <Grid container>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <FormControl className='input-styles' style={{ width: "90%" }}>
                            <Typography className='input-label'>
                                From Date
                            </Typography>
                            <TextField
                                type="date"
                                value={from_date}
                                size="small"
                                onChange={(event) => { setFromDate(event.target.value); getDocumentEntry(major, minor, event.target.value, to_date, chips) }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <FormControl className='input-styles' style={{ width: "90%" }}>
                            <Typography className='input-label'>
                                To Date
                            </Typography>
                            <TextField
                                type="date"
                                value={to_date}
                                size="small"
                                onChange={(event) => { setToDate(event.target.value); getDocumentEntry(major, minor, from_date, event.target.value, chips) }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <FormControl className='input-styles' style={{ width: "90%" }}>
                            <Typography className='input-label'>
                                Select Tags
                            </Typography>
                            <Select
                                multiple
                                value={chips}
                                size="small"
                                onChange={handleChange}
                                input={<OutlinedInput />}
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
                                        style={getStyles(name.label, chips, theme)}
                                    >
                                        {name.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <FormControl className='input-styles' style={{ width: "90%" }}>
                            <Typography className='input-label'>
                                Select Major
                            </Typography>
                            <Select
                                value={major}
                                size="small"
                                onChange={(e) => { setMajor(e.target.value); getDocumentEntry(e.target.value, minor, from_date, to_date, chips) }}
                            >
                                <MenuItem value=''>Select Major</MenuItem>
                                <MenuItem value='Personal' key={1}>Personal</MenuItem>
                                <MenuItem value='Professional' key={2}>Professional</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <FormControl className='input-styles' style={{ width: "90%" }}>
                            <Typography className='input-label'>
                                Select Minor
                            </Typography>
                            <Select
                                value={minor}
                                size="small"
                                onChange={(e) => { setMinor(e.target.value); getDocumentEntry(major, e.target.value, from_date, to_date, chips) }}
                            >
                                <MenuItem value=''>Select Minor</MenuItem>
                                {
                                    major === 'Personal' ?
                                        minor_personal.map((e, i) => {
                                            return <MenuItem value={e} key={i}>{e}</MenuItem>
                                        })
                                        : major === 'Professional' ? minor_professional.map((e, i) => {
                                            return <MenuItem value={e} key={i}>{e}</MenuItem>
                                        })
                                            : null
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
            {
                // !documents.length ? 
                documents.map((data, index) => {
                    return (
                        <Grid item xs={12} sm={4} lg={3} xl={3} key={index} className='div-center'>
                            <Grid className='long-cards'>
                                <Typography className='white-color' style={{ fontSize: "15px" }}>
                                    Uploaded By: {data.uploaded_by}
                                </Typography>
                                <Typography className='white-color' style={{ fontSize: "15px" }}>
                                    Major: {data.major_head}
                                </Typography>
                                <Typography className='white-color' style={{ fontSize: "15px" }}>
                                    Minor: {data.minor_head}
                                </Typography>
                                <Typography className='white-color text-overflow' style={{ fontSize: "15px" }}>
                                    Remarks: {data.document_remarks}
                                </Typography>

                                <Typography className='white-color' style={{ fontSize: "15px" }}>
                                    Date: {moment(data.document_date).format('DD-MM-yyyy')}
                                </Typography>
                                <Grid container >
                                    <Grid item xs={6} className='div-center'>
                                        <IconButton style={{ color: "#fff" }} aria-label="preview" onClick={(e) => { handleClickOpen(data.file_url) }}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={6} className='div-center'>
                                        <a href={data.file_url} target="_blank" className='primary-color' download style={{ textDecoration: 'none' }}>
                                            <IconButton style={{ color: "#fff" }} aria-label="download">
                                                <DownloadIcon />
                                            </IconButton>
                                        </a>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                })
                // :
                //     <Grid className='w-100' style={{display:'flex',justifyContent:"center"}}>
                //         <Typography variant='h5' className='primary-color'>
                //             No Data Found
                //         </Typography>
                //     </Grid>
            }

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Preview Image
                </DialogTitle>
                <DialogContent>
                    <img src={previewImage} className='main-logo' />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        <a style={{ color: "red", textDecoration: 'none' }}>Close</a>
                    </Button>
                    <Button onClick={handleClose} autoFocus>
                        <a href={previewImage} target="_blank" className='primary-color' download style={{ textDecoration: 'none' }}>Download</a>
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
