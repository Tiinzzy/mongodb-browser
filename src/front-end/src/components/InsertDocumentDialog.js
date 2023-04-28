import React from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';

import BackEndConnection from './BackEndConnection';

import './style.css';

const backend = BackEndConnection.INSTANCE();

export default class InsertDocumentDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collection: props.collection,
            handleCLoseDialog: props.handleCLoseDialog,
            connectionInfo: props.connectionInfo,
            database: props.database,
            newData: '',
            query: {
                host_name: props.connectionInfo.host,
                port_name: props.connectionInfo.port,
                database_name: props.database,
                collection_name: props.collection,
            },
            errorMessage: ''
        }
    }

    getDocumentData(e) {
        this.setState({ newData: e.target.value, errorMessage: '' });
    }

    cancelAndCLose() {
        this.state.handleCLoseDialog({ action: 'close' });
    }

    addDocument() {
        try {
            let parsedDocument = JSON.parse(this.state.newData);
            let query = { ...this.state.query };
            query['documents'] = parsedDocument;
            backend.insert_documents_mongo_db(query, (data) => {
                if (data.inserted_count > 0) {
                    this.state.handleCLoseDialog({ action: 'close' });
                };
            });
        } catch (err) {
            this.setState({ errorMessage: err.toString() });
        }
    }

    render() {
        return (
            <>
                <DialogTitle>
                    Insert into <span style={{ fontWeight: 'bold' }}>  {this.state.collection} </span>  collection
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the json you would like to save in the collection.
                    </DialogContentText>
                    <TextField
                        sx={{ marginTop: 2, marginBottom: 3, '& .MuiInputBase-input': { fontFamily: 'Courier', fontSize: '80%', color: this.state.errorMessage !== '' ? '#DC143C' : '#555' } }}
                        fullWidth multiline
                        rows={20}
                        InputProps={{ spellCheck: 'false' }}
                        label="Data"
                        variant="outlined"
                        value={this.state.newData}
                        onChange={(e) => this.getDocumentData(e)}
                    />
                    <Box style={{ width: 1000, border: 'solid 0px red', height: 10 }}>
                        <span style={{ color: '#DC143C' }}>
                            {this.state.errorMessage !== '' && this.state.errorMessage}
                        </span>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => this.cancelAndCLose()}>Cancel</Button>
                    <Button variant="outlined" onClick={() => this.addDocument()}>Add</Button>
                </DialogActions>
            </>
        );
    }
}