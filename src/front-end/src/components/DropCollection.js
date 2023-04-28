import React from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DialogContentText from '@mui/material/DialogContentText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import BackEndConnection from './BackEndConnection';

import './style.css';

const backend = BackEndConnection.INSTANCE();

function safeLength(s, max) {
    if (s.length > max) {
        return s.substring(0, max) + ' ...';
    } else {
        return s;
    }
}

export default class DropCollection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            handleCloseDialog: props.handleCloseDialog,
            connectionInfo: props.connectionInfo,
            newData: '',
            collectionName: '',
            databaseName: '',
            query: {},
            dataReady: true,
            dropButton: true
        }
    }


    cloneQuery() {
        let query = { ...this.state.query };
        query['database_name'] = this.state.databaseName;
        query['host_name'] = this.state.connectionInfo.host;
        query['port_name'] = this.state.connectionInfo.port;
        if (this.state.collectionName) {
            query['collection_name'] = this.state.collectionName;
        }
        return query;
    }

    componentDidMount() {
        backend.get_databases_mongo_db(this.cloneQuery(), (data) => {
            this.setState({ availableDatabases: data.available_databases });
        })
    }

    getDatabaseName(e) {
        this.setState({ databaseName: e.target.value, collectionName: '', documents: '', dropButton: true }, () => {
            this.getCollectionList();
        });
    }

    getCollectionList() {
        backend.get_collections_mongo_db(this.cloneQuery(), (data) => {
            this.setState({ collections: data.collections, dataReady: false, dropButton: true });
        })
    }

    getCollectionName(e) {
        this.setState({ collectionName: e.target.value }, () => {
            let query = this.cloneQuery();
            backend.get_documents_mongo_db(query, (data) => {
                this.setState({ documents: data.documents, dropButton: true });
            })
        });
    }

    cancelAndClose() {
        this.state.handleCloseDialog({ action: 'plain-close-dialog' });
    }

    submitAndClose() {
        backend.drop_collection_mongo_db(this.cloneQuery(), (data) => {
            if (data.result) {
                this.state.handleCloseDialog({ action: 'close-dialog', database: this.state.databaseName });
            }
        })
    }

    getRadioButton(e) {
        if (e.target.value === 'Yes') {
            this.setState({ dropButton: false });
        } else if (e.target.value === 'No') {
            this.setState({ dropButton: true });
        }
    }

    render() {
        return (
            <>
                <DialogTitle>
                    {"Drop a Collection"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Select a database and choose a collection to check data and drop the collection.
                    </DialogContentText>
                    <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 3 }}>
                        <InputLabel id="demo-simple-select-label">Database</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={this.state.databaseName}
                            label="Database"
                            onChange={(e) => this.getDatabaseName(e)}>
                            {this.state.availableDatabases && this.state.availableDatabases.map((e, i) => (
                                <MenuItem key={i} value={e}>{e}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ marginBottom: 3 }} disabled={this.state.dataReady}>
                        <InputLabel id="demo-simple-select-label">Collection</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={this.state.collectionName}
                            label="COllection"
                            onChange={(e) => this.getCollectionName(e)}>
                            {this.state.collections && this.state.collections.map((e, i) => (
                                <MenuItem key={i} value={e}>{e}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div style={{ padding: 10, border: 'solid 1px #bbb', width: '97.8%', marginBottom: 15 }}>
                        <Box className="display-documents-drop-collection-box">
                            <table width="100%" style={{ fontSize: '80%', backgroundColor: 'white', maring: 5 }} cellPadding={0} cellSpacing={1}>
                                <tbody >
                                    <tr>
                                        <th width='20%'>ObjectId</th>
                                        <th width='20%'>Number of Object Keys</th>
                                        <th width='60%'>Values</th>
                                    </tr>
                                    {this.state.documents && this.state.documents.map((e, i) => (
                                        <tr key={i}>
                                            <td>
                                                {e._id}
                                            </td>
                                            <td>
                                                {Object.keys(e).length}
                                            </td>
                                            <td>
                                                {safeLength(JSON.stringify(e), 100)}
                                            </td>
                                        </tr>))}
                                </tbody>
                            </table>
                        </Box>
                    </div>
                    <Box style={{ width: 999, border: 'solid 0px red', height: 22 }}>
                        {this.state.collectionName !== '' && this.state.collectionName &&
                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Typography mr={2}>
                                    Are you sure you want to drop <span style={{ fontWeight: 'bold', color: 'red' }}> {this.state.collectionName} </span> collection?
                                </Typography>
                                <FormControl>
                                    <RadioGroup row onChange={(e) => this.getRadioButton(e)}>
                                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="No" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        }
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => this.cancelAndClose()}>Cancel</Button>
                    <Button variant="outlined" onClick={() => this.submitAndClose()} color="error" disabled={this.state.dropButton}>Drop Collection</Button>
                </DialogActions>
            </>
        );
    }
}