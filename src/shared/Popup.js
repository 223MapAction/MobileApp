import { Modal, View, Dimensions, ActivityIndicator } from "react-native";
import React, { Component } from "react";

const width = Dimensions.get("window").width;

export default class Popup extends Component {
  state = {
    visible: true,
  };

  componentDidUpdate() {
    if (!this.state.visible) {
      this.props.onHide();
    }
  }

  render() {
    return (
      <Modal
        testID="modal"
        animationType="slide"
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          this.setState({ visible: false });
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,.2)",
          }}
        >
          <View
            style={[
              {
                width: width * 0.9,
                paddingHorizontal: 10,
                backgroundColor: "#fff",
                paddingVertical: 20,
                borderRadius: 15,
                justifyContent: "space-around",
              },
            ]}
          >
            {this.props.children}
          </View>
        </View>
      </Modal>
    );
  }
}
