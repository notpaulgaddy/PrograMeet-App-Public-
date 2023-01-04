import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MAGENTA } from "../config/Constants";

const EmailVerify = ({ navigation }) => {
	console.log(navigation);
	return (
		<View>
			<View>
				<Text style={styles.boldText}>Email verification</Text>
				<Text style={styles.mainText}>
					We have sent a verification code to your email, please click the link
					in order to verify your account and login again.{" "}
				</Text>
			</View>
			<Image
				source={require("../assets/emailv.png")}
				style={styles.imageEmail}
			/>
			<TouchableOpacity
				onPress={() => navigation.goBack()}
				style={{
					alignSelf: "center",
					backgroundColor: MAGENTA,
					padding: 15,
					marginTop: 20,
					borderRadius: 20,
				}}
			>
				<Text> Go Back</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	boldText: {
		fontWeight: "bold",
		fontSize: 30,
		textAlign: "center",
		color: "black",
		marginTop: "30%",
	},
	mainText: {
		color: "#969696",
		fontSize: 22,
		textAlign: "center",
		marginTop: 30,
	},
	imageEmail: {
		marginTop: 30,
		resizeMode: "contain",
		alignSelf: "center",
	},
});

export default EmailVerify;
