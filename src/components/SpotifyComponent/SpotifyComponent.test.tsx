import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SpotifyComponent from './SpotifyComponent';

describe('<SpotifyComponent />', () => {
  test('it should mount', () => {
    render(<SpotifyComponent />);
    
    const spotifyComponent = screen.getByTestId('SpotifyComponent');

    expect(spotifyComponent).toBeInTheDocument();
  });
});