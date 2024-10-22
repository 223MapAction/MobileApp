import React from 'react';
import { render } from '@testing-library/react-native';
import Slide2 from '../../slides/Slide2'; 


describe('Slide2 component', () => {
  it('should render correctly', () => {
    const { getByText, getByTestId } = render(<Slide2 />);

    expect(getByText('Contribuez activement à la protection de l\'environnement')).toBeTruthy();

    expect(getByText(/Faites partie du changement/)).toBeTruthy();

    const image = getByTestId('myImage2'); 
    expect(image).toBeTruthy();
  });
});
