import React, { Component, useState } from 'react';
import './SpotifyComponent.css';
import SpotifyWebApi from 'spotify-web-api-js';
import SongBox from '../SongBox/SongBox';

const client_id = process.env.REACT_APP_CLIENT_ID!;
const client_secret = process.env.REACT_APP_CLIENT_SECRET!;
const refresh_token = process.env.REACT_APP_REFRESH_TOKEN!;

export default class SpotifyComponent extends Component{
  spotifyApi = new SpotifyWebApi();
  spotify_me!: any;
  songs: any;
  currentlyPlaying: any;
  currentSongInterval: any;

  state = {
    loadingSongs: true,
    loadingCurrent: true,
    recentlyPlayed: null,
    currentlyPlaying: null,
    gotToken: false,
    spotifyToken: '',
    query: '',
    showingQueueSelector: false,
    searchResults: null as any,
    queuedSongs: null as any,
    showSearchList: false
  }

  constructor(props: any) {
    super(props);
    this.search = this.search.bind(this);
    this.showQueueSelector = this.showQueueSelector.bind(this);
    this.hideSearchListIfShowing = this.hideSearchListIfShowing.bind(this);
  }

  async componentDidMount() {
    this.getToken();
    setInterval(()=> this.getToken(), 3600000);
  }

  render(){
    return(
      <>
        {this.state.gotToken ? (
          <div id="songsDiv" onClick={this.hideSearchListIfShowing}>
            <>
              <div id="searchBox">

                <form id="searchForm">
                  <input autoComplete='off' id="songSearch" placeholder="Search for a song to add to my queue!" type="text" value={this.state.query} onChange={event => this.search(event)} />
                </form>
                <br></br>
                <>
                  {
                    !this.state.query ? (<></>) : (
                      <div id="searchList">
                          {!this.state.searchResults  || !this.state.showSearchList ? (<></>
                          ) : (
                            this.state.searchResults.tracks.items.map((val: any, key: any) => {
                              return (
                                <div id="searchItemBox" key={key} onClick={() => this.setQueueSong(val.uri)}>
                                  <img id = "searchItemImage" src={val.album.images[2].url} alt="" />
                                  <p>{val.artists[0].name + " - " + val.name}</p>
                                  
                                </div>
                                
                              );
                            }
                            ))}
                      </div>
                    )
                  }
                </>
              </div>
              <h1>I'm Currently Listening To:</h1>
                <>
                  <SongBox track={this.determineCurrentSong} current={true} token={this.state.spotifyToken} />
                  {/* <h1>{"CURRENTLY PLAYING: " + this.currentlyPlaying.item.name}</h1>
                  <p>{"TIME: " + this.msToTime(this.currentlyPlaying.progress_ms) + "/" + this.msToTime(this.currentlyPlaying.item.duration_ms)}</p> */}
                </>
            </>
            <>
              {!this.state.queuedSongs? (<></>) : (
                this.state.queuedSongs.map((val: any, key: any) => {
                  return (
                    <SongBox track={(val.track)} current={false} token={this.state.spotifyToken} key={key} />

                  );
                }
              ))}
            </>
            <>
              <h1>I recently listened to:</h1>
              {!this.songs || this.state.loadingSongs ? (<div>loading...</div>
              ) : (
                this.songs.items.map((val: any, key: any) => {
                  return (
                    <SongBox track={(val.track)} current={false} token={this.state.spotifyToken} key={key} />

                  );
                }
                ))}
              <h1 id="clickForQueue" onClick={this.showQueueSelector}>Wow! You're that curious? Click here to add a song to my queue!</h1>
              {
                !this.state.showingQueueSelector ? (<></>) : (<p>showing</p>)
              }
            </>
          </div>
        ) : (<h1>Loading</h1>)}
      </>
    );
  }

  determineCurrentSong(){
    if(this.state.currentlyPlaying){
      return this.state.currentlyPlaying;
    }
    else{
      return this.songs.items[0].track;
    }
  }

  async search(event: any) {
    this.setState({ query: event.target.value, showSearchList: true });
    console.log(this.state.query)
    this.spotifyApi.search(event.target.value, ["track"])
      .then(
        (data) => {
          this.state.searchResults = data;
          console.log("search: ", this.state.query, this.state.searchResults);
        },
        function (err) {
          console.log(err);
        }
      )
  }

  hideSearchListIfShowing(){
    if(this.state.showSearchList){
      this.setState({showSearchList: false});
    }
    console.log(this.state.showSearchList);
  }

  showQueueSelector(event: any) {
    this.setState({ showingQueueSelector: !this.state.showingQueueSelector });
  }

  async setQueueSong(uri: string) {
    this.spotifyApi.queue(uri)
      .then(
        function (data) {
          console.log('success: ', data);
        },
        function (err) {
          console.log(err);
        }
      );
  }

  async getToken() {
    const result = await fetch("https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=" + refresh_token, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });

    await result.json().then(
      (data) => {
        this.setState({ gotToken: true, spotifyToken: data.access_token });
        this.spotifyApi.setAccessToken(data.access_token);
        this.getRecentlyPlayedTracks();
        this.getCurrentPlaybackState();
      },
      function (err) {
        console.log(err);
      }
    )
  }

  async getPlaylists() {
    this.spotifyApi.getUserPlaylists('1227403990')
      .then(
        function (data) {
          // console.log('User Playlists', data);
        },
        function (err) {
          console.error(err);
        }
      )
  }

  async getRecentlyPlayedTracks() {

    this.spotifyApi.getMyRecentlyPlayedTracks().then(
      (data) => {
        this.songs = data;
        this.setState({ songs: data, loadingSongs: false });

        console.log("recent ", data);
      },
      function (err) {
        console.log(err);
      }
    );
  }

  async getCurrentPlaybackState() {
    if(this.state.currentlyPlaying){
      clearInterval()
    }
      this.spotifyApi.getMyCurrentPlaybackState()
        .then(
          (data) => {
            this.setState({ currentlyPlaying: data, loadingCurrent: false });
            this.currentlyPlaying = data;
          },
          function (err) {
            console.log(err);
          }
        );
  }
}