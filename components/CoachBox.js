import React from "react";
import {
	StyleSheet,
	Text,
	Dimensions,
	TextInput,
	SafeAreaView,
	Image,
	TouchableOpacity,
	View,
	ScrollView,
} from "react-native";
import Toast from "react-native-root-toast";
import { DARKGREY, LIGHTGREY, NAVYBLUE } from "../config/Constants";
import {
	Button,
	Card,
	Paragraph,
	Dialog,
	Portal,
	Provider,
} from "react-native-paper";
import CoachService from "../services/CoachService";
const CoachBox = ({
	navigation,
	coachKey,
	fName,
	createdAt,
	coachSkills,
	bio,
	userType,
}) => {
	const [visible, setVisible] = React.useState(false);

	const showDialog = () => setVisible(true);

	const hideDialog = () => setVisible(false);

	const removeCoach = async () => {
		CoachService.delete(coachKey)
			.then((snap) => {
				displayToast("Coach deleted!");
				hideDialog();
			})

			.catch((error) => {
				hideDialog();
				console.log(error);
			});
	};
	const displayToast = (msg) => {
		Toast.show(msg, {
			duration: Toast.durations.LONG,
		});
	};
	return (
		<View style={styles.eventBox}>
			<View style={styles.lowerBox}>
				<Text style={styles.eventName}>{fName}</Text>
				<Text style={styles.eventDescription}>{bio}</Text>
				<Text style={styles.eventDescription}>{coachSkills}</Text>
			</View>
			{userType === "admin" ? (
				<Card>
					<Card.Actions>
						<Button
							onPress={() =>
								navigation.navigate("Coach Edit", {
									coach: {
										fName,
										bio,
										coachSkills,
										coachKey,
										createdAt,
										
									},
								})
							}
							icon={"pen"}
						>
							Edit
						</Button>
						<Button onPress={() => showDialog()} icon={"delete"}>
							Delete
						</Button>
					</Card.Actions>
				</Card>
			) : null}

			<Portal>
				<Dialog visible={visible} onDismiss={hideDialog}>
					<Dialog.Title>Delete?</Dialog.Title>
					<Dialog.Content>
						<Paragraph>Are you sure you want to delete this coach?</Paragraph>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={removeCoach}>OK</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
	);
};
const styles = StyleSheet.create({
	eventBox: {
		alignSelf: "center",
		borderColor: DARKGREY,
		borderWidth: 1,
		marginTop: 10,
		width: "95%",
		minHeight: 206,
	},
	calendarButton: {
		backgroundColor: "#FBF608",
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		width: 121,
		marginRight: "5%",
	},
	profileButton: {
		backgroundColor: "#00BBF9",
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		width: 121,
	},
	calProf: {
		flexDirection: "row",
	},
	eventName: {
		fontSize: 32,
		textAlign: "center",
		paddingTop: 20,
	},
	CoachImg: {
		width: 100,
		height: 100,
		marginTop: 20,
	},
	eventTime: {
		fontSize: 15,
		textAlign: "center",
		paddingTop: 20,
	},
	eventType: {
		height: 62,
		backgroundColor: NAVYBLUE,
		borderBottomWidth: 1,
		borderBottomColor: DARKGREY,
	},
	eventDescription: { fontSize: 15, textAlign: "center", paddingTop: 20 },
	eventTypeCSS: {
		textAlign: "center",
		fontSize: 40,
		color: LIGHTGREY,
	},
	lowerBox: {
		minHeight: 120,
		padding: 15,
	},
});
export default CoachBox;
