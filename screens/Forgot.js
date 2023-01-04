import React, { useState } from "react";
import {
	StyleSheet,
	TextInput,
	Text,
	TouchableOpacity,
	Image,
	View,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { LIGHTGREY, WHITE } from "../config/Constants";
import Toast from "react-native-root-toast";
import { auth } from "../config/firebase";

const Forgot = () => {
	const [email, setEmail] = useState("");
	const [disabled, setDisabled] = useState(false);

	const sendResetLink = () => {


		if (email === "") {
			displayToast("Please provide email address");
			return;
		}
		setDisabled(true);
		sendPasswordResetEmail(auth, email)
			.then(() => {
				displayToast("A password reset link have been sent, check your email");
				setDisabled(false);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === "auth/user-not-found") displayToast("Use not found");
				else displayToast(errorMessage);
				setDisabled(false);
				console.log(JSON.stringify(error));
				// ..
			});
	};
	const displayToast = (msg) => {
		Toast.show(msg, {
			duration: Toast.durations.LONG,
		});
	};
	return (
		<View style={styles.container}>
			<View style={styles.logoContainer}>
				<Image style={styles.logo} source={require("../assets/Logo.png")} />
			</View>
			<View>
				<Text style={styles.title}>Password Reset</Text>
			</View>
			<View style={styles.form}>
				<View></View>
				<View style={styles.textInputArea}>
					<TextInput
						style={styles.emailBox}
						focusable={true}
						placeholder="Email"
						onChangeText={(em) => setEmail(em)}
						keyboardType="email-address"
						placeholderTextColor="#003f5c"
					/>
				</View>
				<TouchableOpacity style={styles.authBtnArea} onPress={sendResetLink}>
					<Text style={styles.buttonText}>Send Password Reset Link</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default Forgot;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: LIGHTGREY,

		justifyContent: "center",
	},
	form: {
		marginHorizontal: 20,
	},
	emailBox: { width: "20%" },
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
	logoContainer: {
		height: 100,
		flexDirection: "row",
		padding: 10,
		width: "90%",
		marginBottom: 40,
	},
	logo: {
		height: 90,
		width: "100%",
		resizeMode: "contain",
		marginTop: -100,
		justifyContent: "center",
		alignItems: "center",
	},
	authBtnArea: {
		borderRadius: 10,
		height: 50,
		color: "white",
		alignItems: "center",
		justifyContent: "center",
		marginTop: "10%",
		backgroundColor: "#FB275D",
	},
	title: {
		fontWeight: "700",
		fontSize: 25,
		color: "black",
		marginTop: -90,
		marginLeft: "25%",
	},
	textInputArea: {
		backgroundColor: WHITE,
		borderRadius: 15,
		marginTop: 10,
		padding: 15,
	},
});
