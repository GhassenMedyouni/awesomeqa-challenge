import * as React from "react";
import { NextPage } from "next";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {useEffect, useState} from "react";
import axios from "axios";
import {CircularProgress, Button, Container} from "@mui/material";
import styles from "./tickets.module.css"

const handleOpenMessage = (id: string) => {
    // TODO: ADD API TO OPEN DISCORD CHANNEL
    console.log('OPENED')
}

const handleDelete = (id: string) => {
    // TODO: ADD REMOVE API
    console.log('OPENED')
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'msg_id', headerName: 'Message Id', width: 130 },
    { field: 'resolved_by', headerName: 'Resolved By', width: 150 },
    {
        field: 'timestamp',
        headerName: 'Created At',
        type: 'string',
        width: 150,
        valueGetter: (timestamp: string) => {
            const date = new Date(timestamp);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        }
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 160,
    },
    {
        field: 'context_messages',
        headerName: 'Context',
        width: 160,
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 200,
        renderCell: (params) => (
            <div className={styles.actionContainer}>
                <Button variant="outlined" color="success"
                        onClick={() => handleOpenMessage(params.row.id)}
                >
                    Open
                </Button>
                <Button variant="contained" color="error"
                        onClick={() => handleDelete(params.row.id)}
                >
                    Delete
                </Button>

            </div>

        ),
    },
];


const Tickets: NextPage = () => {

    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)




    useEffect(() => {
        fetchContent()
        console.log('rows', rows)
    }, [])

    const fetchContent = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            })

            if (response.data) {
              setRows(response.data)
            }

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    }

    const getRowClassName = (params) => {
        return params.row.status === 'open' ? styles.openRow : styles.closedRow;
    };

    return (
        <div className={styles.main}>
            {!loading ? (
                <DataGrid
                    className={styles.table}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    getRowClassName={getRowClassName}
                    pageSizeOptions={[5, 10]}
                />
            ) : (
                <CircularProgress />
            )}

        </div>
    );
};

export default Tickets;
