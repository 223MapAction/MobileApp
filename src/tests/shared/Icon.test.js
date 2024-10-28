import React from "react";
import { render } from "@testing-library/react-native";
import IconComponent from "../../shared/Icon"; 

describe("IconComponent", () => {
    it("affiche l'icône avec les propriétés correctes lorsqu'elle est concentrée", () => {
      const { toJSON } = render(
        <IconComponent focused={true} name="home" color="#000" />
      );
  
      const tree = toJSON();
      
      // Vérifiez que l'icône est rendue avec les bonnes propriétés
      expect(tree).toMatchSnapshot();
      expect(tree.props.name).toBe("home");
      expect(tree.props.style).toMatchObject({ color: "#000" });
    });
  
    it("affiche l'icône avec les propriétés correctes lorsqu'elle n'est pas concentrée", () => {
      const { toJSON } = render(
        <IconComponent focused={false} name="user" color="#fff" />
      );
  
      const tree = toJSON();
  
      expect(tree).toMatchSnapshot();
      expect(tree.props.name).toBe("user");
      expect(tree.props.style).toMatchObject({ color: "#fff" });
    });
  });