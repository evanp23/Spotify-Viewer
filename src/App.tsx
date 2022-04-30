import React, { Component } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import SongBox from './components/SongBox/SongBox';
import { Buffer } from "buffer";
import { runInThisContext } from 'vm';


require('spotify-web-api-js');
const client_id = process.env.REACT_APP_CLIENT_ID!;
const client_secret = process.env.REACT_APP_CLIENT_SECRET!;
const refresh_token = process.env.REACT_APP_REFRESH_TOKEN!;




class App extends Component{
  //TODO: GET RID OF TRACK IN PROPS AND JUST HAVE IT IN STATE
  
  spotifyApi = new SpotifyWebApi();
  spotify_me!: any;
  songs: any;
  currentlyPlaying: any;
  state={
    loadingSongs: true,
    loadingCurrent: true,
    recentlyPlayed: null,
    currentlyPlaying: null,
    gotToken: false,
    spotifyToken: '',
  }

  constructor(props: any){
    super(props);
    
  }

  async componentDidMount(){
    this.getToken()
  }

  render(){
    return (
      <>
        {this.state.gotToken ? (
        <div id="pageBox">
          <div id="leftBox">
          </div>
          <div id="songsDiv">
            <>
                {this.state.loadingCurrent || !this.state.currentlyPlaying ? (<h1>loading....</h1>) : ( 
                  <>
                    <SongBox track={this.currentlyPlaying.item} current={true} token={this.state.spotifyToken}/>
                    {/* <h1>{"CURRENTLY PLAYING: " + this.currentlyPlaying.item.name}</h1>
                    <p>{"TIME: " + this.msToTime(this.currentlyPlaying.progress_ms) + "/" + this.msToTime(this.currentlyPlaying.item.duration_ms)}</p> */}
                  </>
                )}
            </>
            <>
              {!this.songs || this.state.loadingSongs ? (<div>loading...</div>
              ) : (
                  this.songs.items.map((val: any, key: any) => {
                    return(
                      <div id="songContainer" key={key}>
                        <SongBox track={(val.track)} current={false} token={this.state.spotifyToken}/>
                      </div>
                    );
                  }
              ))}
            </>
          </div>
          <div id="rightBox">
          </div>
        </div>
        ): <h1> loading</h1>}
      </>
    );
  }

  async setQueueSong(){
    this.spotifyApi.queue('spotify:track:4iV5W9uYEdYUVa79Axb7Rh')
    .then(
      function(data){
        // console.log('success: ', data);
      },
      function(err){
        console.log(err);
      }
    )
  }

  async getToken(){
    const result = await fetch("https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=" + refresh_token, {
      method: 'POST',
      headers:{
        'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret),
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
    });

    await result.json().then(
      (data) =>{
        this.setState({gotToken:true, spotifyToken:data.access_token});
        this.spotifyApi.setAccessToken(data.access_token);
        this.getRecentlyPlayedTracks();
        this.getCurrentPlaybackState();
      },
      function(err){
        console.log(err);
      }
    )
  }

  async getPlaylists(){
    this.spotifyApi.getUserPlaylists('1227403990')
    .then(
      function(data){
        // console.log('User Playlists', data);
      },
      function(err){
        console.error(err);
      }
    )
  }

  async getRecentlyPlayedTracks(){
    
    this.spotifyApi.getMyRecentlyPlayedTracks().then(
      (data) =>{
        this.songs = data;
        this.setState({songs: data, loadingSongs: false});
        
        console.log("recent ",data);
      },
      function(err){
        console.log(err);
      }
    );
  }

  async getCurrentPlaybackState(){
    this.spotifyApi.getMyCurrentPlaybackState()
    .then(
      (data)=>{
        this.setState({currentlyPlaying:data, loadingCurrent:false});
        this.currentlyPlaying = data;
        console.log("CURRENT", data);
      },
      function(err){
        console.log(err);
      }
    );
  }
}

export default App;
