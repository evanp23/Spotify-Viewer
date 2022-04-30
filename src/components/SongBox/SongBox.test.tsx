import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SongBox from './SongBox';

// describe('<SongBox />', () => {
//   test('it should mount', () => {
//     render(<SongBox />);
    
//     const songBox = screen.getByTestId('SongBox');

//     expect(songBox).toBeInTheDocument();
//   });
// });