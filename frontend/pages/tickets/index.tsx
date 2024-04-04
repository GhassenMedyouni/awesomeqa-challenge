import * as React from "react";
import { NextPage } from "next";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {useEffect, useState} from "react";
import axios from "axios";
import { CircularProgress, Button } from "@mui/material";
import styles from "./tickets.module.css"
import { useRouter } from "next/router";
import ContextMessagesCell from "../../components/ContextMessageCell";

const Tickets: NextPage = () => {

    const router = useRouter();
    const [rows, setRows] = useState([])
    const [fetchLoading, setFetchLoading] = useState(true)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [resolveLoading, setResolveLoading] = useState(false)


    useEffect(() => {
        fetchContent()
    }, [])

    const columns: GridColDef[] = [
        { field: 'msg_id', headerName: 'Message Id', width: 130 },
        { field: 'resolved_by', headerName: 'Resolved By', width: 180 },
        {
            field: 'timestamp',
            headerName: 'Created At',
            type: 'string',
            width: 150,
            valueGetter: (timestamp: string) => {
                if (!timestamp) return '';
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
                if (!timestamp) return '';
                const date = new Date(timestamp);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 80,
        },
        {
            field: 'context_messages',
            headerName: 'Context',
            width: 200,
            renderCell: (params) => (
                <ContextMessagesCell value={params.row.context_messages} />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <div className={styles.actionContainer}>
                    <Button variant="contained" color="success"
                            disabled={resolveLoading}
                            onClick={() => handleOpenMessage(params.row.id, params.row.msg_id)}
                    >
                        {resolveLoading ? <CircularProgress color={"inherit"} size={20}/>  :"Open"}
                    </Button>
                    <Button variant="contained" color="error"
                            disabled={deleteLoading}
                            onClick={() => handleDelete(params.row.id)}
                    >
                        {deleteLoading ? <CircularProgress color={"inherit"} size={20}/>  :"Delete"}
                    </Button>

                </div>

            ),
        }
    ];

    const fetchContent = async () => {
        try {
            setFetchLoading(true);
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
            if (err.response && err.response.status === 401 && err.response.data.detail === "Unauthorized") {
                await router.push("/login")
            }
        } finally {
            setFetchLoading(false);
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

    const handleOpenMessage = async (id: string, msg_id) => {
        try {
            setResolveLoading(true);
            const msg_url = `https://discord.com/channels/${process.env.DISCORD_SERVER_ID}/${process.env.DISCORD_CHANNEL_ID}/${msg_id}`;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tickets/open`,
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
                window.open(msg_url, '_blank');
                alert("The msg_url is: " + msg_url);
                await fetchContent();
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setResolveLoading(false)
        }
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
                    loading={fetchLoading}
                />

        </div>
    );
};

export default Tickets;
