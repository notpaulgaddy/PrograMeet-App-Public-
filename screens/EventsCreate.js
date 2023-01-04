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
	TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
	BLACK,
	DARKGREY,
	LIGHTGREY,
	MAGENTA,
	NAVYBLUE,
	WHITE,
} from "../config/Constants";
import {
	Button,
	IconButton,
	List,
	MD3Colors,
	Menu,
	Surface,
} from "react-native-paper";
import Toast from "react-native-root-toast";
import { useDispatch, useSelector } from "react-redux";
import EventService from "../services/EventService";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as RootNavigation from "../helpers/RootNavigation";

const EventsCreate = ({ navigation }) => {
	const [eventType, setEventType] = React.useState("");
	const [eventTitle, setEventTitle] = React.useState("");
	const [eventDate, setEventDate] = React.useState(new Date(Date.now()));
	const [eventDescription, setEventDescription] = React.useState("");
	const [eventLink, setEventLink] = React.useState("");
	const [saving, setSaving] = React.useState(false);
	const { user } = useSelector((state) => state.user);
	const [mode, setMode] = React.useState("date");
	const [show, setShow] = React.useState(false);
	const [visible, setVisible] = React.useState(false);

	const addEvent = async () => {
		let eventObj = {
			eventType,
			eventTitle,
			eventDate,
			eventLink,
			eventDescription,
			uid: user.userId,
		};

		if (
			eventObj.eventDate === "" ||
			eventObj.eventTitle === "" ||
			eventObj.eventType === "" ||
			eventObj.eventDescription === "",
			eventObj.eventLink === ""
		) {
			displayToast("Please fill in all the fields !");
			return;
		} else {
			setSaving(true);
			EventService.create(eventObj)
				.then((snap) => {
					displayToast("Event created");
					navigation.pop();
					setSaving(false);
				})
				.catch((error) => {
					navigation.pop();
					displayToast(JSON.stringify(error));
					setSaving(false);
				});
		}
	};
	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate;
		setShow(false);
		setEventDate(currentDate);
	};
	const showMode = (currentMode) => {
		setShow(true);
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showMode("date");
	};

	const showTimepicker = () => {
		showMode("time");
	};

	const openMenu = () => setVisible(true);

	const closeMenu = () => setVisible(false);

	const displayToast = (msg) => {
		Toast.show(msg, {
			duration: Toast.durations.LONG,
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.card}>
				<View style={styles.cardBody}>
					<ScrollView>
						<List.Subheader>Add new event</List.Subheader>

						<Surface
							style={{
								minHeight: 50,
								marginTop: 5,
							}}
						>
							<Text
								style={{
									paddingLeft: 10,
									paddingTop: 5,
								}}
							>
								Event Type
							</Text>

							{eventType !== "" && (
								<Text
									style={{
										fontWeight: "700",
									}}
								>
									{" "}
									Selected {eventType}
								</Text>
							)}

							<Menu
								anchor={
									<Button uppercase={false} onPress={openMenu}>
										Click to Select Event Type
									</Button>
								}
								visible={visible}
								onDismiss={closeMenu}
							>
								<Menu.Item
									onPress={(e) => {
										setEventType("Bootcamp");
										closeMenu();
									}}
									title="Bootcamp"
								/>
								<Menu.Item
									onPress={(e) => {
										setEventType("Game Night");
										closeMenu();
									}}
									title="Game Night"
								/>
								<Menu.Item
									onPress={(e) => {
										setEventType("Movie Night");
										closeMenu();
									}}
									title="Movie Night"
								/>
								<Menu.Item
									onPress={(e) => {
										setEventType("Other");
										closeMenu();
									}}
									title="Other"
								/>
							</Menu>
						</Surface>
						<Surface
							style={{
								minHeight: 50,
								marginTop: 5,
							}}
						>
							<Text
								style={{
									paddingLeft: 10,
									paddingTop: 5,
								}}
							>
								Event Title
							</Text>
							<TextInput
								style={{
									height: 50,
									padding: 10,
								}}
								placeholder="Title"
								onChangeText={(title) => setEventTitle(title)}
							/>
						</Surface>

						<Surface
							style={{
								marginTop: 5,
							}}
						>
							<Text
								style={{
									paddingLeft: 10,
									paddingTop: 5,
								}}
							>
								Date
							</Text>
							<TextInput
								multiline={true}
								numberOfLines={3}
								placeholder="Date Ex.(07/26/22)"
								onChangeText={(date) => setEventDate(date)}
								style={{
									height: 50,
									padding: 10,
								}}
							/>
						</Surface>
						<Surface
							style={{
								marginTop: 5,
							}}
						>
							<Text
								style={{
									paddingLeft: 10,
									paddingTop: 5,
								}}
							>
								Google Meet Link
							</Text>
							<TextInput
								multiline={true}
								numberOfLines={3}
								placeholder="Google Meet Link"
								onChangeText={(link) => setEventLink(link)}
								style={{
									height: 50,
									padding: 10,
								}}
							/>
						</Surface>
						<Surface
							style={{
								marginTop: 5,
							}}
						>
							<Text
								style={{
									paddingLeft: 10,
									paddingTop: 5,
								}}
							>
								Description
							</Text>
							<TextInput
								multiline={true}
								numberOfLines={3}
								placeholder="Event description"
								onChangeText={(desc) => setEventDescription(desc)}
								style={{
									height: 50,
									padding: 10,
								}}
							/>
						</Surface>
						<TouchableOpacity
							disabled={saving}
							onPress={addEvent}
							style={{
								marginTop: 10,
								backgroundColor: saving ? DARKGREY : MAGENTA,
								padding: 10,
							}}
						>
							<Text
								style={{
									alignSelf: "center",
									fontSize: 17,
									color: saving ? WHITE : LIGHTGREY,
									fontWeight: "bold",
								}}
							>
								{saving ? "Submitting..." : "Submit"}
							</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>
			</View>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: StatusBar.currentHeight,
		paddingBottom: StatusBar.currentHeight,
		backgroundColor: MAGENTA,
	},

	card: {
		backgroundColor: LIGHTGREY,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		flex: 1,
		alignItems: "center",
		flexDirection: "row",
		width: "100%",
	},
	cardBody: {
		marginHorizontal: 10,
		flex: 1,
		height: "100%",
	},
	postCard: {
		height: 100,
		backgroundColor: WHITE,
		marginTop: 15,
		elevation: 5,
		shadowColor: BLACK,
	},
	postCardFooter: {
		flex: 1,
		height: 40,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	postCardFooterRight: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
	},
	profile: {
		flex: 1,
		height: 30,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	profileInner: {
		width: "50%",
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
});

export default EventsCreate;
