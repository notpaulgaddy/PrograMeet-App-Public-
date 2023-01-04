import React from "react";
import {
	StyleSheet,
	Text,
	Dimensions,
	TextInput,
	SafeAreaView,
	Image,
	View,
	ScrollView,
	Linking
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
import EventService from "../services/EventService";
const EventBox = ({
	navigation,
	eventKey,
	userType,
	eventType,
	eventName,
	eventTime,
	eventLink,
	eventDate,
	eventDescription,
	createdAt,
}) => {
	const [visible, setVisible] = React.useState(false);

	const showDialog = () => setVisible(true);

	const hideDialog = () => setVisible(false);
	console.log(eventTime);
	const removeEvent = async () => {
		EventService.delete(eventKey)
			.then((snap) => {
				displayToast("Event deleted !");
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
			<View style={styles.eventType}>
				<Text style={styles.eventTypeCSS}>{eventType}</Text>
			</View>
			<View style={styles.lowerBox}>
				<Text style={styles.eventName}>{eventName}</Text>
				<Text style={styles.eventTime}>{eventDate}</Text>
				<Text style={styles.eventDescription}>{eventDescription}</Text>
				<Text style={styles.eventLink} onPress={() => Linking.openURL(eventLink)}>{eventLink}</Text>
			</View>
			{userType === "admin" ? (
				<Card>
					<Card.Actions>
						<Button
							onPress={() =>
								navigation.navigate("EditEvent", {
									event: {
										eventType,
										eventName,
										eventKey,
										eventDescription,
										eventTime,
										eventLink,
										evDate: eventDate,
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
						<Paragraph>Are you sure you want to delete this event?</Paragraph>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={removeEvent}>OK</Button>
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
		width: "100%",
		minHeight: 206,
	},
	eventName: {
		fontSize: 32,
		textAlign: "center",
		paddingTop: 20,
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
	eventLink:{fontSize: 15, textAlign: "center", paddingTop: 20,color:'#0099ff'},
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
export default EventBox;
