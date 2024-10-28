import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ImageGallery, { ImageThumb } from "../../../screens/newScreen/Gallery"; // Remplacez par le chemin réel
import { getImage } from "../../../api/http";
import { Dimensions } from "react-native";

jest.mock("../../../api/http", () => ({
  getImage: jest.fn((id) => ({ uri: `https://example.com/${id}.jpg` })),
}));

describe("ImageGallery Component", () => {
  const mockNavigation = { push: jest.fn() };

  const photos = ["photo1", "photo2"];

  it("renders the FlatList and images correctly", () => {
    const { getAllByTestId } = render(
      <ImageGallery route={{ params: { photos } }} navigation={mockNavigation} />
    );

    const imageThumbnails = getAllByTestId("image-thumb");
    expect(imageThumbnails.length).toBe(photos.length);

    photos.forEach((photo, index) => {
      const imageSource = getImage(photo);
      expect(imageThumbnails[index].props.source).toEqual(imageSource);
    });
  });

  it("navigates to Image screen with the correct source on image press", () => {
    const { getAllByTestId } = render(
      <ImageGallery route={{ params: { photos } }} navigation={mockNavigation} />
    );

    const imageThumbnails = getAllByTestId("image-thumb");
    fireEvent.press(imageThumbnails[0]);

    expect(mockNavigation.push).toHaveBeenCalledWith("Image", {
      source: getImage(photos[0]),
    });
  });
});

describe("ImageThumb Component", () => {
  it("renders with correct source and style", () => {
    const source = { uri: "https://example.com/photo.jpg" };
    const { getByTestId } = render(<ImageThumb source={source} />);

    const imageThumb = getByTestId("image-thumb");
    expect(imageThumb.props.source).toEqual(source);
    expect(imageThumb.props.style.width).toBeCloseTo(Dimensions.get("window").width * 0.45);
    expect(imageThumb.props.style.height).toBeCloseTo(
      Dimensions.get("window").width * 0.45 * 0.7
    );
  });
});
