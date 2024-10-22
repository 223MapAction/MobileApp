import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Popup from '../../shared/Popup';
import { ActivityIndicator } from 'react-native';

describe('Popup component', () => {
    it('should render the modal correctly when visible', () => {
      const { getByTestId } = render(<Popup><ActivityIndicator /></Popup>);
  
      const modal = getByTestId('modal');
      expect(modal.props.visible).toBe(true);
    });
  
    it('should hide the modal when state changes', () => {
      const onHide = jest.fn();
      const { getByTestId } = render(<Popup onHide={onHide}><ActivityIndicator /></Popup>);
      
      const modal = getByTestId('modal');
  
      fireEvent(modal, 'onRequestClose');
  
      expect(onHide).toHaveBeenCalled(); 
    });
  });
