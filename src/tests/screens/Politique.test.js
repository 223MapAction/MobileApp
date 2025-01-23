import React from 'react';
import { render } from '@testing-library/react-native';
import Politique from '../../screens/politique';

jest.mock('react-native-markdown-display', () => 'Markdown');
jest.mock('../../screens/newScreen/PolitiqueText', () => 'Test Politique Content');

describe('Politique Component', () => {
  describe('Rendu du composant', () => {
    it('devrait rendre le composant correctement', () => {
      const { getByTestId } = render(<Politique />);
      expect(getByTestId('politique-container')).toBeTruthy();
    });

    it('devrait rendre le contenu Markdown avec le bon texte', () => {
      const { getByTestId } = render(<Politique />);
      const markdown = getByTestId('politique-markdown');
      expect(markdown.props.children).toBe('Test Politique Content');
    });

    it('devrait avoir les bons styles', () => {
      const { getByTestId } = render(<Politique />);
      const container = getByTestId('politique-container');
      
      expect(container.props.style).toMatchObject({
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20
      });
    });
  });

  describe('Styles Markdown', () => {
    it('devrait avoir les bons styles pour les titres', () => {
      const { getByTestId } = render(<Politique />);
      const markdown = getByTestId('politique-markdown');
      
      expect(markdown.props.style.heading1).toMatchObject({
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C9CDB'
      });
    });

    it('devrait avoir les bons styles pour le texte', () => {
      const { getByTestId } = render(<Politique />);
      const markdown = getByTestId('politique-markdown');
      
      expect(markdown.props.style.text).toMatchObject({
        fontSize: 16,
        color: '#858585'
      });
    });
  });
});
