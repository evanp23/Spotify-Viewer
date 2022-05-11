import React, { Component, useState } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import SongBox from './components/SongBox/SongBox';
import SpotifyComponent from './components/SpotifyComponent/SpotifyComponent';

const client_id = process.env.REACT_APP_CLIENT_ID!;
const client_secret = process.env.REACT_APP_CLIENT_SECRET!;
const refresh_token = process.env.REACT_APP_REFRESH_TOKEN!;




class App extends Component {
 

  render() {
    return (
      <>
        <div id="pageBox">
          <div id="leftBox">
          </div>
            <SpotifyComponent></SpotifyComponent>
          <div id="rightBox">
          </div>
        </div>
      </>
    );
  }

 
}

export default App;
