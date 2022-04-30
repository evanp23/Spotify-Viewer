import { render } from '@testing-library/react';
import React, { FC, Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import './SongBox.css';
require('spotify-web-api-js');

const token = process.env.REACT_APP_SPOTIFY_TOKEN!;

export default class SongBox extends Component{
  state={
    loading: true,
    currentSong: {} as any
  }
  static defaultProps={
    track: {} as any,
    current: false,
    token: '',
  }
  
  spotifyApi = new SpotifyWebApi();
  track!: any;
  current!: boolean;

  finalTrack;
  playingSongPreview = false;
  audioPaused = false;
  audioStopped = true;
  previewAudio!: HTMLAudioElement;

  constructor(props: any){
    super(props);
    this.spotifyApi.setAccessToken(props.token);
    this.state.currentSong = props.track.item;
    this.track = props.track;
    this.finalTrack = props.track;
    this.current = props.current;
  }

  componentDidMount(){
    if(this.current){
      this.getCurrentPlaybackState();
      setInterval(()=> this.getCurrentPlaybackState(), 250);
    }
  }

  render(){
    this.current && this.state.currentSong ? this.finalTrack = this.state.currentSong.item : this.finalTrack = this.track;
    return(
      <div id="songBoxDiv">
        
          <div>
            <img id="songImage" src={this.finalTrack.album.images[2].url} onClick={() => this.onImageClicked(this.finalTrack.preview_url, this.track.name)}/>
          </div>
          <div id="longBox">
            <div id="nameAndArtistBox">
              <h3 id="nameH3">{this.finalTrack.name}</h3>
              <p id="artistP">{this.finalTrack.artists[0].name}</p>
            </div>
              {!this.state.loading  ? <p>{
                  this.msToTime(this.state.currentSong.progress_ms)
                  + "/" + 
                  this.msToTime(this.state.currentSong.item.duration_ms)
                }</p>  : <></>}
          </div>
      </div>
    );
  }

  onImageClicked(songUrl: string, songName: string){
    if(this.audioStopped){
      this.previewAudio = new Audio(songUrl);
      this.previewAudio.volume = 0.1;
      this.previewAudio.play();
      this.playingSongPreview = true;
      this.audioStopped = false;
      this.audioPaused = false;
    }
    else if(this.audioPaused){
      this.previewAudio.play();
      this.audioPaused = false;
      this.playingSongPreview = true;
      this.audioStopped = false;
    }
    else if(this.playingSongPreview){
      this.previewAudio.pause();
      this.audioPaused = true;
      this.playingSongPreview = false;
    }
  }
  
  async getCurrentPlaybackState(){
    this.spotifyApi.getMyCurrentPlaybackState()
    .then(
      (data) => {
        this.setState({currentSong: data, loading: false});
      },
      function(err){
        console.log(err);
      }
    )
  }

  pad(n: number, z?: number) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  msToTime(s: any) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs == 0 ? ( this.pad(mins) + ':' + this.pad(secs)) : (this.pad(hrs) + ':' + this.pad(mins) + ':' + this.pad(secs));
  }

}



