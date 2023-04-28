import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGetData } from "../hooks/useGetData";
import Button from '@mui/material/Button';
import { Autocomplete, TextField, Box } from '@mui/material';
import { endpoints } from '../constants/api.constant';
import { rawAPI } from '../api/API';
import { useQuery } from 'react-query';

export const DataTable = () => {
    const columns: GridColDef[] = [
        { field: 'ConsumedQuantity', headerName: 'Consumed Quantity', width: 150 },
        { field: 'Cost', headerName: 'Cost' },
        { field: 'Date', headerName: 'Date', width: 150 },
        { field: 'MeterCategory', headerName: 'MeterCategory', width: 150 },
        { field: 'ResourceGroup', headerName: 'ResourceGroup', width: 150 },
        { field: 'UnitOfMeasure', headerName: 'UnitOfMeasure', width: 150 },
        { field: 'Location', headerName: 'Location', width: 150 },
        { field: 'InstanceId', headerName: 'InstanceId', width: 150 },
        { field: 'id', headerName: 'id', width: 150 },
        {
            field: 'Tags', headerName: 'Tags', width: 150, valueGetter: (params) => {
                if (params.value) {
                    return params.value["app-name"];
                }
            }
        }
    ];
    const {
        refetch,
        isLoading,
        data
    } = useGetData();
    const [rows, setRows] = useState([]);
    const [apps, setApps] = useState([]);
    const [resources, setResources] = useState([]);
    const [appValue, setAppValue] = React.useState<string | undefined>('');
    const [resValue, setResValue] = React.useState<string | undefined>('');
    const [clear, setClear] = useState(false);
    const [hiddenColumns, setHiddenColumns] = useState({});

    const addNewId = (data: any) => data.map((row: any) => { return { ...row, id: Math.floor(Math.random() * (100000 - 1 + 1)) + 1 } })

    // Fetch all applications
    const { refetch: refetchApp } = useQuery(endpoints.application, () => rawAPI.getAllApplications(appValue), {
        retry: false,
        retryOnMount: false,
        refetchOnWindowFocus: false,
        enabled: false,
        onSuccess: (res: any) => {
            if (appValue === '') {
                setApps(res);
            }
            else {
                if (res) {
                    setRows(addNewId(res) ?? []);
                    setHiddenColumns({ Tags: false })
                }
            }
        },
        onError: (error: Error) => error,
    });

    // Fetch all resources
    const { refetch: refetchRes } = useQuery(endpoints.resources, () => rawAPI.getAllResources(resValue), {
        retry: false,
        retryOnMount: false,
        refetchOnWindowFocus: false,
        enabled: false,
        onSuccess: (res: any) => {
            if (resValue === '') {
                setResources(res);
            }
            else {
                if (res) {
                    setRows(addNewId(res) ?? []);
                    setHiddenColumns({})
                }
            }
        },
        onError: (error: Error) => error,
    });

    useEffect(() => {
        refetch();
        if (data) {
            setRows(addNewId(data) ?? []);
        }
    }, [refetch, data, clear]);

    useEffect(() => {
        refetchApp();
        refetchRes();
    }, [refetchApp, refetchRes]);

    useEffect(() => {
        refetchApp();
    }, [appValue]);

    useEffect(() => {
        refetchRes();
    }, [resValue]);

    const onAppChange = (newValue: string | undefined) => {
        newValue !== '' ? setAppValue(newValue) : setClear(!clear);
        setResValue('');
    };
    const onResChange = (newValue: string | undefined) => {
        newValue !== '' ? setResValue(newValue) : setClear(!clear);
        setAppValue('');
    };

    const onButtonChange = () => {
        setAppValue('');
        setResValue('');
        setClear(!clear);
        setHiddenColumns({});
    }

    const rowId = (rows: any) => rows.id;

    return (
        <Box sx={{ margin: '1%' }}>
            <Box display="flex" sx={{ marginBottom: '1%' }}>
                <div style={{ margin: '1%' }}> Search By</div>
                <Autocomplete
                    disablePortal
                    id="id-application"
                    disableClearable={true}
                    options={apps}
                    value={appValue}
                    onChange={(event, newValue) => {
                        onAppChange(newValue ?? '');
                    }}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Application" />}
                />
                <div style={{ margin: '1%' }}>OR</div>
                <Autocomplete
                    disablePortal
                    id="id-resources"
                    disableClearable={true}
                    value={resValue}
                    options={resources}
                    onChange={(event, newValue) => {
                        onResChange(newValue ?? '');
                    }}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Resources" />}
                />
                <Button style={{ marginLeft: '1%' }} variant="contained" onClick={onButtonChange}>Clear & Refresh</Button>
            </Box>

            <div style={{ height: 550, width: '100%' }}>
                <DataGrid
                    loading={isLoading}
                    getRowId={rowId}
                    rows={rows}
                    columns={columns}
                    columnVisibilityModel={{
                        id: false,
                        ...hiddenColumns
                    }}
                />
            </div>
        </Box>
    );
};