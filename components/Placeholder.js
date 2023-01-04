import React, { useState, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const Placeholder = () => {
	return (
		<View style={styles.placeContainer}>
			<ActivityIndicator />
		</View>
	);
};

const styles = StyleSheet.create({
	placeContainer: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
});

export default Placeholder;