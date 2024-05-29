import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as ApiService from '../../apis'
import { Grid, Typography } from '@mui/material';
import moment from 'moment';

export default function SearchDocument() {
    const [documents, setDocuments] = useState([]);
    let navigate = useNavigate();

    useEffect((e) => {
        let token = localStorage.getItem("token");
        if (token === "" || token === undefined || token === null) {
            navigate('/');
        }
        getDocumentEntry();
    }, [])

    const getDocumentEntry = async (event) => {

        let data = {
            "major_head": "",
            "minor_head": "",
            "from_date": "",
            "to_date": "",
            "tags": [{ "tag_name": "" }],
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
                console.log('resp-----', response.data);
                setDocuments(response.data)
            } else {
            }
        } catch (e) {
            console.log(e);
        }
    }

    const searchDocumentEntry = async (event) => {

        let data = {
            "major_head": "",
            "minor_head": "",
            "from_date": "",
            "to_date": "",
            "tags": [{ "tag_name": "" }],
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
                console.log('resp-----', response.data);
                setDocuments(response.data)
            } else {
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Grid container style={{ backgroundColor: "#fff", height: "100vh", overflowY: "scroll", overflowX: "hidden" }}>
            <Grid item xs={12}></Grid>
            {
                documents.map((data) => {
                    return (
                        <Grid item xs={12} className='long-cards'>
                            <Typography variant='h6' className='primary-color' style={{width:'50px'}}>
                                {data.row_num}
                            </Typography>
                            <Grid style={{width:'300px'}}>
                                <img src={data.file_url} className='main-logo' />
                            </Grid>
                            <Typography variant='h6' className='primary-color' style={{width:'150px'}}>
                                {data.document_remarks}
                            </Typography>
                            <Typography variant='h6' className='primary-color' style={{width:'100px'}}>
                                {data.major_head}
                            </Typography>
                            <Typography variant='h6' className='primary-color' style={{width:'150px'}}>
                                {data.minor_head}
                            </Typography>
                            <Typography variant='h6' className='primary-color' style={{width:'150px'}}>
                                {moment(data.document_date).format('DD-MM-yyyy')}
                            </Typography>
                        </Grid>
                    );
                })
            }
        </Grid>
    )
}
