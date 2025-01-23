import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Accueil from '../../slides/Acceuil';
import Slide1 from '../../slides/Slide1';
import Slide2 from '../../slides/Slide2';

// Mock AppIntroSlider
jest.mock('react-native-app-intro-slider', () => {
  return function MockedAppIntroSlider(props) {
    // Simuler le rendu des slides
    return (
      <div testID="app-intro-slider">
        {props.data.map((item) => props.renderItem({ item }))}
        {props.renderNextButton()}
        {props.renderDoneButton()}
      </div>
    );
  };
});

describe('Accueil Component', () => {
  const mockedNavigate = jest.fn();
  const mockedReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createNavigationProp = () => ({
    replace: mockedReplace,
    push: mockedNavigate,
  });

  it('devrait rendre correctement tous les slides', () => {
    const { getByTestId } = render(<Accueil navigation={createNavigationProp()} />);
    const slider = getByTestId('app-intro-slider');
    expect(slider).toBeTruthy();
  });

  it('devrait rendre le logo dans chaque slide', () => {
    const { getAllByRole } = render(<Accueil navigation={createNavigationProp()} />);
    const images = getAllByRole('image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('devrait avoir les bons items dans le slider', () => {
    const component = new Accueil({ navigation: createNavigationProp() });
    expect(component.items).toEqual([
      { Content: Slide1, key: "0" },
      { Content: Slide2, key: "1" },
    ]);
  });

  it('devrait rendre correctement un item individuel', () => {
    const component = new Accueil({ navigation: createNavigationProp() });
    const item = { Content: Slide1, key: "0" };
    const renderedItem = component.renderItem({ item });
    const { getByTestId } = render(renderedItem);
    expect(getByTestId('slide-content')).toBeTruthy();
  });

  it('devrait rendre les boutons avec le bon style', () => {
    const component = new Accueil({ navigation: createNavigationProp() });
    
    const nextButton = component.renderButton('SUIVANT', 'nextButton');
    const doneButton = component.renderButton('COMMENCER', 'doneButton');
    
    const { getByTestId } = render(
      <div>
        {nextButton}
        {doneButton}
      </div>
    );

    const nextButtonElement = getByTestId('nextButton');
    const doneButtonElement = getByTestId('doneButton');

    expect(nextButtonElement).toBeTruthy();
    expect(doneButtonElement).toBeTruthy();
  });

  it('devrait naviguer vers cgu quand onDone est appelé', () => {
    const component = new Accueil({ navigation: createNavigationProp() });
    component.onDone();
    expect(mockedReplace).toHaveBeenCalledWith('cgu');
  });

  it('devrait naviguer vers Login quand le lien "Se connecter" est cliqué', () => {
    const { getByText } = render(<Accueil navigation={createNavigationProp()} />);
    fireEvent.press(getByText('Se connecter'));
    expect(mockedNavigate).toHaveBeenCalledWith('Login');
  });

  it('devrait avoir le bon style pour le conteneur principal', () => {
    const { getByTestId } = render(<Accueil navigation={createNavigationProp()} />);
    const container = getByTestId('accueil-container');
    expect(container.props.style).toMatchObject({
      flex: 1,
      backgroundColor: '#FFF'
    });
  });

  it('devrait avoir le bon style pour le bouton ellipse', () => {
    const { getByTestId } = render(<Accueil navigation={createNavigationProp()} />);
    const ellipseButton = getByTestId('nextButton');
    expect(ellipseButton.props.style).toMatchObject({
      width: 282,
      height: 45,
      backgroundColor: '#49DD7B'
    });
  });
});
