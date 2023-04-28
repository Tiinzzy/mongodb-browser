import React from "react";

import Box from '@mui/material/Box';

import './style.css';

export default class Footer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Box className="footer-main-box" data-testid='footer-main-box'>
                Designed by Tina Vatanabadi, Copyright © 2023. All Rights Reserved
            </Box>
        );
    }
}