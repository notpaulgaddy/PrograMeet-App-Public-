import React from "react";

import { View, StyleSheet, Text } from "react-native";

const Header = () => {
  return <View style={styles.header}></View>;
};

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: "#FB275D",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
});
