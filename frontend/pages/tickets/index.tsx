import * as React from "react";
import { NextPage } from "next";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {useEffect, useState} from "react";
import axios from "axios";
import {CircularProgress, Button, Container, LinearProgress} from "@mui/material";
import styles from "./tickets.module.css"
import {useRouter} from "next/router";

const Tickets: NextPage = () => {

    const router = useRouter();
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteLoading, setDeleteLoading] = useState(true)


    useEffect(() => {
        fetchContent()
    }, [])

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
            field: 'ts_last_status_change',
            headerName: 'Updated At',
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
                            disabled={deleteLoading}
                            onClick={() => handleDelete(params.row.id)}
                    >
                        {deleteLoading ? <CircularProgress color={"inherit"} size={20}/>  :"Delete"}
                    </Button>

                </div>

            ),
        },
    ];

    const fetchContent = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tickets/activeList`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            })

            if (response.data) {
              setRows(response.data)
            }

        } catch (err) {
            alert(err.response.data.detail);
            console.log('err', err)
            if (err.response && err.response.status === 401 && err.response.data.detail === "Unauthorized") {
                await router.push("/login")
            }
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: string) => {
        try {
            setDeleteLoading(true)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tickets/delete`,
                {
                ticketId: id
                },
                {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            })

            if (response.data) {
                await fetchContent();
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleOpenMessage = async (id: string) => {
        console.log('handleOpen', id);
    }

    const getRowClassName = (params) => {
        return params.row.status === 'open' ? styles.openRow : styles.closedRow;
    };

    return (
        <div className={styles.main}>
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
                    loading={loading}
                />

        </div>
    );
};

export default Tickets;
