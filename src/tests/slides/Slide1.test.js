import React from 'react';
import { render } from '@testing-library/react-native';
import Slide1 from '../../slides/Slide1'; 

describe('Slide1 component', () => {
  it('should render correctly', () => {
    const { getByText, getByTestId } = render(<Slide1 />);

    expect(getByText('Signalez un incident en 3 clics.')).toBeTruthy();

    expect(getByText(/Aidez à protéger l'environnement/)).toBeTruthy();

    const image = getByTestId('myImage');
    expect(image).toBeTruthy();
  });
});
