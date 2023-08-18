
import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import Home from "./components/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";

import axios from 'axios';


const FOOTER_OFFSET = 185;

function getWindowSize() {
  let sizes = { h: window.innerHeight, w: window.innerWidth }

  if (sizes.h < 730) {
    sizes.h = 730;
  }

  sizes.h -= FOOTER_OFFSET;
  return sizes;
}


function RealApp() {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function resizeHandler() {
      setWindowSize(getWindowSize())
    }
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  })

  return (
    <>
      <Header />
      <div style={{ height: windowSize.h }}>
        <Home />
      </div>
      <Footer />
    </>

  );
}

export default function App() {

  axios.get('/db/mongodb/test').then(resp => {
    console.log(resp.data);
});

  return (
    // <BrowserRouter basename="/db">
      <RealApp />
    // </BrowserRouter>
  )
}
