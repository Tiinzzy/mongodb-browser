import React from "react";

import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';

import UilDatabase from '@iconscout/react-unicons/icons/uil-database';
import UilFileAlt from '@iconscout/react-unicons/icons/uil-file-alt';

import BackEndConnection from './BackEndConnection';
import InsertDocumentNewCollection from './InsertDocumentNewCollection';
import DropCollection from './DropCollection';

import './style.css';
import { Divider } from "@mui/material";

const backend = BackEndConnection.INSTANCE();

export default class SideBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            connectionInfo: props.connectionInfo,
            getDataforDocuments: props.getDataforDocuments,
            openList: false,
            openCollections: '',
            selectedId: '',
            selectedDb: '',
            openDialog: false,
            selectedIcon: 0
        }
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
    }

    componentDidMount() {
        backend.get_databases_mongo_db(this.state.connectionInfo, (data) => {
            let that = this;
            that.setState({ databases: data.available_databases });
        })
    }

    handleOPenList() {
        this.setState({ openList: !this.state.openList });
    }

    getCollections(e, data) {
        if (this.state.openCollections === '') {
            this.setState({ selectedDb: e });
            let query = { 'host_name': this.state.connectionInfo.host, 'port_name': this.state.connectionInfo.port, 'database_name': e };
            backend.get_collections_mongo_db(query, (data) => {
                this.setState({ openCollections: e, collections: data.collections, setDatabase: e })
            });
        } else if (data && data.action === 'reload') {
            this.setState({ openCollections: e });
        } else {
            this.setState({ openCollections: '' });
        }
    }

    getDocuments(db, col) {
        let query = { action: 'ready-to-fetch', database: db, collection: col };
        this.state.getDataforDocuments(query);
        this.setState({ database: db, collection: col, selectedId: col });
    }

    reLoadContent() {
        let query = { action: 'reload-page', database: this.state.database, collection: this.state.collection };
        this.state.getDataforDocuments(query);
        this.getCollections(this.state.setDatabase, { action: 'reload' });
    }

    insertInNewCollection() {
        this.setState({ openDialog: true, selectedIcon: 1 });
    }

    dropCOllection() {
        this.setState({ openDialog: true, selectedIcon: 2 });
    }

    handleCloseDialog(data) {
        if (data && data.action === 'close-dialog') {
            this.setState({ openDialog: false, setDatabase: data.database }, () => {
                this.getCollections(data.database);
            });
        } else if (data && data.action === 'plain-close-dialog') {
            this.setState({ openDialog: false });
        } else {
            this.setState({ openDialog: false });
        }
    }

    render() {
        return (
            <>
                <Box display='flex'>
                    <Box flexGrow={1} />
                    <Tooltip title="Reload Data" arrow>
                        <IconButton color="black" onClick={() => this.reLoadContent()}>
                            <ReplayOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Insert Document in New Collection" arrow>
                        <IconButton color="black" onClick={() => this.insertInNewCollection()} >
                            <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Drop Collection" arrow>
                        <IconButton color="black" onClick={() => this.dropCOllection()}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Divider />
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}
                    component="nav">
                    <ListItemButton onClick={() => this.handleOPenList()}>
                        <UilDatabase size="25" color="black" />
                        <ListItemText primary="Databases" sx={{ marginLeft: 2 }} />
                        {this.state.openList ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={this.state.openList} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding >
                            {this.state.databases && this.state.databases.map((e, i) => (
                                <Box key={i} >
                                    <ListItemButton sx={{ pl: 4 }} onClick={() => this.getCollections(e)}>
                                        <UilDatabase size="15" color="black" />
                                        <ListItemText primary={e} sx={{ marginLeft: 1.5 }}
                                            style={{ color: this.state.selectedDb === e ? '#1589FF' : 'black' }}
                                            onClick={() => this.setState({ selectedDb: e })} />
                                        {this.state.openCollections === e ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={this.state.openCollections === e} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {this.state.collections && this.state.collections.map((ee, i) => (
                                                <ListItemButton key={i} sx={{ pl: 8 }} onClick={() => this.getDocuments(e, ee)}>
                                                    <UilFileAlt size="15" color="black" />
                                                    <ListItemText primary={ee} sx={{ marginLeft: 1.5 }}
                                                        style={{ color: this.state.selectedId === ee ? '#1589FF' : 'black' }}
                                                        onClick={() => this.setState({ selectedId: ee })} />
                                                </ListItemButton>
                                            ))}
                                        </List>
                                    </Collapse>
                                </Box>
                            ))}
                        </List>
                    </Collapse>
                </List>
                <Dialog maxWidth="xl" open={this.state.openDialog} onClose={() => this.handleCloseDialog()}>
                    {this.state.selectedIcon === 1 ?
                        <InsertDocumentNewCollection handleCloseDialog={this.handleCloseDialog} connectionInfo={this.state.connectionInfo} /> :
                        <DropCollection handleCloseDialog={this.handleCloseDialog} connectionInfo={this.state.connectionInfo} />
                    }
                </Dialog>
            </>
        );
    }
}