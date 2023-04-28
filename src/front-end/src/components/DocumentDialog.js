import React from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import DialogContentText from '@mui/material/DialogContentText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import BackEndConnection from './BackEndConnection';

import './style.css';

const backend = BackEndConnection.INSTANCE();

export default class DocumentDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            clickedRow: props.clickedRow,
            oneDocument: JSON.stringify(props.oneDocument, null, 3),
            handleCLoseDialog: props.handleCLoseDialog,
            query: props.query,
            errorMessage: '',
            deleteButton: true
        }
    }

    getDocumentChanges(e) {
        this.setState({ oneDocument: e.target.value });
    }

    cancelAndCLose() {
        this.state.handleCLoseDialog({ action: 'close' });
    }

    updatedDocument() {
        try {
            let newOneDocument = JSON.parse(this.state.oneDocument);
            delete newOneDocument['_id'];

            let query = { ...this.state.query };
            query['document_id'] = this.state.clickedRow;
            query['documents'] = newOneDocument;

            backend.update_document_mongo_db(query, (data) => {
                if (data.result) {
                    this.state.handleCLoseDialog({ action: 'close' });
                };
            });
        } catch (err) {
            this.setState({ errorMessage: err.toString() })
        }

    }

    deleteDocument() {
        let query = { ...this.state.query };
        query['_id'] = this.state.clickedRow;
        backend.delete_document_mongo_db(query, (data) => {
            if (data.result) {
                this.state.handleCLoseDialog({ action: 'close' });
            };
        })
    }

    getRadioButton(e) {
        if (e.target.value === 'Yes') {
            this.setState({ deleteButton: false });
        } else if (e.target.value === 'No') {
            this.setState({ deleteButton: true });
        }
    }

    render() {
        return (
            <>
                <DialogTitle>
                    {'ObjectId("' + this.state.clickedRow + '")'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Type in to edit Document.
                    </DialogContentText>
                    <TextField
                        InputProps={{ spellCheck: 'false' }}
                        fullWidth multiline
                        id="json-content"
                        variant="outlined"
                        label="Document"
                        sx={{ '& .MuiInputBase-input': { fontFamily: 'Courier', fontSize: '80%', color: this.state.errorMessage !== '' ? '#DC143C' : '#555' }, marginTop: 2, marginBottom: 1 }}
                        rows={20}
                        value={this.state.oneDocument}
                        onChange={(e) => this.getDocumentChanges(e)}
                    />
                    <Box style={{ width: 1000, height: 25 }}>
                        {this.state.clickedRow &&
                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Typography mr={2}>
                                    Select yes if you want to delete the document.
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
                    <span style={{ marginLeft: 15, color: '#DC143C' }}>
                        {this.state.errorMessage !== '' && this.state.errorMessage}
                    </span>
                    <Box display="flex" flexGrow={1} />
                    <Button variant="outlined" onClick={() => this.cancelAndCLose()}>Cancel</Button>
                    <Button variant="outlined" color="error" onClick={() => this.deleteDocument()} disabled={this.state.deleteButton}>Delete</Button>
                    <Button variant="outlined" onClick={() => this.updatedDocument()}>Update</Button>
                </DialogActions>
            </>
        );
    }
}