import React, { Component, FC } from 'react';
import './Search.css';


export default class Search extends React.Component{
  static defaultProps={
    searchQuery: '',
    setSearchQuery: '' as any
  }

  searchQuery = ''
  setSearchQuery;

  constructor(props: any){
    super(props);

    this.searchQuery = props.searchQuery;
    this.setSearchQuery = props.searchQuery;
  }

  render(){
    return(
    <form>
      <input
        value={this.searchQuery}
        onInput={(event) => this.setSearchQuery((event.target as HTMLInputElement).value as string)}
        type="text"
        id="song-search"
        name="s"
      />
    </form>
    );
  }
}
