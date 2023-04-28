import React from "react";

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';

import Connection from "./Connection";
import SideBar from "./SideBar";
import DocumentsTable from "./DocumentsTable";

import './style.css';

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openDialog: true,
            componentReady: false,
            dataReady: false
        }
        this.handleCLoseDialog = this.handleCLoseDialog.bind(this);
        this.getDataforDocuments = this.getDataforDocuments.bind(this);
    }

    handleCLoseDialog(callback) {
        if (callback && callback.action === 'connect-and-close') {
            this.setState({ openDialog: false, connectionInfo: callback.info }, () => {
                this.setState({ componentReady: true });
            });
        }
    }

    getDataforDocuments(data) {
        if (data && data.action === 'ready-to-fetch' && this.state.dataReady === false) {
            this.setState({ database: data.database, collection: data.collection }, () => {
                this.setState({ dataReady: true });
            })
        } else if ((data && data.action === 'ready-to-fetch' && this.state.dataReady === true) || data && data.action === 'reload-page') {
            this.setState({ database: data.database, collection: data.collection });
        }
    }

    render() {
        return (
            <Box className="home-page-main-box">
                <Box className="left-side-bar">
                    {this.state.componentReady &&
                        <SideBar connectionInfo={this.state.connectionInfo} getDataforDocuments={this.getDataforDocuments} />}
                </Box>
                <Box className="right-side-box">
                    {this.state.componentReady && this.state.dataReady &&
                        <DocumentsTable collection={this.state.collection} database={this.state.database} connectionInfo={this.state.connectionInfo} />}
                </Box>
                <Dialog maxWidth="md" open={this.state.openDialog} onClose={() => this.handleCLoseDialog()}>
                    <Connection handleCLoseDialog={this.handleCLoseDialog} />
                </Dialog>
            </Box>
        );
    }
}