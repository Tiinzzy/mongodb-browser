import React from "react";

import Box from '@mui/material/Box';

import './style.css';

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Box className="header-main-box" data-testid='header-main-box'>
                MongoDB  Browser
            </Box>
        );
    }
}