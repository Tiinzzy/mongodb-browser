import React from "react";

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from "@mui/material/Typography";

import BackEndConnection from './BackEndConnection';

const backend = BackEndConnection.INSTANCE();

export default class Connection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            handleCLoseDialog: props.handleCLoseDialog,
            host_name: 'localhost',
            port_name: 27017,
            connectionError: false,
            errorMsg: false
        }
    }

    getHostName(e) {
        this.setState({ host_name: e.target.value, connectionError: false, errorMsg: false });
    }

    getPortName(e) {
        this.setState({ port_name: e.target.value, connectionError: false, errorMsg: false });
    }

    connectAndClose() {
        backend.connect_mongo_db(this.state.host_name, this.state.port_name, (data) => {
            if (data.result) {
                this.state.handleCLoseDialog({ action: 'connect-and-close', info: { 'host': this.state.host_name, 'port': this.state.port_name } });
            } else {
                this.setState({ connectionError: true, errorMsg: true });
            }
        })
    }

    render() {
        return (
            <>
                <DialogTitle data-testid='dialog-title'>
                    {"Connect to MongoDB"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Connect to default Host and Port or eneter your own values.
                    </DialogContentText>
                    <FormControl variant="standard" style={{ marginTop: 20 }}>
                        <InputLabel htmlFor="component-simple">Host</InputLabel>
                        <Input id="component-simple" defaultValue={this.state.host_name} style={{ width: 400 }}
                            error={this.state.connectionError}
                            onChange={(e) => this.getHostName(e)} />
                    </FormControl>
                    <br />
                    <FormControl variant="standard" style={{ marginTop: 40, marginBottom: 20 }}>
                        <InputLabel htmlFor="component-simple">Port</InputLabel>
                        <Input id="component-simple" defaultValue={this.state.port_name} style={{ width: 400 }}
                            error={this.state.connectionError}
                            onChange={(e) => this.getPortName(e)} />
                    </FormControl>
                    <br />
                    <div style={{ height: 20 }}>
                        {this.state.errorMsg && <Typography variant="body2" color="#D22B2B">Could not connect to the server!</Typography>}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.connectAndClose()} variant="contained">Connect</Button>
                </DialogActions>
            </>
        );
    }
}