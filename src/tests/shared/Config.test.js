import React from "react";
import navigationOption, { styles } from "../../shared/Config"; 
import { render } from "@testing-library/react-native";
import HeaderLeft from "../../utils/HeaderLeft"; 

jest.mock("../../utils/HeaderLeft", () => {
  return jest.fn(() => <></>); 
});


describe("styles", () => {
  it("has the correct styles defined", () => {
    expect(styles.container).toMatchObject({
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
      height: 60,
      backgroundColor: "#fff",
      borderBottomColor: "#fff",
    });
    expect(styles.notification).toMatchObject({
      marginRight: 8,
    });
    expect(styles.title).toMatchObject({
      fontSize: 16,
      textAlign: "center",
      fontWeight: "bold",
      color: "#38A3D0",
    });
    expect(styles.colorApp).toMatchObject({
      color: "#f43c4e",
    });
  });
});
